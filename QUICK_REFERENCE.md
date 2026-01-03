# PAYMENT & WATCH FLOW - QUICK REFERENCE CHECKLIST

**Print this page or keep open while implementing fixes**

---

## 🔍 DIAGNOSIS CHECKLIST (5 minutes)

Run these commands to understand your current situation:

```bash
# 1. Check payment records
php artisan tinker
>>> App\Models\Payment::selectRaw('status, count(*) as count')->groupBy('status')->get()

# Expected output should show mainly 'success' statuses
# If you see many 'initialized' or 'failed' → PROBLEM FOUND!

# 2. Check subscription count
>>> App\Models\Subscription::count()

# Compare with successful payments count
>>> App\Models\Payment::where('status', 'success')->count()

# Ratio should be similar (subscription per successful payment)

# 3. Check recent logs
# Exit tinker first: exit
tail -50 storage/logs/laravel.log | grep -i "payment\|verify\|error"

# Should see payment verification logs
# If empty or showing errors → PROBLEM FOUND!

# 4. Check queue status
php artisan queue:failed

# Should show: No failed jobs
# If showing jobs → Queue not running
```

---

## 📝 IMPLEMENTATION CHECKLIST

### FIX #1: Add Logging (30 minutes)

**File**: `app/Http/Controllers/PaymentController.php`

-   [ ] Replace `callback()` method with enhanced version from PAYMENT_CODE_FIXES.md
-   [ ] Replace `webhook()` method with enhanced version from PAYMENT_CODE_FIXES.md
-   [ ] Test code for syntax errors: `php artisan tinker` then `exit`
-   [ ] Deploy to staging/production

**After deploying FIX #1**:

-   [ ] Wait for next payment attempt (or trigger test payment)
-   [ ] Check logs: `tail -50 storage/logs/laravel.log`
-   [ ] Look for "=== PAYMENT CALLBACK START ===" entries
-   [ ] Identify where payment fails (verify step usually)

### FIX #2: Ensure movie_id (15 minutes)

**File**: `app/Http/Controllers/PaymentController.php`

-   [ ] In `init()` method: Add `$movieId = $validated['movie_id'] ?? 1;`
-   [ ] In `callback()` method: Ensure `$movieId = $payment->meta['movie_id'] ?? 1;`
-   [ ] In `webhook()` method: Ensure `$movieId = $payment->meta['movie_id'] ?? 1;`
-   [ ] Deploy to staging/production

### FIX #3: Force Subscription Creation (15 minutes)

**File**: `app/Http/Controllers/PaymentController.php`

-   [ ] In `callback()`: Wrap subscription creation in try-catch (see PAYMENT_CODE_FIXES.md)
-   [ ] In `webhook()`: Same wrap and try-catch
-   [ ] Ensure subscription is created even if movie_id is null (fallback to 1)
-   [ ] Test code for syntax errors
-   [ ] Deploy to staging/production

### FIX #4: Update PaymentCheckoutController (10 minutes)

**File**: `app/Http/Controllers/PaymentCheckoutController.php`

-   [ ] Add line: `$movieId = $request->query('movieId', 1);`
-   [ ] Add to Inertia::render: `'movieId' => $movieId,`
-   [ ] Test code for syntax errors
-   [ ] Deploy to staging/production

### FIX #5: Update Payment.vue (10 minutes)

**File**: `resources/js/Pages/Payment.vue`

-   [ ] In script setup, add `movieId` to props
-   [ ] In `initiatePayment()`: Replace query param retrieval with `const movieId = props.movieId || 1`
-   [ ] Test in browser (check browser console for errors)
-   [ ] Deploy to staging/production

### FIX #6: Verify Queue Configuration (20 minutes)

**File**: `config/queue.php` and `.env`

-   [ ] Verify `.env` has: `QUEUE_CONNECTION=database`
-   [ ] If production: Verify Supervisor/systemd runs queue worker
-   [ ] Check: `ps aux | grep "queue:work"`
-   [ ] If not running, start it: `php artisan queue:work --queue=payments`

---

## ✅ TESTING CHECKLIST

### Before any fixes:

-   [ ] Check current database state (Diagnosis checklist above)
-   [ ] Create backup of production database (if applicable)
-   [ ] Note current payment success rate

### After each fix:

-   [ ] Test code for syntax errors: `php artisan tinker` → `exit`
-   [ ] Check for compile errors: `php artisan optimize`
-   [ ] Deploy to staging first (NOT production directly)

### After all fixes:

-   [ ] Create test account with real payment
-   [ ] Complete payment on Paystack
-   [ ] Check database immediately after payment:
    ```bash
    php artisan tinker
    >>> $payment = App\Models\Payment::latest()->first()
    >>> $payment->status  # Should be 'success'
    >>> $payment->meta    # Should have movie_id
    >>> $payment->user->subscriptions()->count()  # Should be > 0
    ```
-   [ ] Try accessing `/watch` - should NOT redirect to payment
-   [ ] Video should load without 503 error
-   [ ] User should receive confirmation email within 1 minute
-   [ ] Check logs show complete flow

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Call to undefined method PaystackService::verify"

**Fix**: Check PaystackService.php exists at: `app/Services/PaystackService.php`

### Issue: "Undefined property: $verified"

**Fix**: Verify Paystack API response structure in logs

### Issue: "Subscription creation fails with unique constraint violation"

**Fix**: Check if user already has subscription for that movie

```bash
php artisan tinker
>>> $user = User::find(1)
>>> $user->subscriptions()->where('movie_id', 1)->first()
# Should use updateOrCreate, not create
```

### Issue: "Queue jobs stuck"

**Fix**: Check queue worker is running

```bash
ps aux | grep "queue:work"
# If empty, start it:
php artisan queue:work --queue=payments
```

### Issue: "Email never arrives"

**Fix**: Check queue worker is running (above)

```bash
php artisan queue:failed
# If showing jobs, they're stuck in queue
php artisan queue:retry all
```

---

## 📊 METRICS TO MONITOR

After fixes, track these daily:

| Metric                  | Current | Target          | Frequency     |
| ----------------------- | ------- | --------------- | ------------- |
| Payment count           | ?       | +X/day          | Daily         |
| Success rate %          | ?       | 95%+            | Daily         |
| Subscription creation % | ?       | 100%            | Daily         |
| Watch page access       | ?       | ↑ after payment | Hourly        |
| Queue failed jobs       | ?       | 0               | Every 4 hours |
| Email delivery time     | ?       | < 1 min         | Per payment   |

**Dashboard SQL**:

```sql
-- Daily payments
SELECT DATE(created_at), status, COUNT(*)
FROM payments
GROUP BY DATE(created_at), status
ORDER BY DATE(created_at) DESC;

-- Subscription to payment ratio
SELECT
  COUNT(DISTINCT p.id) as payments_success,
  COUNT(DISTINCT s.id) as subscriptions,
  ROUND((COUNT(DISTINCT s.id) / COUNT(DISTINCT p.id)) * 100, 2) as ratio
FROM payments p
LEFT JOIN subscriptions s ON p.id = s.payment_id
WHERE p.status = 'success' AND p.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

## 🚀 DEPLOYMENT CHECKLIST

**Before deploying to production**:

-   [ ] All fixes implemented and tested on staging
-   [ ] No syntax errors: `php artisan optimize`
-   [ ] Database migrations run (if any): `php artisan migrate`
-   [ ] Cache cleared: `php artisan cache:clear`
-   [ ] Configuration cached: `php artisan config:cache`
-   [ ] Queue worker will restart after deployment
-   [ ] Monitoring/alerts are set up
-   [ ] Rollback plan documented (if needed)

**After deploying to production**:

-   [ ] Monitor logs: `tail -f storage/logs/laravel.log`
-   [ ] Wait for first payment attempt
-   [ ] Check logs for complete flow
-   [ ] Verify database: subscription created
-   [ ] Confirm user can access `/watch`
-   [ ] Verify email sent to user
-   [ ] Get feedback from support team

---

## 🔄 ROLLBACK PLAN (If Needed)

If things go wrong after deployment:

1. **Immediate**: Disable payment route

    ```php
    // In routes/web.php
    // Route::get('/payment/checkout', ...)->name('payment.checkout');
    // Comment out to disable
    ```

2. **Revert code**: Roll back to previous commit

    ```bash
    git revert HEAD~[N]  # N = number of commits to revert
    git push
    ```

3. **Restore database**: From backup

    ```bash
    # If using MySQL
    mysql -u user -p database < backup.sql
    ```

4. **Restart services**
    ```bash
    php artisan cache:clear
    php artisan queue:restart
    ```

---

## 📞 SUPPORT CONTACTS

When things go wrong:

1. **Check logs first**: `tail -50 storage/logs/laravel.log`
2. **Review database**: `php artisan tinker`
3. **Check Paystack**: Dashboard → Transactions
4. **Check deployment**: All files deployed correctly?
5. **Check queue**: `php artisan queue:failed`

---

## 💾 QUICK COMMANDS

```bash
# View logs
tail -50 storage/logs/laravel.log

# Search logs for errors
tail -100 storage/logs/laravel.log | grep -i "error\|exception\|failed"

# Search for payment logs
tail -100 storage/logs/laravel.log | grep -i "payment\|verify\|subscription"

# Open tinker
php artisan tinker

# Clear cache
php artisan cache:clear

# Optimize
php artisan optimize

# Check queue
php artisan queue:failed

# Retry queue
php artisan queue:retry all

# Start queue worker
php artisan queue:work --queue=payments --tries=3

# Stop queue worker
pkill -f "queue:work"

# Backup database
mysqldump -u user -p database > backup_$(date +%Y%m%d_%H%M%S).sql

# Run migration
php artisan migrate
```

---

## 📋 FILE REFERENCE

| File                                                 | Changes                            | Priority |
| ---------------------------------------------------- | ---------------------------------- | -------- |
| `app/Http/Controllers/PaymentController.php`         | Add logging, subscription creation | 1        |
| `app/Http/Controllers/PaymentCheckoutController.php` | Pass movieId                       | 1        |
| `resources/js/Pages/Payment.vue`                     | Use props.movieId                  | 2        |
| `config/queue.php`                                   | Verify configuration               | 3        |
| `.env`                                               | QUEUE_CONNECTION=database          | 3        |

---

## ⏱️ TIME ESTIMATES

| Task                  | Time            |
| --------------------- | --------------- |
| Diagnosis             | 5 min           |
| FIX #1 (Logging)      | 30 min          |
| FIX #2 (movie_id)     | 15 min          |
| FIX #3 (Subscription) | 15 min          |
| FIX #4 (Controller)   | 10 min          |
| FIX #5 (Vue)          | 10 min          |
| FIX #6 (Queue)        | 20 min          |
| Testing               | 30 min          |
| Deployment            | 15 min          |
| **Total**             | **2.5-3 hours** |

---

## ✨ SUCCESS INDICATORS

✅ Deployment is successful when:

-   Payment callback logs show complete flow
-   Database shows subscription created
-   User can access `/watch` without redirect
-   Video loads and plays
-   Email confirmation received

---

**Start with**: Diagnosis Checklist (5 min)  
**Then**: FIX #1 (Logging) - Deploy and wait for payment  
**Then**: FIX #2-#6 (Other fixes) - Deploy and test
