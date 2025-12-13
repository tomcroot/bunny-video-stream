# Email System Testing & Diagnostic Guide

## Quick Health Check Commands

Run these commands in your Laravel app to diagnose email system health:

### 1. Test Mail Configuration

```bash
php artisan tinker
```

Then paste these commands:

```php
// Check if .env is loaded correctly
echo "MAIL_MAILER: " . config('mail.default') . "\n";
echo "MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
echo "MAIL_FROM: " . config('mail.from.address') . "\n";
echo "QUEUE_DRIVER: " . config('queue.default') . "\n";
```

**Expected Output:**

```
MAIL_MAILER: smtp
MAIL_HOST: smtp-relay.brevo.com
MAIL_FROM: no-reply@acrazydayinaccra.com
QUEUE_DRIVER: database
```

### 2. Send Test Email

```bash
php artisan tinker
```

```php
use App\Models\User;
use App\Mail\PaymentSuccessEmail;
use App\Models\Payment;
use App\Models\Subscription;

// Get a test user
$user = User::first();

// Get or create test data
$payment = Payment::latest()->first() ?? Payment::factory()->create();
$subscription = Subscription::latest()->first() ?? Subscription::factory()->create();

// Try sending the email
try {
    Mail::send(new PaymentSuccessEmail($payment, $subscription));
    echo "✓ Email sent successfully!\n";
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

// Check the log
Log::info('Test completed');
```

### 3. Test SMTP Connection Directly

```php
// In tinker
use Illuminate\Support\Facades\Mail;
use PHPMailer\PHPMailer\PHPMailer;

$mailer = Mail::mailer('smtp');
echo "SMTP Configuration: \n";
echo "Host: " . config('mail.mailers.smtp.host') . "\n";
echo "Port: " . config('mail.mailers.smtp.port') . "\n";
echo "Username: " . config('mail.mailers.smtp.username') . "\n";
```

### 4. Check for Stuck Queue Jobs

```php
use Illuminate\Support\Facades\DB;

// Check if there are any queued mail jobs
$jobs = DB::table('jobs')->where('queue', 'default')->get();
echo "Queued jobs: " . count($jobs) . "\n";

foreach ($jobs as $job) {
    echo "Job ID: {$job->id}, Type: {$job->payload}\n";
}

// If you find stuck jobs, delete them:
DB::table('jobs')->where('queue', 'default')->delete();
echo "✓ Cleared stuck jobs\n";
```

### 5. View Recent Email Errors

```bash
# Check the last 50 lines of the error log
tail -50 /Users/tomc/Herd/crazyday/storage/logs/laravel.log | grep -i "payment.*email\|mail.*error"
```

---

## Full Email Testing Workflow

### Step 1: Verify Configuration

```bash
php artisan config:show mail
php artisan config:show queue
```

### Step 2: Clear Any Stuck Jobs

```bash
php artisan queue:flush
```

### Step 3: Test Mail Sending

```bash
php artisan tinker
```

```php
// Create minimal test data
$user = \App\Models\User::factory()->create(['email' => 'test@example.com']);
$payment = \App\Models\Payment::factory()->create(['user_id' => $user->id]);
$subscription = \App\Models\Subscription::factory()->create(['user_id' => $user->id]);

// Attempt to send
Mail::send(new \App\Mail\PaymentSuccessEmail($payment, $subscription));

// Check if it worked
$logs = file_get_contents('storage/logs/laravel.log');
if (strpos($logs, 'Payment success email sent') !== false) {
    echo "✓ Email sent successfully!";
} else {
    echo "✗ Check logs: storage/logs/laravel.log";
}
```

### Step 4: Check Production .env

```bash
grep "MAIL_" /Users/tomc/Herd/crazyday/.env
```

**Should show:**

```
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=9c26e0001@smtp-brevo.com
MAIL_PASSWORD=xsmtpsib-...
MAIL_FROM_ADDRESS="no-reply@acrazydayinaccra.com"
MAIL_FROM_NAME="A Crazy Day in Accra"
MAIL_ENCRYPTION=tls
```

---

## Monitoring Checklist

### Daily Tasks

-   [ ] Check error logs for mail failures: `tail -f storage/logs/laravel.log | grep -i mail`
-   [ ] Verify SMTP credentials are still valid
-   [ ] Check Brevo API key works: `curl -X GET https://api.brevo.com/v3/account -H "api-key: YOUR_KEY"`

### Weekly Tasks

-   [ ] Audit payment emails sent vs users registered
-   [ ] Review email delivery statistics
-   [ ] Test with a real payment (use test credentials)
-   [ ] Verify email content renders correctly

### Infrastructure Tasks

-   [ ] Ensure queue worker is running (if using ShouldQueue): `ps aux | grep "queue:work"`
-   [ ] Monitor disk space for logs: `df -h`
-   [ ] Verify database jobs table: `SELECT COUNT(*) FROM jobs;`

---

## Common Issues & Solutions

### Issue: "Failed to send mail: No recipient addresses"

**Cause:** Payment model doesn't have a related user  
**Solution:**

```php
// Check if user relationship exists
$payment = Payment::with('user')->find($id);
if (!$payment->user) {
    echo "User not found!";
    return;
}
```

### Issue: "Connection refused" errors

**Cause:** SMTP credentials incorrect or Brevo API down  
**Solution:**

```bash
# Test SMTP connection
telnet smtp-relay.brevo.com 587

# Test API
curl -X GET https://api.brevo.com/v3/account \
  -H "api-key: $(grep BREVO_API_KEY .env | cut -d= -f2)"
```

### Issue: Emails sent but not received

**Cause:** Check spam folder or email validation  
**Solution:**

```php
// Verify email address is valid
$email = $payment->user->email;
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email: {$email}";
}

// Check email was actually sent
grep "Payment success email sent" storage/logs/laravel.log | tail -5
```

### Issue: Timeout errors

**Cause:** SMTP server slow or network issue  
**Solution:**

```php
// Increase timeout in config/mail.php
'timeout' => 30, // seconds
```

---

## Testing with Real Payments

### Using Test Paystack Credentials

```
Public Key: pk_test_af162040a1620c12ae7df09837607238a3866365
Secret Key: sk_test_c99c1b9778dbf0d0a0eaecf9bac14f43208c38bf
```

### Steps to Test:

1. Navigate to `/payment` endpoint
2. Use test card: `4084 0343 3024 1381`
3. Any future date for expiry
4. Any CVV (e.g., 123)
5. Verify email is sent within 5 seconds

### Verify Email was Sent:

```bash
# Check logs
grep -i "payment success email" storage/logs/laravel.log | tail -5

# Look for timestamps
tail -20 storage/logs/laravel.log
```

---

## Debugging Email Content

### View Raw Email

```php
// In tinker
$payment = Payment::latest()->first();
$subscription = Subscription::latest()->first();

$mail = new \App\Mail\PaymentSuccessEmail($payment, $subscription);

// Get the rendered HTML
echo $mail->render();
```

### Test Email Template

```bash
php artisan tinker
```

```php
use Illuminate\Support\Facades\View;

$payment = \App\Models\Payment::latest()->first();
$subscription = \App\Models\Subscription::latest()->first();

echo View::make('emails.payment-success', [
    'user' => $payment->user,
    'movie' => $subscription->movie,
    'expiresAt' => $subscription->expires_at,
    'amount' => $payment->amount,
    'transactionRef' => $payment->reference,
])->render();
```

---

## Production Deployment Checklist

-   [ ] ✓ PaymentSuccessEmail no longer implements ShouldQueue
-   [ ] ✓ PaymentSuccessEmail has `to: [$this->payment->user->email]` in envelope
-   [ ] ✓ Error logs include full trace for debugging
-   [ ] ✓ Test mail before going live: `php artisan tinker` + test send
-   [ ] ✓ Verify .env has correct MAIL_MAILER=smtp
-   [ ] ✓ Verify Brevo credentials are in .env
-   [ ] ✓ No queue worker needed (emails sent synchronously)
-   [ ] ✓ Monitor logs: `tail -f storage/logs/laravel.log | grep -i mail`
-   [ ] ✓ Set up alerts for mail failures
-   [ ] ✓ Document email sending process for team

---

## Emergency Procedures

### If Emails Stop Working

```bash
# 1. Check configuration
grep "MAIL_" .env

# 2. Test SMTP
php artisan tinker
Mail::raw('test', fn($m) => $m->to('admin@example.com'))

# 3. Check logs
tail -100 storage/logs/laravel.log | grep -i error

# 4. Clear cache
php artisan cache:clear
php artisan config:cache

# 5. Verify database connection
php artisan tinker
DB::select('SELECT 1')
```

### If Brevo API Fails

The system will fall back to SMTP automatically (see EmailService.php)

### If Database Connection Fails

Without a queue worker, this won't affect synchronous emails

---

## References

-   [Laravel Mail Documentation](https://laravel.com/docs/11.x/mail)
-   [Brevo SMTP Configuration](https://docs.brevo.com/article/85-setup-your-smtp)
-   [Laravel Mailable](https://laravel.com/docs/11.x/mail#generating-mailables)
