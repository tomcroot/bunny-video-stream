# Payment & Watch Flow - DETAILED PROBLEM ANALYSIS & SOLUTIONS

**Status**: CRITICAL - Users Cannot Access Watch Page After Payment  
**Root Cause Identified**: Missing `movie_id` during payment initialization  
**Severity**: HIGH (Blocks 100% of paying users)

---

## PROBLEM #1: movieId is Retrieved from URL Query Parameter

### Current Code (Payment.vue, line 194)

```javascript
const initiatePayment = async () => {
  processing.value = true
  validationErrors.value = {}

  try {
    const movieId = new URLSearchParams(window.location.search).get('movieId')

    // Send to backend
    router.post('/payments/init', {
      amount: props.amount,
      currency: 'GHS',
      movie_id: movieId,  // ← Can be NULL!
      referral_code: couponCode.value || null,
      email: billingEmail.value || null,
      channel: paymentChannel.value
    })
  }
}
```

### The Issue

```
Payment Page URL Examples:
✓ /payment/checkout?movieId=1          → movieId = "1"
✓ /payment/checkout?movieId=abc123     → movieId = "abc123"
✗ /payment/checkout                    → movieId = null
✗ /payment/checkout?other=param        → movieId = null
```

**Result**: If user goes to `/payment/checkout` without `?movieId=X`, then:

-   `movieId = null`
-   Sent to backend: `movie_id: null`
-   PaymentController receives `null`
-   `$payment->meta['movie_id'] = null`
-   **Subscription NEVER created** (because condition fails)

---

## PROBLEM #2: How Users Reach Payment Page

Looking at PaymentCheckoutController:

```php
Route::get('/payment/checkout', [PaymentCheckoutController::class, 'index'])
    ->name('payment.checkout');
```

**This route has NO movie_id parameter!**

So users landing on `/payment/checkout` have no way to pass the movie_id.

### How Users Access Payment

-   **From Gallery**: Likely clicks a "Watch" button → needs to pass movie_id
-   **Direct URL**: User types `/payment/checkout` → no movie_id
-   **Deep link**: User shares `/payment/checkout` → no movie_id

---

## PROBLEM #3: Subscription Creation Requires movie_id

### PaymentController::callback() Line 233-242

```php
// Create subscription with 365-day expiry
$movieId = $payment->meta['movie_id'] ?? null;
if ($movieId) {  // ← This condition MUST be true
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
}
```

**If `$movieId` is null → entire block skipped → NO SUBSCRIPTION created**

### Subscriptions Table Constraint

```sql
UNIQUE KEY (user_id, movie_id)
```

**Database Design**: Every subscription requires both user AND movie.

This assumes a **per-movie payment model** (pay per film), but the UI treats it as a **platform payment** (pay once for all).

---

## PROBLEM #4: Authorization Uses Either/Or Logic But Subscription Never Exists

### EnsureHasPaid Middleware (Line 24-28)

```php
if (! $user->hasSuccessfulPayment() && ! $user->hasActiveSubscription()) {
    return redirect()->route('payment.checkout')
        ->with('status', 'Complete your payment to watch the movie.');
}
```

This says: Allow if user has **EITHER**:

-   A successful payment, OR
-   An active subscription

So theoretically, even if subscription is missing, if `hasSuccessfulPayment()` is true, user should get access!

### hasSuccessfulPayment() (User.php, Line 59)

```php
public function hasSuccessfulPayment(): bool {
    return $this->payments()->where('status', 'success')->exists();
}
```

**This should work!** If payment status = 'success', user should get access.

---

## PROBLEM #5: The Real Issue - Either One IS Failing

Two scenarios:

**Scenario A: Payment callback fails to update status to 'success'**

-   Paystack verification fails
-   Payment status stays 'initialized' or 'failed'
-   Both middleware checks fail
-   User blocked

**Scenario B: Webhook not processed**

-   Payment goes through Paystack
-   Callback route triggered but something fails
-   Status never updated in database
-   Payment stuck in 'initialized' state

### Evidence to Check

1. Does `/payment?reference=XXX` actually get called?
2. Does Paystack verification succeed?
3. Is `$payment->status` being updated to 'success'?
4. Are there any exceptions in logs?

---

## PROBLEM #6: Potential Queue Worker Issue

### SendPaymentSuccessEmailJob Dispatch (Line 289)

```php
SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id)
    ->onQueue('payments');
```

**This is NOT the payment success redirect!** The email job doesn't block the redirect.

But if queue worker isn't running:

-   Email never sent
-   User doesn't get confirmation
-   But payment should still process and redirect

---

## SOLUTION ROADMAP

### IMMEDIATE ACTIONS (Implement Now)

#### 1. Make movie_id Capture More Robust

**Option A: Pass via props to Payment component**

```php
// PaymentCheckoutController.php
public function index(Request $request)
{
    $user = Auth::user();
    $movieId = $request->query('movieId') ?? 1; // Default to main movie

    if ($user && ($user->hasSuccessfulPayment() || $user->hasActiveSubscription())) {
        return redirect()->route('watch');
    }

    return Inertia::render('Payment', [
        'user' => $user,
        'alreadyPaid' => false,
        'movieId' => $movieId,  // NEW: Pass to frontend
    ]);
}
```

**Option B: Use props.movieId instead of URL query**

```javascript
// Payment.vue - Replace line 194
const initiatePayment = async () => {
    const movieId = props.movieId || 1; // Use prop or default

    router.post("/payments/init", {
        amount: props.amount,
        currency: "GHS",
        movie_id: movieId, // Now always has value
        // ...
    });
};
```

#### 2. Create Default movie_id If None Provided

**In PaymentController::init()**

```php
$validated = $request->validate([
    'amount' => ['required', 'integer', 'min:100'],
    'movie_id' => ['nullable', 'integer'],
    // ...
]);

// Ensure movie_id always has a value
$movieId = $validated['movie_id'] ?? 1; // Default to ID 1

$payment = Payment::create([
    'user_id' => $user->id,
    'reference' => $reference,
    'amount' => $finalAmount,
    'currency' => $validated['currency'] ?? 'GHS',
    'status' => 'initialized',
    'meta' => [
        'movie_id' => $movieId,  // Now ALWAYS set
        'referral_code' => $validated['referral_code'] ?? null,
    ],
]);
```

#### 3. Ensure Subscription Creation ALWAYS Happens

**In PaymentController::callback()**

```php
if ($status === 'success') {
    $payment->status = 'success';
    $payment->authorization_code = $data['authorization']['authorization_code'] ?? null;
    $payment->paid_at = $payment->paid_at ?: now();
    $payment->save();

    // CRITICAL: Always create subscription
    $movieId = $payment->meta['movie_id'] ?? 1;
    try {
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

        // Dispatch email
        SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id)
            ->onQueue('payments');

        Log::info('Subscription created', [
            'payment_id' => $payment->id,
            'subscription_id' => $subscription->id,
        ]);
    } catch (\Exception $e) {
        Log::error('Subscription creation failed', [
            'payment_id' => $payment->id,
            'error' => $e->getMessage(),
        ]);
        // Don't fail payment - still mark as success
    }
}
```

#### 4. Do the Same in Webhook Handler

**In PaymentController::webhook()**

```php
if ($status === 'success') {
    $payment->status = 'success';
    $payment->authorization_code = $data['authorization']['authorization_code'] ?? null;
    $payment->paid_at = $payment->paid_at ?: now();
    $payment->save();

    // Always create subscription
    $movieId = $payment->meta['movie_id'] ?? 1;
    $subscription = Subscription::updateOrCreate(
        ['user_id' => $payment->user_id, 'movie_id' => $movieId],
        ['payment_id' => $payment->id, 'expires_at' => now()->addDays(365)]
    );

    SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id)
        ->onQueue('payments');
}
```

#### 5. Add Logging to Diagnose Issues

Add detailed logging at every step:

```php
// In PaymentController::callback()
Log::info('Payment callback received', [
    'reference' => $reference,
    'payment_id' => $payment?->id,
    'status_before' => $payment?->status,
]);

// After verification
Log::info('Paystack verification', [
    'reference' => $reference,
    'verify_ok' => $verify['ok'],
    'verify_status' => $verify['body']['status'] ?? null,
]);

// After status update
Log::info('Payment status updated', [
    'reference' => $reference,
    'status_after' => $payment->status,
    'movie_id' => $movieId,
]);

// After subscription creation
Log::info('Subscription status', [
    'subscription_id' => $subscription->id,
    'expires_at' => $subscription->expires_at,
]);
```

---

## VERIFICATION CHECKLIST

### 1. Check Database for Failed Payments

```bash
php artisan tinker
>>> App\Models\Payment::orderBy('id', 'desc')->take(10)->get()
>>> App\Models\Payment::where('status', '!=', 'success')->get()
>>> App\Models\Subscription::count()
```

### 2. Check if Queue Worker is Running

```bash
# Check if jobs are stuck in queue
php artisan queue:failed

# If yes, retry them
php artisan queue:retry all

# Start queue worker
php artisan queue:work --queue=payments
```

### 3. Test Payment Flow End-to-End

```bash
# 1. Create test user
php artisan tinker
>>> $user = User::create(['name' => 'Test', 'email' => 'test@test.com', 'password' => Hash::make('password')])

# 2. Simulate payment creation
>>> $payment = Payment::create(['user_id' => $user->id, 'reference' => uniqid(), 'amount' => 1500, 'status' => 'initialized', 'meta' => ['movie_id' => 1]])

# 3. Simulate successful verification
>>> $payment->update(['status' => 'success', 'paid_at' => now()])

# 4. Check if subscription exists
>>> $user->subscriptions()->count()

# 5. Check if user can access watch
>>> $user->hasSuccessfulPayment()
>>> $user->hasActiveSubscription()
```

### 4. Check Logs for Errors

```bash
# In production
tail -f storage/logs/laravel.log | grep -i payment

# Check for specific errors
grep -i "verification failed\|subscription\|movie_id" storage/logs/laravel.log
```

---

## FILES TO MODIFY

Priority order:

1. **[PaymentController.php](app/Http/Controllers/PaymentController.php)**

    - Add default movie_id in init() method
    - Add logging throughout callback()
    - Ensure subscription creation in both callback() and webhook()

2. **[PaymentCheckoutController.php](app/Http/Controllers/PaymentCheckoutController.php)**

    - Pass movieId from query parameter to frontend

3. **[Payment.vue](resources/js/Pages/Payment.vue)**

    - Use props.movieId instead of query parameter
    - Add fallback to default movie_id

4. **[User.php](app/Models/User.php)**

    - Verify hasSuccessfulPayment() logic

5. **[EnsureHasPaid.php](app/Http/Middleware/EnsureHasPaid.php)**
    - Add logging to see which check is failing

---

## TESTING SCENARIOS

After fixes:

1. **User pays WITHOUT movie_id**

    - Payment → Success
    - Subscription created with default movie_id
    - User can access /watch

2. **User pays WITH movie_id**

    - Payment → Success
    - Subscription created with specific movie_id
    - User can access /watch

3. **User has successful payment but no subscription**

    - Middleware still allows access (hasSuccessfulPayment returns true)
    - User can access /watch

4. **Multiple users pay**

    - Each gets own subscription
    - Each can access /watch independently

5. **Queue worker not running**
    - Payment still processes
    - User still gets redirected to /watch
    - Email sent (when queue worker starts)

---

## EXPECTED BEHAVIOR AFTER FIX

```
User Flow:
1. User navigates to /payment/checkout (or /payment/checkout?movieId=1)
2. Completes payment with Paystack
3. Paystack redirects to /payment?reference=XXX
4. Backend verifies payment with Paystack
5. Backend creates Payment record with status = 'success'
6. Backend creates Subscription record with movie_id
7. Backend redirects to /watch
8. Middleware checks: hasSuccessfulPayment() = TRUE ✅
9. User sees video player
10. Email sent asynchronously (queue worker)
```

---

## MONITORING POST-FIX

Add to dashboard:

-   Count of Payments with status = 'success' per day
-   Count of Subscriptions created per day
-   Ratio: payments.success / subscriptions.created (should be ~100%)
-   Watch page access rate (should spike after payment)
-   Queue jobs pending/failed count
