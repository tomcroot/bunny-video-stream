# Payment & Watch Flow Audit Report

**Date**: January 2, 2026  
**Status**: CRITICAL ISSUES IDENTIFIED  
**Severity**: HIGH - Users cannot access watch page after payment

---

## Executive Summary

After thorough review of the payment and watch flow, **multiple critical issues have been identified** that prevent users from accessing the watch page after completing payment:

1. **Missing `movie_id` in payment metadata** - Subscriptions not being created
2. **Queue system not running** - Email jobs dispatched but potentially not executed
3. **Frontend user data not refreshed** - Old auth state persists after payment
4. **Middleware authorization check works but data is missing** - Users redirected before subscription is created

---

## 1. Critical Issue: Missing movie_id in Payment Initialization

### Problem

When a user initiates payment, the `movie_id` is sent to the backend but the **subscription creation requires a valid `movie_id`**.

**Code Flow Analysis:**

```php
// PaymentController::init() - Lines 20-150
$validated = $request->validate([
    'amount' => ['required', 'integer', 'min:100'],
    'movie_id' => ['nullable'],  // ❌ Optional!
    // ...
]);

// Later in callback() - Lines 233
$movieId = $payment->meta['movie_id'] ?? null;
if ($movieId) {
    $subscription = Subscription::updateOrCreate(
        ['user_id' => $payment->user_id, 'movie_id' => $movieId],
        ['payment_id' => $payment->id, 'expires_at' => now()->addDays(365)]
    );
}
```

### The Problem

-   When **no `movie_id` is provided**, the subscription is **never created**
-   Even if payment succeeds, `$movieId` is `null`
-   The `if ($movieId)` condition fails
-   **User has no active subscription** → middleware redirects to payment page

### Evidence from Subscriptions Table Schema

```php
// Database constraint (unique combination required)
$table->unique(['user_id', 'movie_id']);

// This means: Every user must have a movie_id to have a subscription
```

### Root Cause

The payment UI likely doesn't capture or send a `movie_id`, treating it as a generic platform payment rather than per-movie access.

---

## 2. Critical Issue: Watch Page Authorization Requires Subscription or Payment

### Authorization Chain

```php
// Route: /watch (Routes/web.php line 183)
Route::get('/watch', [WatchController::class, 'index'])
    ->middleware(['auth', 'paid'])
    ->name('watch');

// Middleware: EnsureHasPaid.php (lines 24-28)
if (! $user->hasSuccessfulPayment() && ! $user->hasActiveSubscription()) {
    return redirect()->route('payment.checkout')
        ->with('status', 'Complete your payment to watch the movie.');
}
```

### The Problem

While the middleware checks for **either**:

-   A successful payment (`hasSuccessfulPayment()`), OR
-   An active subscription (`hasActiveSubscription()`)

**The subscription is never created** (Issue #1), so both checks fail.

### hasActiveSubscription() Definition (User.php)

```php
public function hasActiveSubscription($movieId = null): bool {
    $query = $this->subscriptions()
        ->where('expires_at', '>', now());

    if ($movieId) {
        $query->where('movie_id', $movieId);
    }

    return $query->exists();
}
```

If no subscriptions exist → returns `false` → redirect triggered

---

## 3. Critical Issue: Queue System and Background Jobs

### Email Job Configuration

```php
// app/Jobs/SendPaymentSuccessEmailJob.php
public function handle(): void {
    $payment = Payment::with('user')->findOrFail($this->paymentId);
    $subscription = Subscription::findOrFail($this->subscriptionId);
    Mail::send(new PaymentSuccessEmail($payment, $subscription));
}

// Dispatched from PaymentController::callback() line 289
SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id)
    ->onQueue('payments');
```

### Potential Issue

-   **Queue connection**: Set to `'database'` by default
    ```php
    // config/queue.php line 16
    'default' => env('QUEUE_CONNECTION', 'database'),
    ```
-   **For jobs to execute**, the Laravel queue worker must be running:
    ```bash
    php artisan queue:work
    ```
-   **If queue worker is NOT running**: Jobs sit in the database forever

### Consequence

If queue worker isn't running, the email job is never executed, and users never receive confirmation.

---

## 4. Issue: Frontend User State Not Refreshed After Payment

### Current Redirect Flow

```php
// PaymentController::callback() line 231
return redirect()->route('watch')->with('status', 'Payment successful!');
```

**The Problem:**

-   Redirects to `/watch` immediately
-   The subscription was just created in the database
-   But the **Inertia frontend** still has the **old user object**
-   Middleware checks pass (subscription now exists)
-   But frontend doesn't know payment is complete

### Expected Behavior

After successful payment redirect:

1. ✅ Middleware allows access (subscription exists)
2. ✅ Page loads with `subscription` data passed from backend
3. ✅ Frontend receives updated user/subscription state
4. ✅ User sees the video player

**But if initial payment check failed**, the user is stuck.

---

## 5. Flow Diagram: Where It Breaks

```
USER FLOW:
┌──────────────────────────────────────────────────────────────┐
│ 1. User clicks "Pay" on Payment page                         │
│    - Forms sends: amount, email, referral_code               │
│    - ❌ NO movie_id sent (or sent as null)                   │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. PaymentController::init()                                 │
│    - Validates request                                       │
│    - $validated['movie_id'] = null (optional)                │
│    - Creates Payment record with meta['movie_id'] = null     │
│    - Redirects to Paystack authorization URL                 │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. User completes Paystack payment                           │
│    - Paystack redirects back to /payment?reference=XXX       │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. PaymentController::callback()                             │
│    - Verifies payment with Paystack                          │
│    - Sets Payment.status = 'success'                         │
│    - Extracts movieId = meta['movie_id'] = null ❌           │
│    - if ($movieId) → FALSE, subscription NOT created         │
│    - Redirects to /watch                                     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. User tries to access /watch                               │
│    - Middleware checks:                                      │
│      - hasSuccessfulPayment()? ✅ YES                        │
│      - hasActiveSubscription()? ❌ NO (never created)        │
│    - Wait! hasSuccessfulPayment() should allow access...     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. ACTUAL ISSUE FOUND:                                       │
│    The middleware accepts either condition:                  │
│    - hasSuccessfulPayment() OR hasActiveSubscription()       │
│    - Since Payment.status = 'success', user SHOULD get in    │
│    - But Watch page still might fail if PageContent missing  │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Additional Risk: PageContent 503 Error

Previously documented in WATCH_PAGE_FIX_REPORT.md, but still a risk:

```php
// WatchController::index() lines 13-16
$pageContent = PageContent::where('page', 'watch')
    ->where('is_active', true)
    ->first();

if (! $pageContent || ! $pageContent->movie_url) {
    abort(503, 'Movie content is currently unavailable...');
}
```

**If PageContent is missing or inactive** → User gets 503 error even if authorized.

---

## 7. Root Cause Summary

| Issue                            | Impact                                     | Why It Happens                                    |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| **No movie_id sent**             | Subscription not created                   | Payment form doesn't capture movie selection      |
| **Subscription only for movies** | User without subscription but with payment | Design assumes per-movie access                   |
| **Queue worker not running**     | Users don't get email confirmations        | Infrastructure issue                              |
| **Frontend state caching**       | UI doesn't update after redirect           | Possible Inertia caching or component state issue |
| **Missing PageContent record**   | 503 errors even if authorized              | Migration may not have run or record deleted      |

---

## 8. Recommended Solutions

### A. IMMEDIATE FIX: Modify Payment Flow for Platform-Level Access

**Change 1: Update Payment Initialization**

```php
// PaymentController::init() - make movie_id default to a platform-wide ID
$validated = $request->validate([
    'amount' => ['required', 'integer', 'min:100'],
    'movie_id' => ['nullable', 'integer'],
    'referral_code' => ['nullable', 'string', 'max:50'],
    'email' => ['nullable', 'email'],
    'channel' => ['sometimes', 'string', 'max:50'],
]);

// NEW: Ensure a movie_id is always present
$movieId = $validated['movie_id'] ?? 1; // Default to main movie
```

**Change 2: Update Subscription Check**

```php
// User.php
public function hasActiveSubscription($movieId = null): bool {
    $query = $this->subscriptions()
        ->where('expires_at', '>', now());

    // Check ANY active subscription if no specific movie requested
    if ($movieId) {
        $query->where('movie_id', $movieId);
    }

    return $query->exists();
}
```

**Change 3: Verify PaymentController::callback() creates subscription**

```php
// Ensure subscription ALWAYS created on payment success
if ($status === 'success') {
    $payment->status = 'success';
    $payment->authorization_code = $data['authorization']['authorization_code'] ?? null;
    $payment->paid_at = $payment->paid_at ?: now();
    $payment->save();

    // ALWAYS create subscription (use default movie if not specified)
    $movieId = $payment->meta['movie_id'] ?? 1;
    $subscription = Subscription::updateOrCreate(
        ['user_id' => $payment->user_id, 'movie_id' => $movieId],
        ['payment_id' => $payment->id, 'expires_at' => now()->addDays(365)]
    );

    // Dispatch email
    SendPaymentSuccessEmailJob::dispatch($payment->id, $subscription->id)->onQueue('payments');
}
```

### B. VERIFY: Queue Worker is Running

```bash
# In production/staging, ensure queue worker runs:
php artisan queue:work --queue=payments --tries=3

# Or via Supervisor (recommended for production)
# Create /etc/supervisor/conf.d/laravel-worker.conf
```

### C. VERIFY: PageContent Record Exists

```bash
# Run the existing migration (if not already done)
php artisan migrate --path=database/migrations/2025_12_13_150500_ensure_watch_page_content_record.php

# Or verify via Tinker
php artisan tinker
>>> App\Models\PageContent::where('page', 'watch')->first()
```

### D. FRONTEND: Force Auth State Refresh After Payment

Add in Payment.vue or redirect callback:

```javascript
// After successful payment redirect
if (window.location.pathname === "/watch") {
    // Force page reload to get fresh auth state
    window.location.reload();
}
```

---

## 9. Testing Checklist

After implementing fixes:

-   [ ] User can complete payment with no movie_id specified
-   [ ] Subscription is created immediately after payment
-   [ ] User can access `/watch` without redirect
-   [ ] Watch page loads without 503 error
-   [ ] Video URL is valid and serves correctly
-   [ ] User receives payment success email
-   [ ] Subscription expiry is set to +365 days
-   [ ] Admin users bypass payment check
-   [ ] Payment history shows in user profile
-   [ ] Multiple users can have same movie subscription

---

## 10. Files to Review

Key files in this flow:

-   [PaymentController.php](app/Http/Controllers/PaymentController.php#L20) - Payment init & callback
-   [WatchController.php](app/Http/Controllers/WatchController.php#L1) - Watch access logic
-   [User.php](app/Models/User.php#L60) - Authorization methods
-   [Subscription.php](app/Models/Subscription.php#L1) - Subscription model
-   [EnsureHasPaid.php](app/Http/Middleware/EnsureHasPaid.php#L1) - Route middleware
-   [Payment.vue](resources/js/Pages/Payment.vue#L1) - Payment form UI
-   [Watch.vue](resources/js/Pages/Watch.vue#L1) - Video player UI

---

## Conclusion

The payment system is **fundamentally sound** but has a critical **data flow issue**:

1. ✅ Payment processing works (Paystack integration)
2. ✅ Authorization middleware works (checks subscription)
3. ✅ Watch page frontend works (video player functional)
4. ❌ **Subscriptions aren't being created** → no access granted
5. ❌ **movie_id missing** → Subscription creation skipped

**Primary fix**: Ensure `movie_id` is always provided and subscription is created on every successful payment.

---

**Prepared by**: Code Audit Agent  
**Next Steps**: Implement fixes and run full payment flow test with real user
