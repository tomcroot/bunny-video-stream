<?php

namespace App\Http\Controllers;

use App\Jobs\SendPaymentSuccessEmailJob;
use App\Models\Payment;
use App\Models\ReferralUsage;
use App\Models\Subscription;
use App\Services\PaystackService;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class PaymentController extends Controller
{
    public function init(Request $request, PaystackService $paystack, ReferralService $referralService)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['message' => 'Unauthorized. Please log in to continue.'], 401);
        }

        try {
            $validated = $request->validate([
                'amount' => ['required', 'integer', 'min:100'], // minor units (e.g., 100 pesewas = 1.00)
                'currency' => ['sometimes', 'string', 'size:3'],
                'movie_id' => ['nullable'],
                'referral_code' => ['nullable', 'string', 'max:50'], // optional referral code
                'email' => ['nullable', 'email'], // optional - use default if not provided
                'channel' => ['sometimes', 'string', 'max:50'], // card / mobile_money (for logging / future use)
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Payment validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Payment initialization error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'message' => 'An error occurred during payment initialization. Please try again.',
            ], 500);
        }

        // ✅ PREVENT DUPLICATE ACCESS: user already has a successful payment / subscription
        $movieId = $validated['movie_id'] ?? null;

        $alreadyPaid = Subscription::where('user_id', $user->id)
            ->when($movieId, fn ($q) => $q->where('movie_id', $movieId))
            ->where('expires_at', '>', now())
            ->exists();

        if ($alreadyPaid) {
            return response()->json([
                'already_paid' => true,
                'message' => 'You already have access to this movie.',
                'redirect_url' => url('/watch'),
            ], 200);
        }

        // ✅ Velocity limiting (anti-fraud)
        $key = 'pay-init:'.$user->id;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return response()->json(['message' => 'Too many attempts. Slow down.'], 429);
        }
        RateLimiter::hit($key, 60);

        // ✅ Idempotency / Anti-replay
        $lock = Cache::lock('payment-init-'.$user->id, 10);
        if (! $lock->get()) {
            return response()->json(['message' => 'Duplicate payment attempt blocked'], 409);
        }

        try {
            $finalAmount = (int) $validated['amount'];
            $discountPercentage = 0;

            if (! empty($validated['referral_code'])) {
                $discountPercentage = $referralService->validateCode($validated['referral_code']);
                $finalAmount = (int) ($finalAmount * (1 - $discountPercentage / 100));
            }

            // Use default email if not provided
            $email = $validated['email'] ?? $user->phone_number.'@acrazydayinaccra.com';

            $reference = $paystack->generateReference();

            $payment = Payment::create([
                'user_id' => $user->id,
                'reference' => $reference,
                'amount' => $finalAmount,
                'currency' => $validated['currency'] ?? 'GHS',
                'status' => 'initialized',
                'meta' => [
                    'movie_id' => $validated['movie_id'] ?? null,
                    'referral_code' => $validated['referral_code'] ?? null,
                ],
            ]);

            $payload = [
                'email' => $email,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'reference' => $payment->reference,
                'callback_url' => config('paystack.callback_url'),
                'metadata' => [
                    'user_id' => $user->id,
                    'payment_id' => $payment->id,
                    'movie_id' => $payment->meta['movie_id'],
                ],
            ];

            $resp = $paystack->initialize($payload);

            if (! $resp['ok']) {
                $payment->update(['status' => 'failed']);

                // Check if request is from Inertia
                if (request()->header('X-Inertia')) {
                    return back()->with('error', 'Paystack init failed');
                }

                return response()->json(['message' => 'Paystack init failed'], 422);
            }

            // Check if request is from Inertia
            if (request()->header('X-Inertia')) {
                return \Inertia\Inertia::location($resp['body']['data']['authorization_url']);
            }

            return response()->json([
                'authorization_url' => $resp['body']['data']['authorization_url'],
                'reference' => $payment->reference,
            ]);
        } finally {
            optional($lock)->release();
        }
    }

    public function status(string $reference)
    {
        $payment = Payment::where('reference', $reference)->first();

        if (! $payment) {
            return response()->json([
                'status' => 'not_found',
                'message' => 'Payment not found.',
            ], 404);
        }

        return response()->json([
            'status' => $payment->status,        // initialized | success | failed | abandoned
            'paid_at' => $payment->paid_at,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'redirect_url' => $payment->status === 'success' ? url('/watch') : null,
        ]);
    }

    public function callback(Request $request, PaystackService $paystack)
    {
        $reference = (string) $request->query('reference', '');
        if ($reference === '') {
            return redirect('/')->with('status', 'Missing payment reference');
        }

        $payment = Payment::where('reference', $reference)->first();
        if (! $payment) {
            return redirect('/')->with('status', 'Payment not found');
        }

        $verify = $paystack->verify($reference);
        $payment->increment('verify_attempts');
        $payment->forceFill(['last_verify_at' => now()])->save();

        if ($verify['ok'] && ($verify['body']['status'] ?? false) === true) {
            $data = $verify['body']['data'] ?? [];
            $status = $data['status'] ?? 'failed';
            $payment->channel = $data['channel'] ?? $payment->channel;
            $payment->gateway_response = $data['gateway_response'] ?? $payment->gateway_response;

            if ($status === 'success') {
                $payment->status = 'success';
                $payment->authorization_code = $data['authorization']['authorization_code'] ?? $payment->authorization_code;
                $payment->paid_at = $payment->paid_at ?: now();
                $payment->save();

                // Create subscription with 365-day expiry
                $movieId = $payment->meta['movie_id'] ?? null;
                if ($movieId) {
                    $subscription = Subscription::updateOrCreate(
                        [
                            'user_id' => $payment->user_id,
                            'movie_id' => $movieId,
                        ],
                        [
                            'payment_id' => $payment->id,
                            'expires_at' => now()->addDays(365),
                        ]
                    );

                    // Dispatch payment success email job (non-blocking)
                    SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id);
                    Log::info('Payment success email job dispatched', [
                        'payment_id' => $payment->id,
                        'subscription_id' => $subscription->id,
                    ]);
                }

                return redirect('/watch')->with('status', 'Payment successful! Enjoy your movie.');
            }
        }

        $payment->status = 'failed';
        $payment->save();

        return redirect('/')->with('status', 'Payment verification failed. Please contact support if you were charged.');
    }

    public function webhook(Request $request, PaystackService $paystack)
    {
        $raw = $request->getContent();
        $sig = $request->header('x-paystack-signature');

        if (! $paystack->validWebhookSignature($raw, $sig)) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $payload = $request->json()->all();
        $event = $payload['event'] ?? null;

        if ($event !== 'charge.success') {
            return response()->json(['ok' => true]);
        }

        $reference = $payload['data']['reference'] ?? null;

        if (! $reference) {
            return response()->json(['message' => 'Missing reference'], 422);
        }

        $payment = Payment::where('reference', $reference)->first();
        if (! $payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Always verify with gateway for idempotency & accuracy
        $verify = $paystack->verify($reference);
        $payment->increment('verify_attempts');
        $payment->forceFill(['last_verify_at' => now()])->save();

        if ($verify['ok'] && ($verify['body']['status'] ?? false) === true) {
            $data = $verify['body']['data'] ?? [];
            $payment->channel = $data['channel'] ?? $payment->channel;
            $payment->gateway_response = $data['gateway_response'] ?? $payment->gateway_response;
            $status = $data['status'] ?? 'failed';

            if ($status === 'success') {
                $payment->status = 'success';
                $payment->authorization_code = $data['authorization']['authorization_code'] ?? $payment->authorization_code;
                $payment->paid_at = $payment->paid_at ?: now();
                $payment->save();

                // Record referral usage (idempotent)
                if (! empty($payment->meta['referral_code'])) {
                    try {
                        ReferralUsage::firstOrCreate(
                            ['payment_id' => $payment->id],
                            [
                                'referral_code' => $payment->meta['referral_code'],
                                'user_id' => $payment->user_id,
                                'discount_amount' => ($payment->meta['original_amount'] - $payment->amount) / 100,
                            ]
                        );
                    } catch (\Exception $e) {
                        Log::error('Failed to record referral usage', [
                            'payment_id' => $payment->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }

                // Create subscription with 365-day expiry
                $movieId = $payment->meta['movie_id'] ?? null;
                if ($movieId) {
                    $subscription = Subscription::updateOrCreate(
                        [
                            'user_id' => $payment->user_id,
                            'movie_id' => $movieId,
                        ],
                        [
                            'payment_id' => $payment->id,
                            'expires_at' => now()->addDays(365),
                        ]
                    );

                    // Dispatch payment success email job (non-blocking)
                    SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id);
                    Log::info('Payment success email job dispatched (webhook)', [
                        'payment_id' => $payment->id,
                        'subscription_id' => $subscription->id,
                    ]);
                }
            } else {
                $payment->status = 'failed';
                $payment->save();
            }
        }

        return response()->json(['ok' => true]);
    }
}
