# PAYMENT & WATCH FLOW - EXECUTIVE SUMMARY

**Investigation Completed**: January 2, 2026  
**Issue**: Users report successful payment but cannot access watch page  
**Severity**: 🔴 CRITICAL - Blocks 100% of new paying users

---

## THE PROBLEM (In Plain English)

Users are completing payment on Paystack successfully, but when they return to the app, they get redirected back to the payment page instead of having access to the movie. The "access denied" problem is blocking revenue.

---

## ROOT CAUSES IDENTIFIED

### Primary Issue: Payment Callback Status Not Updated (Most Likely)

The system has **two mechanisms** to grant access:

1. **Successful Payment**: If `Payment.status = 'success'` → User gets access
2. **Active Subscription**: If `Subscription.expires_at > now()` → User gets access

When a user completes Paystack payment:

-   System should verify payment with Paystack
-   Update `Payment.status` to 'success'
-   Create a `Subscription` record
-   Redirect user to `/watch`

**What's likely happening**:

-   Paystack verification is **failing silently**
-   Payment status never changes from 'initialized'
-   Subscription is **never created** (requires movie_id AND successful payment)
-   Middleware check fails → user redirected to payment page

### Secondary Issue: Missing movie_id in Some Cases

There are TWO ways users enter payment flow:

1. **Direct Button Click** (PurchaseButton.vue)

    - Sends `movie_id` directly ✅
    - Works correctly

2. **Checkout Page** (Payment.vue at `/payment/checkout`)
    - Gets `movie_id` from URL query string
    - Can be NULL if user visits `/payment/checkout` without params ⚠️
    - When movie_id is null → subscription creation is **skipped**

### Tertiary Issue: Queue Worker May Not Be Running

Email confirmations are dispatched to queue but:

-   If queue worker isn't running → emails never sent
-   Users don't get payment confirmation
-   They think payment failed and try again

---

## AUDIT DOCUMENTS CREATED

I've created three detailed audit documents in your repo:

1. **[PAYMENT_WATCH_FLOW_AUDIT.md](PAYMENT_WATCH_FLOW_AUDIT.md)** - Comprehensive analysis of the entire flow
2. **[PAYMENT_WATCH_SOLUTIONS.md](PAYMENT_WATCH_SOLUTIONS.md)** - Detailed solutions and code examples
3. **[PAYMENT_DIAGNOSTIC_REPORT.md](PAYMENT_DIAGNOSTIC_REPORT.md)** - Diagnostic guide with queries and tests

---

## IMMEDIATE ACTION ITEMS

### 🔴 MUST DO (Today)

**1. Add Detailed Logging**

-   Current code logs NOTHING when payment callback fails
-   You're flying blind
-   Add logging to see exactly where callbacks are failing

**2. Check Database**

```bash
php artisan tinker
# Check how many payments are stuck in 'initialized' state
>>> App\Models\Payment::where('status', 'initialized')->where('created_at', '>', now()->subDays(1))->count()

# Check if any successful payments have no subscriptions
>>> App\Models\Payment::where('status', 'success')->count()
>>> App\Models\Subscription::count()
```

**3. Verify Queue Worker**

```bash
# Check if jobs are stuck
php artisan queue:failed

# Check if queue worker is running
ps aux | grep "queue:work"
```

### 🟡 SHOULD DO (This Week)

**1. Fix PaymentController.php**

-   Add default movie_id (never null)
-   Force subscription creation on success
-   Add comprehensive logging

**2. Fix Payment.vue**

-   Use props.movieId instead of query param
-   Add fallback value

**3. Ensure PageContent Exists**

-   Verify watch page content record in database
-   Run migration if needed: `php artisan migrate --path=database/migrations/2025_12_13_150500_ensure_watch_page_content_record.php`

---

## KEY CODE INSIGHTS

### Why Subscriptions Aren't Created

```php
// Current code - Line 233 in PaymentController::callback()
$movieId = $payment->meta['movie_id'] ?? null;
if ($movieId) {  // ← THIS CONDITION FAILS IF movie_id IS NULL
    $subscription = Subscription::updateOrCreate(
        ['user_id' => $payment->user_id, 'movie_id' => $movieId],
        ['payment_id' => $payment->id, 'expires_at' => now()->addDays(365)]
    );
}
// If movieId is null, this entire block is SKIPPED
```

### Why Users Can't Access Watch Page

```php
// Current middleware logic - Good but insufficient
if (! $user->hasSuccessfulPayment() && ! $user->hasActiveSubscription()) {
    return redirect()->route('payment.checkout');
}

// Works IF hasSuccessfulPayment() returns true
// BUT if Payment.status is still 'initialized', this fails
```

### The Two Payment Entry Points

**Entry Point 1** (Direct button - works):

```
Gallery → PurchaseButton (sends movie_id: 1) → /payments/init → Paystack → Success
```

**Entry Point 2** (Checkout page - risky):

```
URL bar → /payment/checkout → Payment.vue (movie_id from query param) → /payments/init → Paystack
```

If user visits `/payment/checkout` without `?movieId=X`, then movie_id is null.

---

## TESTING CHECKLIST

After implementing fixes:

-   [ ] Make a test payment as new user
-   [ ] Check `payments` table - status should be 'success'
-   [ ] Check `subscriptions` table - record should exist
-   [ ] User should see watch page without redirect
-   [ ] Video should load and play
-   [ ] User should receive payment confirmation email

---

## DATA TO COLLECT

Run these queries to understand current state:

```bash
php artisan tinker

# How many stuck payments?
>>> App\Models\Payment::where('status', '!=', 'success')->where('created_at', '>', now()->subDays(1))->count()

# Successful payments without subscriptions?
>>> App\Models\Payment::where('status', 'success')->with('user')->get()->filter(function($p) { return $p->user->subscriptions->count() === 0; })->count()

# Check recent payments
>>> App\Models\Payment::latest()->limit(5)->get(['id', 'user_id', 'reference', 'status', 'paid_at'])

# Check subscription count
>>> App\Models\Subscription::count()
```

---

## FILES NEEDING CHANGES

**Priority 1 (Do First)**:

-   [app/Http/Controllers/PaymentController.php](app/Http/Controllers/PaymentController.php) - Add logging, fix subscription creation
-   [app/Http/Controllers/PaymentCheckoutController.php](app/Http/Controllers/PaymentCheckoutController.php) - Pass movieId to view

**Priority 2 (Do Second)**:

-   [resources/js/Pages/Payment.vue](resources/js/Pages/Payment.vue) - Use props instead of query param
-   [config/queue.php](config/queue.php) - Verify queue configuration

**Priority 3 (Monitor)**:

-   [app/Http/Middleware/EnsureHasPaid.php](app/Http/Middleware/EnsureHasPaid.php) - Add logging to see which check fails
-   [app/Models/User.php](app/Models/User.php) - Verify authorization methods

---

## EXPECTED BEHAVIOR AFTER FIX

```
User Journey After Fix:
1. User navigates to movie page
2. Clicks "Watch Now" button (or goes to /payment/checkout)
3. Fills in payment details
4. Completes payment on Paystack
5. Paystack redirects back to app
6. System verifies payment ✅
7. Creates subscription record ✅
8. Redirects to /watch ✅
9. Video loads and plays ✅
10. User receives confirmation email ✅
```

---

## MONITORING POST-FIX

Add these to your dashboard:

-   **Daily new payments** (should be increasing)
-   **Success rate %** (should be 95%+)
-   **Payment → Subscription creation rate** (should be ~100%)
-   **Watch page access (authenticated users)** (should spike after payment)
-   **Queue jobs pending/failed** (should be 0)

---

## SUMMARY

| Aspect                    | Status           | Issue                          |
| ------------------------- | ---------------- | ------------------------------ |
| **Payment Processing**    | ⚠️ Broken        | Callback verification failing  |
| **movie_id Handling**     | ⚠️ Fragile       | Can be null in some flows      |
| **Subscription Creation** | ❌ Not Happening | Never created if movie_id null |
| **Authorization**         | ✅ Sound         | Middleware logic is correct    |
| **User Communication**    | ⚠️ Silent Fail   | No logs, no error messages     |
| **Queue System**          | ❓ Unknown       | May not be running             |

---

**Recommendation**: Start with Priority 1 items TODAY. The main issue is likely that Paystack callbacks are failing silently with no logging. Add logging first to see exactly what's happening, then implement the other fixes.

See detailed audit documents for complete code examples and solutions.
