<?php

namespace App\Http\Controllers;

use App\Mail\PaymentSuccessEmail;
use App\Models\Payment;
use App\Models\ReferralUsage;
use App\Models\Subscription;
use App\Services\PaystackService;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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
                'movie_id' => ['sometimes'],
                'referral_code' => ['sometimes', 'string', 'max:50'], // optional referral code
                'email' => ['sometimes', 'email'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Payment validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'user_id' => $user->id,
            ]);
            throw $e;
        }

        // Apply referral discount if code is provided
        $finalAmount = (int) $validated['amount'];
        $discountPercentage = 0;
        $referralCodeId = null;

        if (! empty($validated['referral_code'])) {
            try {
                $discountPercentage = $referralService->validateCode($validated['referral_code']);
                $finalAmount = (int) ($finalAmount * (1 - $discountPercentage / 100));

                // Get the referral code ID for logging usage
                $referralCode = \App\Models\ReferralCode::where('code', $validated['referral_code'])->active()->first();
                $referralCodeId = $referralCode?->id;
            } catch (\Exception $e) {
                Log::warning('Referral code validation failed during payment', [
                    'code' => $validated['referral_code'],
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
                // Continue without discount if code is invalid
            }
        }

        $reference = $paystack->generateReference();

        $payment = Payment::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'amount' => $finalAmount, // Store the discounted amount
            'currency' => $validated['currency'] ?? config('paystack.currency'),
            'status' => 'initialized',
            'meta' => [
                'movie_id' => $validated['movie_id'] ?? null,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referral_code' => $validated['referral_code'] ?? null,
                'discount_percentage' => $discountPercentage,
                'original_amount' => $validated['amount'],
            ],
        ]);

        // Ensure a valid email is sent to Paystack; fallback to configured safe default for invalid inputs
        $billingEmail = trim((string) ($validated['email'] ?? $user->email ?? ''));

        // Reject emails that Paystack does not accept
        $invalid = fn ($email) => ! filter_var($email, FILTER_VALIDATE_EMAIL) ||
            Str::endsWith($email, ['.local', '.test', '.invalid']) ||
            Str::contains($email, ['@example.', '@localhost']) ||
            Str::contains($email, ['@test']) ||
            preg_match('/\.local(domain)?$/i', $email);

        if ($invalid($billingEmail)) {
            Log::warning('Billing email rejected; using fallback', [
                'user_id' => $user->id,
                'provided_email' => $billingEmail,
            ]);

            $billingEmail = config('custom.fallback_billing_email')
                ?: (config('mail.from.address') ?? 'billing@acrazydayinaccra.com');
        }

        $payload = [
            'email' => $billingEmail,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'reference' => $payment->reference,
            'callback_url' => config('paystack.callback_url'),
            'metadata' => [
                'user_id' => $user->id,
                'payment_id' => $payment->id,
                'movie_id' => $payment->meta['movie_id'] ?? null,
                'discount_percentage' => $discountPercentage,
            ],
        ];

        Log::info('Paystack initialization request', [
            'payment_id' => $payment->id,
            'user_id' => $user->id,
            'billing_email' => $billingEmail,
        ]);

        $resp = $paystack->initialize($payload);

        Log::info('Paystack initialization response', [
            'status' => $resp['status'] ?? null,
            'ok' => $resp['ok'] ?? null,
            'body' => $resp['body'] ?? null,
            'discount_applied' => $discountPercentage,
        ]);

        if (! $resp['ok'] || empty($resp['body']['status'])) {
            $payment->update(['status' => 'failed']);

            Log::error('Payment initialization failed', [
                'payment_id' => $payment->id,
                'response' => $resp,
            ]);

            return response()->json([
                'message' => 'Unable to initialize payment',
                'details' => $resp['body'] ?? null,
            ], 422);
        }

        $data = $resp['body']['data'] ?? [];
        if (! isset($data['authorization_url'])) {
            $payment->update(['status' => 'failed']);

            return response()->json(['message' => 'Initialization response incomplete'], 422);
        }

        return response()->json([
            'authorization_url' => $data['authorization_url'],
            'reference' => $payment->reference,
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

                return redirect('/')->with('status', 'Payment successful');
            }
        }

        $payment->status = 'failed';
        $payment->save();

        return redirect('/')->with('status', 'Payment failed');
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

                // Record referral code usage if a discount was applied
                if (! empty($payment->meta['referral_code'])) {
                    try {
                        $referralCode = \App\Models\ReferralCode::where('code', $payment->meta['referral_code'])->active()->first();
                        if ($referralCode) {
                            ReferralUsage::create([
                                'referral_code_id' => $referralCode->id,
                                'user_id' => $payment->user_id,
                                'discount_applied' => ($payment->meta['original_amount'] - $payment->amount) / 100, // Convert from pesewas to cedis
                            ]);

                            Log::info('Referral usage recorded', [
                                'referral_code' => $payment->meta['referral_code'],
                                'user_id' => $payment->user_id,
                                'discount_amount' => ($payment->meta['original_amount'] - $payment->amount) / 100,
                            ]);
                        }
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

                    try {
                        Mail::send(new PaymentSuccessEmail($payment, $subscription));
                        Log::info('Payment success email sent', [
                            'payment_id' => $payment->id,
                            'user_id' => $payment->user_id,
                            'subscription_id' => $subscription->id,
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Failed to send payment success email', [
                            'payment_id' => $payment->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }
            } else {
                $payment->status = 'failed';
                $payment->save();
            }
        }

        return response()->json(['ok' => true]);
    }
}
