# Environment Variables Deployment Checklist

Use this checklist when deploying to a new environment or production.

## Pre-Deployment Verification

### ✅ Core Application

-   [ ] `APP_NAME` set to production name
-   [ ] `APP_ENV=production` (not local/staging)
-   [ ] `APP_DEBUG=false` (never true in production)
-   [ ] `APP_KEY` generated and stored securely
-   [ ] `APP_URL` set to correct production domain
-   [ ] `LOG_LEVEL=warning` (not debug)
-   [ ] `.env` file is NOT in version control
-   [ ] `.env.example` IS committed with placeholder values

### ✅ Database

-   [ ] `DB_CONNECTION` set correctly (mysql, postgres, etc.)
-   [ ] `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` configured
-   [ ] Database user has minimal required permissions
-   [ ] Database backups are scheduled
-   [ ] Database connection is SSL/TLS enabled (if possible)
-   [ ] Run `php artisan migrate` before starting app
-   [ ] Verify database migrations completed: `php artisan migrate:status`

### ✅ Session & Cache (Choose One)

**Option A: Database-Backed (Development/Small Scale)**

-   [ ] `SESSION_DRIVER=database`
-   [ ] `CACHE_STORE=database`
-   [ ] `QUEUE_CONNECTION=database`
-   [ ] Run `php artisan migrate` includes sessions table

**Option B: Redis (Production Recommended)**

-   [ ] `SESSION_DRIVER=redis`
-   [ ] `CACHE_STORE=redis`
-   [ ] `QUEUE_CONNECTION=redis`
-   [ ] `REDIS_HOST` set to Redis server
-   [ ] `REDIS_PORT=6379` (or custom port)
-   [ ] `REDIS_PASSWORD` set if authentication required
-   [ ] Redis server is running and accessible
-   [ ] Test: `php artisan cache:clear` completes successfully

### ✅ Email Service (Brevo)

**Required for**: Password resets, payment confirmations, notifications

-   [ ] `MAIL_MAILER=smtp`
-   [ ] `MAIL_HOST=smtp-relay.brevo.com`
-   [ ] `MAIL_PORT=587`
-   [ ] `MAIL_USERNAME` is valid Brevo sender email
-   [ ] `MAIL_PASSWORD` is correct Brevo SMTP password (not API key)
-   [ ] `MAIL_FROM_ADDRESS` is valid and verified
-   [ ] `MAIL_FROM_NAME` is set
-   [ ] `BREVO_API_KEY` obtained from Brevo settings
-   [ ] Test email sending: `php artisan tinker` → `Mail::raw('Test', fn($m) => $m->to('admin@test.com'))`
-   [ ] Check email logs in storage/logs/

### ✅ Payment Gateway (Paystack)

**Required for**: Processing payments, subscriptions, transactions

**Test Mode Setup**:

-   [ ] `PAYSTACK_MODE=test` (during development)
-   [ ] `PAYSTACK_PUBLIC_KEY=pk_test_XXXXX` (starts with pk*test*)
-   [ ] `PAYSTACK_SECRET_KEY=sk_test_XXXXX` (starts with sk*test*, NEVER expose)
-   [ ] Use Paystack test credit card: 4084 0343 6360 6891, CVV: 408

**Production Mode Setup**:

-   [ ] `PAYSTACK_MODE=live` (only after testing)
-   [ ] `PAYSTACK_PUBLIC_KEY=pk_live_XXXXX` (starts with pk*live*)
-   [ ] `PAYSTACK_SECRET_KEY=sk_live_XXXXX` (starts with sk*live*)
-   [ ] Account verified for live transactions
-   [ ] Daily transaction limits set appropriately

**Both Modes**:

-   [ ] `PAYSTACK_CURRENCY=GHS` (or appropriate currency)
-   [ ] `PAYSTACK_CALLBACK_URL` matches production domain: `https://yourdomain.com/payment`
-   [ ] `PAYSTACK_WEBHOOK_URL` matches production domain: `https://yourdomain.com/webhooks/paystack`
-   [ ] Webhook registered in Paystack dashboard:
    -   [ ] Settings → API Keys & Webhooks
    -   [ ] Add webhook URL
    -   [ ] Subscribe to: `charge.success` event
-   [ ] Test payment flow end-to-end
-   [ ] Verify payment records created in database
-   [ ] Verify confirmation emails sent

### ✅ SMS Service (mNotify)

**Required for**: OTP delivery, SMS notifications

-   [ ] `MNOTIFY_API_KEY` obtained from mNotify account
-   [ ] `MNOTIFY_SENDER_ID` created and approved
    -   [ ] Alphanumeric sender ID
    -   [ ] Approved by mNotify (24-48 hours)
    -   [ ] Formatted as exact string in .env
-   [ ] Account has SMS credits
-   [ ] Test SMS sending:
    ```bash
    php artisan tinker
    >>> $sms = new BulkSmsService;
    >>> $sms->sendOtp('+233244123456', '123456');
    ```
-   [ ] SMS received on test phone number
-   [ ] OTP login flow tested:
    -   [ ] Enter phone number
    -   [ ] Receive SMS with code
    -   [ ] Enter code and authenticate

### ✅ Video CDN (Bunny)

**Required for**: Video streaming, content delivery

-   [ ] `BUNNY_ACCESS_KEY` from Bunny account
-   [ ] `BUNNY_LIBRARY_ID` from Bunny Video Library
-   [ ] `BUNNY_PULL_ZONE` is CDN hostname (e.g., vz-xxxxx.b-cdn.net)
-   [ ] `BUNNY_STORAGE_ZONE` for upload capability (optional)
-   [ ] Test video URL format: `https://{PULL_ZONE}/video-id.mp4`
-   [ ] Video plays in browser (test in incognito)
-   [ ] Video loads within acceptable time
-   [ ] CDN cache working (compare request headers)
-   [ ] Global CDN distribution enabled

### ✅ Security & Compliance

-   [ ] No hardcoded API keys in code
-   [ ] All secrets stored in `.env` only
-   [ ] `.env` not visible in version control: `git status | grep .env` (should be empty)
-   [ ] `.env` file permissions restricted: `chmod 600 .env`
-   [ ] No plain-text passwords in logs
-   [ ] HTTPS enabled (SSL/TLS certificate valid)
-   [ ] CORS headers configured if needed
-   [ ] Rate limiting enabled (3 OTP/SMS attempts per 15 min)
-   [ ] Application key rotation schedule documented

### ✅ Testing

**Manual Testing Checklist**:

-   [ ] **Auth Flow**:

    -   [ ] Phone login works
    -   [ ] OTP received and verified
    -   [ ] Session created and persistent
    -   [ ] Logout clears session

-   [ ] **2FA**:

    -   [ ] TOTP QR code generated
    -   [ ] Authenticator app accepts code
    -   [ ] 2FA verification works
    -   [ ] Recovery codes work
    -   [ ] 2FA bypass recovery codes function

-   [ ] **Payment**:

    -   [ ] Payment button visible
    -   [ ] Paystack modal opens
    -   [ ] Test payment completes
    -   [ ] Confirmation email sent
    -   [ ] Subscription created
    -   [ ] Video access granted

-   [ ] **OTP**:

    -   [ ] SMS received within 10 seconds
    -   [ ] Code expires after 5 minutes
    -   [ ] Rate limit prevents >3 attempts/15min
    -   [ ] Invalid code rejected

-   [ ] **Email**:

    -   [ ] Password reset email received
    -   [ ] Reset link works
    -   [ ] Confirmation emails sent and displayed correctly

-   [ ] **Video**:
    -   [ ] Video loads without errors
    -   [ ] Video plays smoothly
    -   [ ] Quality options available (if multi-bitrate)
    -   [ ] Works on mobile browsers

### ✅ Monitoring & Logging

-   [ ] Application logs accessible and monitored
-   [ ] Error tracking enabled (Sentry/similar)
-   [ ] Email delivery monitored (Brevo dashboard)
-   [ ] Payment webhook logs verified
-   [ ] SMS delivery verified in mNotify dashboard
-   [ ] Database backup schedule verified
-   [ ] Database query logging (set LOG_QUERIES_WHEN_SLOW if needed)

### ✅ Performance & Scaling

-   [ ] Queue processing in background (QUEUE_CONNECTION not sync)
-   [ ] Cache properly configured for your scale
-   [ ] Database connection pooling enabled
-   [ ] Logs rotated daily to prevent disk fill
-   [ ] Temporary file cleanup scheduled
-   [ ] Memory limits appropriate for app size

---

## Environment Variable Summary Table

| Service      | Variable              | Test Value         | Production Value      | Required |
| ------------ | --------------------- | ------------------ | --------------------- | -------- |
| **Core**     | APP_ENV               | local              | production            | ✅       |
|              | APP_DEBUG             | true               | false                 | ✅       |
|              | APP_KEY               | (auto)             | (auto)                | ✅       |
|              | APP_URL               | http://local.test  | https://acrazyday.com | ✅       |
| **Database** | DB_CONNECTION         | sqlite             | mysql                 | ✅       |
|              | DB_HOST               | localhost          | db.server.com         | ✅       |
|              | DB_DATABASE           | crazyday           | crazyday_prod         | ✅       |
| **Email**    | MAIL_MAILER           | log                | smtp                  | ✅       |
|              | MAIL_HOST             | -                  | smtp-relay.brevo.com  | ✅       |
|              | MAIL_USERNAME         | -                  | sender@brevo.com      | ✅       |
|              | MAIL_PASSWORD         | -                  | (SMTP token)          | ✅       |
|              | BREVO_API_KEY         | -                  | (API key)             | ⚠️       |
| **Payment**  | PAYSTACK_MODE         | test               | live                  | ✅       |
|              | PAYSTACK_PUBLIC_KEY   | pk_test_xxx        | pk_live_xxx           | ✅       |
|              | PAYSTACK_SECRET_KEY   | sk_test_xxx        | sk_live_xxx           | ✅       |
|              | PAYSTACK_CALLBACK_URL | local.test/payment | acrazyday.com/payment | ✅       |
| **SMS**      | MNOTIFY_API_KEY       | -                  | (API key)             | ✅       |
|              | MNOTIFY_SENDER_ID     | -                  | "PLFILMS"             | ✅       |
| **Video**    | BUNNY_ACCESS_KEY      | -                  | (API key)             | ✅       |
|              | BUNNY_LIBRARY_ID      | -                  | (Library ID)          | ✅       |
|              | BUNNY_PULL_ZONE       | -                  | cdn.hostname          | ✅       |

---

## Common Issues & Solutions

### Issue: "Invalid credentials" from Paystack

**Solution**:

1. Verify keys start with correct prefix (pk*test* or sk*test* or pk*live*/sk*live*)
2. Check mode matches keys (test mode with test keys, live with live)
3. Regenerate keys in Paystack dashboard if unsure
4. Clear config cache: `php artisan config:clear`

### Issue: Emails not sending in production

**Solution**:

1. Verify MAIL_PASSWORD is SMTP password, not API key
2. Check MAIL_HOST is exactly: `smtp-relay.brevo.com`
3. Test connection: `php artisan tinker` → `Mail::to('test@example.com')->send(new TestMail())`
4. Check `storage/logs/laravel.log` for SMTP errors
5. Verify firewall allows outbound port 587

### Issue: SMS not received

**Solution**:

1. Verify phone format is E.164: `+233XXXXXXXXX`
2. Check rate limit: Only 3 OTP sends per 15 minutes
3. Verify mNotify account has credits
4. Check mNotify dashboard for failed messages
5. Verify sender ID is approved and matches exactly

### Issue: Videos not streaming from Bunny

**Solution**:

1. Verify pull zone hostname is correct
2. Check video ID/UUID is valid
3. Verify BUNNY_ACCESS_KEY is for correct region
4. Test URL in browser directly: `https://cdn-hostname/video-id.mp4`
5. Check Bunny dashboard for any access restrictions

### Issue: Sessions not persisting

**Solution**:

1. If `SESSION_DRIVER=database`, verify sessions table exists: `php artisan migrate`
2. If `SESSION_DRIVER=redis`, verify Redis is running: `redis-cli ping` → PONG
3. Check SESSION_LIFETIME is not too short (default 120 = 2 hours)
4. Verify SESSION_ENCRYPT=false (unless you know why it should be true)
5. Clear cache: `php artisan cache:clear`

---

## Post-Deployment Verification

After deploying with all variables set:

1. **Health Check**:

    ```bash
    php artisan tinker
    >>> config('app.url')
    >>> config('database.default')
    >>> config('mail.from')
    ```

2. **Database Connection**:

    ```bash
    php artisan db:show
    ```

3. **Cache**:

    ```bash
    php artisan cache:clear
    php artisan cache:ping
    ```

4. **Queue (if Redis)**:

    ```bash
    php artisan queue:work --once
    ```

5. **Test Full Flow**:

    - [ ] User registration (OTP SMS)
    - [ ] Payment processing (Paystack)
    - [ ] Email confirmation (Brevo)
    - [ ] Video access (Bunny)
    - [ ] 2FA setup
    - [ ] Password reset

6. **Monitor for 24 hours**:
    - [ ] Check error logs for exceptions
    - [ ] Monitor email delivery rates
    - [ ] Verify payment transactions
    - [ ] Check SMS delivery status
    - [ ] Monitor video streaming quality

---

## Version Control Rules

**Always follow these rules**:

### ✅ COMMIT to Git

-   `.env.example` (with placeholders)
-   `ENVIRONMENT_CONFIGURATION.md`
-   All application code
-   Config files (except `.env`)

### ❌ NEVER COMMIT to Git

-   `.env` (production or development)
-   `.env.local`
-   `.env.*.php`
-   Database dumps with real data
-   API keys or secrets anywhere in code
-   SSL certificates or private keys

### ✅ Verify Before Push

```bash
# Check no .env files are staged
git status | grep -i ".env"  # Should be empty

# Check .gitignore is correct
cat .gitignore | grep .env   # Should include .env

# Verify no secrets in recent commits
git log -p --all | grep -i "api_key\|secret_key\|password" | head -5
```

---

**Last Updated**: Generated during environment configuration audit
**Next Review**: Before each major deployment to production
