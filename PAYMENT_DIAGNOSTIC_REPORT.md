# PAYMENT & WATCH FLOW: COMPLETE DIAGNOSTIC REPORT

**Investigation Date**: January 2, 2026  
**Complexity Level**: HIGH  
**Critical Status**: YES - Users blocked from accessing paid content

---

## KEY FINDINGS

### Finding 1: PurchaseButton Component DOES Pass movie_id ✅

```vue
// resources/js/components/PurchaseButton.vue - Line 50 body: JSON.stringify({
amount: props.amount, currency: props.currency, movie_id: props.movieId, // ✅
SENT email: userEmail.value || 'guest@acrazydayinaccra.com', })
```

**Good News**: PurchaseButton sends movie_id correctly!

### Finding 2: Payment.vue Uses Query Parameter Instead ⚠️

```javascript
// resources/js/Pages/Payment.vue - Line 194
const initiatePayment = async () => {
    const movieId = new URLSearchParams(window.location.search).get("movieId");
    // This gets movie_id from URL, not from props

    router.post("/payments/init", {
        amount: props.amount,
        currency: "GHS",
        movie_id: movieId, // ⚠️ CAN BE NULL
        referral_code: couponCode.value || null,
        email: billingEmail.value || null,
        channel: paymentChannel.value,
    });
};
```

**Problem**: If user is on `/payment/checkout` without `?movieId=X`, then movie_id is NULL.

### Finding 3: Two Different Payment Entry Points

1. **PurchaseButton.vue** (Direct payment)

    - Used from Homepage/Gallery
    - Calls `/payments/init` directly via fetch
    - Sends movie_id in body
    - **Redirects to Paystack** or via Inertia::location()

2. **Payment.vue** (Checkout page)
    - Used from `/payment/checkout` route
    - Gets movie_id from URL query param
    - Can be NULL if URL is just `/payment/checkout`
    - **Backup payment method**

---

## SCENARIO ANALYSIS

### Scenario 1: User Clicks "Watch Now" Button (PurchaseButton) ✅

```
Step 1: User sees gallery/index with PurchaseButton
        <PurchaseButton :movieId="1" :amount="1500" />

Step 2: User clicks button
        → startPurchase() called
        → movie_id: 1 sent to /payments/init

Step 3: Backend processes
        → Payment created with meta['movie_id'] = 1
        → Paystack authorization URL returned

Step 4: User pays on Paystack
        → Redirected to /payment?reference=XXX

Step 5: Callback handles verification
        → Payment status = 'success'
        → Subscription created with movie_id = 1 ✅
        → Redirect to /watch

Step 6: User accesses /watch
        → Middleware: hasSuccessfulPayment() = TRUE ✅
        → User gets access ✅
```

**Result**: Should work correctly! ✅

---

### Scenario 2: User Goes to `/payment/checkout` Directly ⚠️

```
Step 1: User navigates to /payment/checkout (no movieId param)

Step 2: Payment.vue mounts
        → movieId = new URLSearchParams(...).get('movieId')
        → movieId = null (no query param)

Step 3: User clicks "Pay Securely"
        → initiatePayment() called
        → movie_id: null sent to /payments/init

Step 4: Backend processes
        → Payment created with meta['movie_id'] = null ⚠️
        → Paystack authorization URL returned

Step 5: User pays on Paystack
        → Redirected to /payment?reference=XXX

Step 6: Callback handles verification
        → if ($movieId) → FALSE (movieId is null)
        → Subscription NOT created ⚠️
        → Redirect to /watch

Step 7: User accesses /watch
        → Middleware: hasSuccessfulPayment() = TRUE ✅
        → BUT: hasActiveSubscription() = FALSE ⚠️
        → BUT: Middleware uses OR logic: TRUE OR FALSE = TRUE
        → User SHOULD still get access ✅

WAIT... This means even without subscription, user should get access!
```

**Expected Result**: Should work (if middleware logic is correct) ✅

---

## Critical Question: Why Are Users Blocked?

If middleware allows access based on **EITHER** condition:

```php
if (! $user->hasSuccessfulPayment() && ! $user->hasActiveSubscription()) {
    return redirect()->route('payment.checkout');
}
```

Then users with successful payments should get access even without subscriptions.

**Hypothesis 1**: Payment status not being set to 'success'

-   Paystack verification fails silently
-   Payment stays in 'initialized' state
-   Both checks fail → user blocked

**Hypothesis 2**: Callback not being called

-   User completes payment on Paystack
-   Paystack tries to redirect to `/payment?reference=XXX`
-   Route doesn't match or fails
-   Payment never marked as success

**Hypothesis 3**: Webhook handling issue

-   Paystack fires webhook event
-   Webhook handler fails silently
-   Payment status never updated

---

## DIAGNOSTIC QUERIES

### Query 1: Check Payment Records

```bash
php artisan tinker
>>> // Get all payments and their statuses
>>> App\Models\Payment::selectRaw('status, count(*) as count')->groupBy('status')->get()
>>> // Get recent payments
>>> App\Models\Payment::orderBy('id', 'desc')->limit(10)->get(['id', 'user_id', 'status', 'paid_at', 'created_at'])
>>> // Get payments marked success but no subscription
>>> App\Models\Payment::where('status', 'success')->with('user')->get()->filter(fn($p) => $p->user->subscriptions->count() === 0)
```

### Query 2: Check Subscription Records

```bash
>>> // Total subscriptions
>>> App\Models\Subscription::count()
>>> // Active subscriptions
>>> App\Models\Subscription::where('expires_at', '>', now())->count()
>>> // Recent subscriptions
>>> App\Models\Subscription::orderBy('id', 'desc')->limit(10)->get()
```

### Query 3: Check User Access

```bash
>>> $user = User::find(1)
>>> $user->hasSuccessfulPayment()  // true/false?
>>> $user->hasActiveSubscription() // true/false?
>>> $user->payments()->count()
>>> $user->payments()->where('status', 'success')->count()
>>> $user->subscriptions()->count()
>>> $user->subscriptions()->where('expires_at', '>', now())->count()
```

### Query 4: Check Recent Logs

```bash
tail -100 storage/logs/laravel.log | grep -i "payment\|subscription\|verify"
tail -100 storage/logs/laravel.log | grep -i "error\|exception"
```

---

## MOST LIKELY ROOT CAUSES (In Order of Probability)

### Root Cause 1: Callback Verification Failing (40% likelihood)

```php
// PaymentController::callback() line 175
$verify = $paystack->verify($reference);

if ($verify['ok'] && ($verify['body']['status'] ?? false) === true) {
    // Only executed if BOTH conditions true
    // If either fails, payment status never updated
}
```

**Why it happens**:

-   Paystack verification fails due to network timeout
-   Paystack returns error response
-   `$verify['ok']` is false
-   Payment status remains 'initialized'
-   User blocked by middleware

**Evidence to Check**:

```bash
>>> App\Models\Payment::where('status', 'initialized')->count()
>>> // If high number > 0, this is likely the issue
```

### Root Cause 2: Queue Worker Not Running (30% likelihood)

Not directly blocking payment, but:

-   Email job never sent
-   Users don't get confirmation they paid
-   They think payment failed and try again
-   Creates confusion

**Evidence to Check**:

```bash
php artisan queue:failed
# Check if SendPaymentSuccessEmailJob is stuck
```

### Root Cause 3: movie_id = null Edge Case (20% likelihood)

-   User goes directly to `/payment/checkout`
-   movie_id is null
-   Subscription not created
-   But user has successful payment, so should still get access?

**This shouldn't block access** unless hasSuccessfulPayment() is failing.

### Root Cause 4: PaymentCheckoutController Logic (10% likelihood)

```php
// PaymentCheckoutController.php line 15
if ($user && ($user->hasSuccessfulPayment() || $user->hasActiveSubscription())) {
    return redirect()->route('watch');
}
```

If user already paid, they should be redirected away from payment page.

**If not happening**: Maybe payment status not updated, so check always fails.

---

## THE ACTUAL PROBLEM (Most Likely)

**Paystack Callback Not Being Called or Handled Correctly**

Evidence:

1. Users report "payment made but no access"
2. This suggests payment is processing on Paystack side
3. But then user can't access watch page
4. If payment status was updated to 'success', middleware would allow access
5. Therefore, callback is failing

**Likely Failure Point**:

```php
// PaymentController::callback() line 175-180
$verify = $paystack->verify($reference);
$payment->increment('verify_attempts');
$payment->forceFill(['last_verify_at' => now()])->save();

if ($verify['ok'] && ($verify['body']['status'] ?? false) === true) {
    // THIS IS NOT EXECUTING
}
```

Either:

-   `$verify['ok']` is false (Paystack API error)
-   `$verify['body']['status']` is not 'success' (payment not confirmed)
-   Exception thrown and caught silently

---

## IMMEDIATE ACTION PLAN

### Step 1: Add Comprehensive Logging (5 mins)

```php
// PaymentController.php - Start of callback()
Log::info('=== PAYMENT CALLBACK START ===', [
    'reference' => $reference,
    'timestamp' => now(),
    'url' => URL::current(),
]);

// Before verify
Log::info('Before Paystack verify', [
    'reference' => $reference,
    'payment_exists' => Payment::where('reference', $reference)->exists(),
]);

// After verify
Log::info('Paystack verify response', [
    'reference' => $reference,
    'verify_ok' => $verify['ok'] ?? null,
    'verify_status' => $verify['body']['status'] ?? null,
    'full_response' => $verify,  // Log entire response
]);

// Before status update
Log::info('About to update payment status', [
    'reference' => $reference,
    'current_status' => $payment->status,
    'new_status' => $status,
]);

// After status update
Log::info('Payment status updated', [
    'reference' => $reference,
    'status' => $payment->status,
]);

// After subscription creation
Log::info('Subscription created', [
    'payment_id' => $payment->id,
    'subscription_id' => $subscription->id ?? null,
    'movie_id' => $movieId,
]);
```

### Step 2: Ensure Default movie_id

```php
// PaymentController::init() and callback()
$movieId = $payment->meta['movie_id'] ?? 1; // Always has a value
```

### Step 3: Force Subscription Creation

```php
// Even if movie_id is null, create with default
if ($status === 'success') {
    $movieId = $payment->meta['movie_id'] ?? 1;
    try {
        $subscription = Subscription::updateOrCreate(
            ['user_id' => $payment->user_id, 'movie_id' => $movieId],
            ['payment_id' => $payment->id, 'expires_at' => now()->addDays(365)]
        );
    } catch (\Exception $e) {
        Log::error('Subscription creation failed', ['error' => $e->getMessage()]);
    }
}
```

### Step 4: Check Logs

```bash
tail -50 storage/logs/laravel.log | grep "PAYMENT CALLBACK\|Paystack verify"
```

### Step 5: Verify Database

```bash
php artisan tinker
>>> App\Models\Payment::latest()->first()
>>> // Check if any payments are stuck in 'initialized' state
>>> App\Models\Payment::where('status', 'initialized')->where('created_at', '>', now()->subDays(1))->count()
```

---

## SUMMARY TABLE

| Component                         | Status         | Issue                      |
| --------------------------------- | -------------- | -------------------------- |
| **PurchaseButton.vue**            | ✅ Works       | Correctly sends movie_id   |
| **Payment.vue**                   | ⚠️ Risky       | Can send null movie_id     |
| **PaymentController::init()**     | ⚠️ Fragile     | Accepts null movie_id      |
| **PaymentController::callback()** | ❌ BROKEN?     | Likely not updating status |
| **Subscription Creation**         | ⚠️ Conditional | Only if movie_id provided  |
| **EnsureHasPaid Middleware**      | ✅ Sound       | Logic is correct           |
| **hasSuccessfulPayment()**        | ✅ Works       | If status updated          |
| **Queue Worker**                  | ❓ Unknown     | May not be running         |

---

## RECOMMENDED FIXES (In Priority Order)

1. **Add comprehensive logging to payment flow** (1 hour)

    - Deploy and wait for next payment attempt
    - Check logs to see where failure happens

2. **Add default movie_id fallback** (15 mins)

    - Ensure movie_id is always provided
    - Prevents null edge cases

3. **Force subscription creation on success** (15 mins)

    - Wrap in try-catch
    - Always create subscription, even if movie_id was null

4. **Ensure queue worker is running** (depends on deployment)

    - Check production configuration
    - Verify Supervisor/systemd service

5. **Add monitoring dashboard**
    - Track payment success rate
    - Track subscription creation rate
    - Alert if mismatch

---

## FILES REQUIRING CHANGES

**Priority 1 (Critical)**:

-   [app/Http/Controllers/PaymentController.php](app/Http/Controllers/PaymentController.php)
    -   Add logging
    -   Force default movie_id
    -   Force subscription creation

**Priority 2 (Important)**:

-   [app/Http/Controllers/PaymentCheckoutController.php](app/Http/Controllers/PaymentCheckoutController.php)
    -   Pass movieId from query to view
-   [resources/js/Pages/Payment.vue](resources/js/Pages/Payment.vue)
    -   Use props instead of query param

**Priority 3 (Nice to have)**:

-   [app/Models/Payment.php](app/Models/Payment.php)

    -   Add accessor for default movie_id

-   [app/Services/PaystackService.php](app/Services/PaystackService.php)
    -   Add logging for verification attempts

---

## EXPECTED OUTCOMES AFTER FIXES

✅ All new payments get subscriptions (even if movie_id missing)  
✅ Users redirected to /watch after successful payment  
✅ Middleware allows access (hasSuccessfulPayment works)  
✅ Video plays without errors  
✅ Payment history visible in profile  
✅ Email confirmations sent (when queue runs)  
✅ No more "payment made but blocked" complaints

---

**Next Steps**: Implement Priority 1 fixes and monitor logs for next 24 hours
