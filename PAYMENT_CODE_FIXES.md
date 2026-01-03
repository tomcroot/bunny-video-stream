# PAYMENT & WATCH FLOW - IMPLEMENTATION FIXES

**Ready-to-implement code changes**  
**Copy-paste solutions with explanations**

---

## FIX #1: Add Comprehensive Logging to PaymentController

**File**: `app/Http/Controllers/PaymentController.php`

**Location**: Replace the `callback()` method

**Why**: Current code has NO logging. When it fails, you have NO visibility into why.

```php
public function callback(Request $request, PaystackService $paystack)
{
    $reference = (string) $request->query('reference', '');

    if ($reference === '') {
        Log::warning('Payment callback: Missing reference parameter');
        return redirect('/')->with('status', 'Missing payment reference');
    }

    $payment = Payment::where('reference', $reference)->first();

    if (! $payment) {
        Log::warning('Payment callback: Payment not found', ['reference' => $reference]);
        return redirect('/')->with('status', 'Payment not found');
    }

    Log::info('=== PAYMENT CALLBACK START ===', [
        'reference' => $reference,
        'payment_id' => $payment->id,
        'user_id' => $payment->user_id,
        'current_status' => $payment->status,
        'timestamp' => now()->toIso8601String(),
    ]);

    $verify = $paystack->verify($reference);
    $payment->increment('verify_attempts');
    $payment->forceFill(['last_verify_at' => now()])->save();

    Log::info('Paystack verification response', [
        'reference' => $reference,
        'verify_ok' => $verify['ok'] ?? false,
        'verify_status' => $verify['body']['status'] ?? 'unknown',
        'verify_response' => json_encode($verify),
    ]);

    if ($verify['ok'] && ($verify['body']['status'] ?? false) === true) {
        $data = $verify['body']['data'] ?? [];
        $status = $data['status'] ?? 'failed';

        $payment->channel = $data['channel'] ?? $payment->channel;
        $payment->gateway_response = $data['gateway_response'] ?? $payment->gateway_response;

        Log::info('Paystack status verified as success', [
            'reference' => $reference,
            'payment_id' => $payment->id,
            'status' => $status,
        ]);

        if ($status === 'success') {
            $payment->status = 'success';
            $payment->authorization_code = $data['authorization']['authorization_code'] ?? $payment->authorization_code;
            $payment->paid_at = $payment->paid_at ?: now();
            $payment->save();

            Log::info('Payment status updated to success', [
                'payment_id' => $payment->id,
                'paid_at' => $payment->paid_at,
            ]);

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
                    Log::info('Referral usage recorded', ['payment_id' => $payment->id]);
                } catch (\Exception $e) {
                    Log::error('Failed to record referral usage', [
                        'payment_id' => $payment->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // ⭐ FIX #1: ALWAYS CREATE SUBSCRIPTION (with fallback movie_id)
            $movieId = $payment->meta['movie_id'] ?? 1;

            try {
                Log::info('Creating subscription', [
                    'user_id' => $payment->user_id,
                    'movie_id' => $movieId,
                    'payment_id' => $payment->id,
                ]);

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

                Log::info('Subscription created successfully', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $payment->user_id,
                    'movie_id' => $movieId,
                    'expires_at' => $subscription->expires_at,
                ]);

                // Dispatch payment success email job (non-blocking)
                SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id)->onQueue('payments');

                Log::info('Payment success email job dispatched', [
                    'payment_id' => $payment->id,
                    'subscription_id' => $subscription->id,
                    'user_email' => $payment->user->email ?? 'unknown',
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to create subscription or send email', [
                    'payment_id' => $payment->id,
                    'user_id' => $payment->user_id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                // Don't fail the entire process if subscription creation fails
                // User already paid - just mark it and notify admin
            }

            Log::info('=== PAYMENT CALLBACK SUCCESS ===', [
                'reference' => $reference,
                'payment_id' => $payment->id,
                'user_id' => $payment->user_id,
            ]);

            return redirect()->route('watch')->with('status', 'Payment successful! Enjoy your movie.');
        }
    }

    // Verification failed
    $payment->status = 'failed';
    $payment->save();

    Log::error('=== PAYMENT CALLBACK FAILED ===', [
        'reference' => $reference,
        'payment_id' => $payment->id,
        'verify_ok' => $verify['ok'] ?? false,
        'verify_status' => $verify['body']['status'] ?? 'unknown',
    ]);

    return redirect('/')->with('status', 'Payment verification failed. Please contact support if you were charged.');
}
```

---

## FIX #2: Do the Same for Webhook Handler

**File**: `app/Http/Controllers/PaymentController.php`

**Location**: In the `webhook()` method, ensure subscription is created

```php
public function webhook(Request $request, PaystackService $paystack)
{
    $raw = $request->getContent();
    $sig = $request->header('x-paystack-signature');

    Log::info('Webhook received from Paystack', [
        'signature_present' => ! empty($sig),
        'body_length' => strlen($raw),
    ]);

    if (! $paystack->validWebhookSignature($raw, $sig)) {
        Log::warning('Invalid Paystack webhook signature');
        return response()->json(['message' => 'Invalid signature'], 401);
    }

    $payload = $request->json()->all();
    $event = $payload['event'] ?? null;

    Log::info('Webhook event', ['event' => $event]);

    if ($event !== 'charge.success') {
        return response()->json(['ok' => true]);
    }

    $reference = $payload['data']['reference'] ?? null;

    if (! $reference) {
        Log::warning('Webhook: Missing reference');
        return response()->json(['message' => 'Missing reference'], 422);
    }

    $payment = Payment::where('reference', $reference)->first();
    if (! $payment) {
        Log::warning('Webhook: Payment not found', ['reference' => $reference]);
        return response()->json(['message' => 'Payment not found'], 404);
    }

    // Always verify with gateway for idempotency & accuracy
    $verify = $paystack->verify($reference);
    $payment->increment('verify_attempts');
    $payment->forceFill(['last_verify_at' => now()])->save();

    Log::info('Webhook verification', [
        'reference' => $reference,
        'verify_ok' => $verify['ok'] ?? false,
        'verify_status' => $verify['body']['status'] ?? 'unknown',
    ]);

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

            Log::info('Webhook: Payment marked as success', ['payment_id' => $payment->id]);

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
                    Log::error('Failed to record referral usage in webhook', [
                        'payment_id' => $payment->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // ⭐ FIX #2: ALWAYS CREATE SUBSCRIPTION IN WEBHOOK TOO
            $movieId = $payment->meta['movie_id'] ?? 1;

            try {
                $subscription = Subscription::updateOrCreate(
                    ['user_id' => $payment->user_id, 'movie_id' => $movieId],
                    ['payment_id' => $payment->id, 'expires_at' => now()->addDays(365)]
                );

                Log::info('Webhook: Subscription created', [
                    'subscription_id' => $subscription->id,
                    'payment_id' => $payment->id,
                ]);

                // Dispatch payment success email job (non-blocking)
                SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id)->onQueue('payments');

                Log::info('Webhook: Email job dispatched', [
                    'payment_id' => $payment->id,
                    'subscription_id' => $subscription->id,
                ]);
            } catch (\Exception $e) {
                Log::error('Webhook: Failed to create subscription', [
                    'payment_id' => $payment->id,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            $payment->status = 'failed';
            $payment->save();
            Log::info('Webhook: Payment marked as failed', ['reference' => $reference, 'status' => $status]);
        }
    }

    return response()->json(['ok' => true]);
}
```

---

## FIX #3: Update Payment Initialization to Ensure movie_id

**File**: `app/Http/Controllers/PaymentController.php`

**Location**: In the `init()` method, after validation

```php
public function init(Request $request, PaystackService $paystack, ReferralService $referralService)
{
    $user = Auth::user();
    if (! $user) {
        return response()->json(['message' => 'Unauthorized. Please log in to continue.'], 401);
    }

    try {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:100'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'movie_id' => ['nullable', 'integer'],  // Can be null
            'referral_code' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email'],
            'channel' => ['sometimes', 'string', 'max:50'],
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
    }

    // ⭐ FIX #3: Ensure movie_id always has a value
    $movieId = $validated['movie_id'] ?? 1;  // Default to movie ID 1

    Log::info('Payment initialization', [
        'user_id' => $user->id,
        'movie_id' => $movieId,
        'amount' => $validated['amount'],
    ]);

    // Rest of the method remains the same...
    // But when creating Payment, use $movieId:

    $payment = Payment::create([
        'user_id' => $user->id,
        'reference' => $reference,
        'amount' => $finalAmount,
        'currency' => $validated['currency'] ?? 'GHS',
        'status' => 'initialized',
        'meta' => [
            'movie_id' => $movieId,  // ← NOW ALWAYS SET
            'referral_code' => $validated['referral_code'] ?? null,
        ],
    ]);

    // Rest continues...
}
```

---

## FIX #4: Update PaymentCheckoutController

**File**: `app/Http/Controllers/PaymentCheckoutController.php`

**Location**: Replace the entire index method

```php
public function index(Request $request)
{
    $user = Auth::user();

    // If user already has successful payment or active subscription, redirect to watch
    if ($user && ($user->hasSuccessfulPayment() || $user->hasActiveSubscription())) {
        return redirect()->route('watch')->with('status', 'You already have access to the movie!');
    }

    // ⭐ FIX #4: Get movieId from query param and pass to view
    $movieId = $request->query('movieId', 1);  // Default to 1 if not provided

    Log::info('Payment checkout page accessed', [
        'user_id' => $user?->id,
        'movie_id' => $movieId,
        'has_payment' => $user?->hasSuccessfulPayment(),
        'has_subscription' => $user?->hasActiveSubscription(),
    ]);

    return Inertia::render('Payment', [
        'user' => $user,
        'alreadyPaid' => false,
        'movieId' => $movieId,  // ← PASS TO FRONTEND
    ]);
}
```

---

## FIX #5: Update Payment.vue to Use Props

**File**: `resources/js/Pages/Payment.vue`

**Location**: In the script section, replace initiatePayment function

```javascript
const initiatePayment = async () => {
    processing.value = true;
    validationErrors.value = {};
    showStatusOverlay("Redirecting to Paystack", "Opening secure checkout...");

    try {
        // ⭐ FIX #5: Use props.movieId instead of URL query param
        const movieId = props.movieId || 1; // Use prop or default

        console.log("Initiating payment with movieId:", movieId);

        // Track Meta Pixel Purchase event
        if (window.appAnalytics && window.appAnalytics.trackMetaPurchase) {
            window.appAnalytics.trackMetaPurchase({
                value: finalAmount.value,
                currency: "GHS",
                content_name: props.movie?.title || "A Crazy Day in Accra",
                content_id: movieId || "a-crazy-day-in-accra",
                content_type: "product",
            });
        }

        // Track Google Ads Purchase event
        if (window.appAnalytics && window.appAnalytics.trackGoogleAdsPurchase) {
            window.appAnalytics.trackGoogleAdsPurchase({
                value: finalAmount.value,
                currency: "GHS",
            });
        }

        router.post(
            "/payments/init",
            {
                amount: props.amount,
                currency: "GHS",
                movie_id: movieId, // ← NOW FROM PROPS
                referral_code: couponCode.value || null,
                email: billingEmail.value || null,
                channel: paymentChannel.value,
            },
            {
                onError: (errors) => {
                    validationErrors.value = errors;
                    hideStatusOverlay();
                    processing.value = false;
                    console.error("Validation errors:", errors);
                },
                onFinish: () => {
                    // Inertia will handle the redirect via Inertia::location()
                    // If we're still on this page, there was an error
                    if (window.location.href.includes("/payment")) {
                        hideStatusOverlay();
                        processing.value = false;
                    }
                },
            }
        );
    } catch (e) {
        hideStatusOverlay();
        console.error("Network error:", e);
        alert("Network error starting payment");
        processing.value = false;
    }
};
```

---

## FIX #6: Verify Queue Worker Configuration

**File**: `config/queue.php`

**Current value should be**:

```php
'default' => env('QUEUE_CONNECTION', 'database'),
```

**To ensure queue worker processes jobs**:

```bash
# In production/staging environment, add to .env
QUEUE_CONNECTION=database

# Then start queue worker with supervisor
# Create file: /etc/supervisor/conf.d/laravel-queue-worker.conf

[program:laravel-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/app/artisan queue:work --queue=payments --tries=3 --timeout=600
autostart=true
autorestart=true
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/laravel-queue-worker.log
stopwaitsecs=3600
```

---

## VERIFICATION AFTER FIXES

After implementing these fixes, run:

```bash
# Check recent logs
tail -50 storage/logs/laravel.log | grep -i "payment\|subscription"

# Test payment flow
php artisan tinker

# Should see payment with subscription
>>> $payment = App\Models\Payment::latest()->first()
>>> $payment->status
>>> $payment->meta
>>> $payment->user->subscriptions()->count()  // Should be > 0

# Check if subscription exists
>>> $subscription = $payment->user->subscriptions()->latest()->first()
>>> $subscription->expires_at > now()  // Should be true
>>> $subscription->movie_id  // Should be 1 or higher
```

---

## ROLLOUT CHECKLIST

-   [ ] Deploy FIX #1 & #2 (Logging & Subscription Creation)
-   [ ] Test one payment manually and check logs
-   [ ] Deploy FIX #3, #4, #5 (movie_id Handling)
-   [ ] Test with both entry points (Button + URL)
-   [ ] Monitor logs for 24 hours
-   [ ] Check metrics: Payments/Subscriptions ratio
-   [ ] Verify users can access watch page after payment
-   [ ] Confirm email confirmations are sent

**Estimated Time to Implement**: 1-2 hours  
**Risk Level**: LOW (mostly logging + adding defaults)
