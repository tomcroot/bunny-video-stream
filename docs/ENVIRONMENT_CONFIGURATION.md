# Environment Configuration Guide

This document provides a comprehensive guide to all environment variables and external service integrations used in "A Crazy Day in Accra" project.

## Quick Start

1. Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

2. Generate application key:

    ```bash
    php artisan key:generate
    ```

3. Update all API keys and credentials in `.env` (see sections below)

4. Run migrations:
    ```bash
    php artisan migrate --seed
    ```

---

## Environment Variables by Category

### 1. Core Application Configuration

| Variable              | Purpose                    | Default                | Example                          |
| --------------------- | -------------------------- | ---------------------- | -------------------------------- |
| `APP_NAME`            | Application display name   | "A Crazy Day in Accra" | "A Crazy Day in Accra"           |
| `APP_ENV`             | Environment type           | local                  | local, staging, production       |
| `APP_KEY`             | Application encryption key | (empty)                | base64:xxxxxx (auto-generated)   |
| `APP_DEBUG`           | Debug mode                 | true                   | true (local), false (production) |
| `APP_URL`             | Application URL            | http://crazyday.test   | http://localhost:3000            |
| `APP_LOCALE`          | Default locale             | en                     | en                               |
| `APP_FALLBACK_LOCALE` | Fallback locale            | en                     | en                               |

**Usage**: These are used across the entire application for logging, configuration, and URLs.

---

### 2. Database Configuration

| Variable        | Purpose           | Default   | Example                 |
| --------------- | ----------------- | --------- | ----------------------- |
| `DB_CONNECTION` | Database driver   | sqlite    | sqlite, mysql, postgres |
| `DB_HOST`       | Database hostname | 127.0.0.1 | localhost               |
| `DB_PORT`       | Database port     | 3306      | 3306, 5432              |
| `DB_DATABASE`   | Database name     | laravel   | crazyday                |
| `DB_USERNAME`   | Database user     | root      | root, admin             |
| `DB_PASSWORD`   | Database password | (empty)   | your_password           |

**Usage**: Located in `config/database.php` and used by Laravel's database layer.

**Current Setup**: SQLite (file-based database, no credentials needed)

**To Switch to MySQL**:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=crazyday_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

---

### 3. Session & Cache Configuration

| Variable           | Purpose                   | Default  | Example                        |
| ------------------ | ------------------------- | -------- | ------------------------------ |
| `SESSION_DRIVER`   | Session storage driver    | database | database, cookie, redis, array |
| `SESSION_LIFETIME` | Session timeout (minutes) | 120      | 120 (2 hours)                  |
| `SESSION_ENCRYPT`  | Encrypt session data      | false    | false, true                    |
| `CACHE_STORE`      | Cache driver              | database | database, redis, array, file   |
| `QUEUE_CONNECTION` | Queue driver              | database | database, redis, sync, async   |

**Usage**:

-   `SESSION_DRIVER=database`: User session data stored in database (survives server restarts)
-   `CACHE_STORE=database`: Application caches (OTP codes, rate limits) stored in database
-   `QUEUE_CONNECTION=database`: Async jobs queued in database

**For Production with Redis**:

```env
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

---

### 4. Email Service (Brevo SMTP)

**Purpose**: Send transactional emails (password reset, payment confirmation, welcome emails)

**Configuration Variables**:

| Variable            | Purpose              | Obtain From          |
| ------------------- | -------------------- | -------------------- |
| `MAIL_MAILER`       | Email driver         | smtp                 |
| `MAIL_HOST`         | SMTP server          | smtp-relay.brevo.com |
| `MAIL_PORT`         | SMTP port            | 587                  |
| `MAIL_USERNAME`     | Brevo sender email   | Brevo account        |
| `MAIL_PASSWORD`     | Brevo SMTP password  | Brevo account        |
| `MAIL_FROM_ADDRESS` | Sender email address | Your email           |
| `MAIL_FROM_NAME`    | Sender display name  | Your app name        |
| `BREVO_API_KEY`     | Brevo REST API key   | Brevo account        |

**Setup Instructions**:

1. **Create Brevo Account**: Visit https://www.brevo.com
2. **Get SMTP Credentials**:
    - Go to Settings → SMTP & API
    - Copy SMTP Login (sender email)
    - Generate SMTP Password
3. **Get API Key**:
    - Go to Settings → SMTP & API
    - Find API Key section
    - Create/copy your API key
4. **Update .env**:
    ```env
    MAIL_HOST=smtp-relay.brevo.com
    MAIL_PORT=587
    MAIL_USERNAME=your-brevo-sender@example.com
    MAIL_PASSWORD=xsmtpsib-xxxxxxxxxxxxxx
    MAIL_FROM_ADDRESS="noreply@acrazydayinaccra.com"
    MAIL_FROM_NAME="A Crazy Day in Accra"
    BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxx
    ```

**Used In**:

-   `app/Mail/PaymentSuccessEmail.php` - Queued emails after payment
-   Password reset emails (Fortify)
-   Welcome emails for new users (OtpController)
-   Contact form responses (ContactController)

**Test Email Sending**:

```bash
php artisan tinker
>>> Mail::raw('Test email', function ($m) { $m->to('test@example.com'); })
```

---

### 5. Payment Gateway (Paystack)

**Purpose**: Process card and mobile money payments, subscription transactions

**Configuration Variables**:

| Variable                | Purpose              | Obtain From                       |
| ----------------------- | -------------------- | --------------------------------- |
| `PAYSTACK_MODE`         | test or live mode    | Paystack account                  |
| `PAYSTACK_PUBLIC_KEY`   | Frontend payment key | Paystack dashboard                |
| `PAYSTACK_SECRET_KEY`   | Backend/webhook key  | Paystack dashboard (SECRET!)      |
| `PAYSTACK_CURRENCY`     | Transaction currency | GHS                               |
| `PAYSTACK_CALLBACK_URL` | Payment redirect URL | Your app URL + /payment           |
| `PAYSTACK_WEBHOOK_URL`  | Webhook listener URL | Your app URL + /webhooks/paystack |

**Setup Instructions**:

1. **Create Paystack Account**: Visit https://paystack.com
2. **Verify Account**: Complete KYC for live mode
3. **Get API Keys**:
    - Go to Settings → API Keys & Webhooks
    - Copy Test Public Key (starts with `pk_test_`)
    - Copy Test Secret Key (starts with `sk_test_`)
    - For live: Use Live keys (starts with `pk_live_`, `sk_live_`)
4. **Set Webhook URL**:
    - Go to Settings → API Keys & Webhooks
    - Add webhook URL: `https://yourdomain.com/webhooks/paystack`
    - Subscribe to: `charge.success` event
5. **Update .env**:
    ```env
    PAYSTACK_MODE=test
    PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxx
    PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
    PAYSTACK_CURRENCY=GHS
    PAYSTACK_CALLBACK_URL=http://crazyday.test/payment
    PAYSTACK_WEBHOOK_URL=http://crazyday.test/webhooks/paystack
    ```

**⚠️ IMPORTANT - NEVER commit live secret keys to Git!**

**Production Deployment**:

-   Use `PAYSTACK_MODE=live`
-   Use live keys (pk*live*, sk*live*)
-   Set callback URLs to production domain
-   Verify webhook URL points to production

**Used In**:

-   `app/Services/PaystackService.php` - Payment verification
-   `app/Http/Controllers/PaymentController.php` - Init, callback, webhook
-   `resources/js/components/PurchaseButton.vue` - Frontend payment form
-   `config/paystack.php` - Configuration

**Payment Flow**:

1. User clicks "Watch Now" on Payment.vue
2. Frontend calls `POST /payments/init` with amount, movie_id
3. Backend creates Payment record, returns Paystack authorization URL
4. User redirected to Paystack page
5. User completes payment
6. Paystack redirects to `/payment?reference=XXX`
7. Backend verifies payment and creates Subscription
8. Email confirmation sent via Brevo
9. User gains access to video

---

### 6. SMS Service (mNotify)

**Purpose**: Send transactional SMS (OTP codes for login/registration, SMS notifications)

**Configuration Variables**:

| Variable            | Purpose                        | Obtain From     |
| ------------------- | ------------------------------ | --------------- |
| `MNOTIFY_API_KEY`   | mNotify API authentication     | mNotify account |
| `MNOTIFY_SENDER_ID` | SMS sender name (alphanumeric) | mNotify account |

**Setup Instructions**:

1. **Create mNotify Account**: Visit https://mnotify.com
2. **Verify Business**: Complete verification
3. **Get API Key**:
    - Go to Dashboard → Settings → API Keys
    - Copy your API Key
4. **Set Sender ID**:
    - Go to Dashboard → Settings → Sender ID
    - Create alphanumeric sender ID (e.g., "PL Films")
    - Get it approved (24-48 hours)
5. **Update .env**:
    ```env
    MNOTIFY_API_KEY=Ya47b3CmOxLEhDNlv3aDduiI6
    MNOTIFY_SENDER_ID="PL Films"
    ```

**Used In**:

-   `app/Http/Controllers/Auth/OtpController.php` - OTP SMS for login/registration
-   `app/Services/BulkSmsService.php` - Bulk SMS sending
-   `config/mnotify.php` - Configuration

**OTP Flow**:

1. User enters phone on login/register page
2. Phone normalized to E.164 format: `+233XXXXXXXXX`
3. 6-digit OTP generated, stored in cache (5 min expiry)
4. SMS sent via mNotify with code
5. User receives SMS with code
6. User enters code in app
7. Code verified against cache
8. User authenticated or account created

**Rate Limiting**:

-   **OTP Send**: 3 attempts per 15 minutes per phone number
-   Prevents SMS spam and abuse

**Test SMS Sending**:

```bash
php artisan tinker
>>> $mnotify = new \Arhinful\LaravelMnotify\MNotify;
>>> $mnotify->setAPIKey(config('mnotify.api_key'));
>>> $mnotify->setSender(config('mnotify.sender_id'));
>>> $mnotify->sendQuickSMS(['+233244123456'], 'Test message');
```

---

### 7. Video Hosting & CDN (Bunny CDN)

**Purpose**: Host, stream, and deliver video content with global CDN distribution

**Configuration Variables**:

| Variable             | Purpose                | Obtain From   |
| -------------------- | ---------------------- | ------------- |
| `BUNNY_ACCESS_KEY`   | API access key         | Bunny account |
| `BUNNY_LIBRARY_ID`   | Video library ID       | Bunny account |
| `BUNNY_PULL_ZONE`    | CDN pull zone hostname | Bunny account |
| `BUNNY_STORAGE_ZONE` | Storage zone name      | Bunny account |

**Setup Instructions**:

1. **Create Bunny Account**: Visit https://bunny.net
2. **Create Video Library**:
    - Go to Video Library → Create New Library
    - Give it a name (e.g., "PL Films Videos")
    - Note the Library ID
3. **Get API Key**:
    - Go to Account → API
    - Create/copy your API key
4. **Set Up Pull Zone** (for streaming):
    - Go to Video Library → Settings
    - Create CDN Pull Zone
    - Note the hostname (e.g., `vz-1234abcd.b-cdn.net`)
5. **Set Up Storage Zone** (optional for uploads):
    - Go to Storage → Create Storage Zone
    - Note the zone name
6. **Update .env**:
    ```env
    BUNNY_ACCESS_KEY=8d09e384-570f-4636-a6a22025adf8-4115-4b6c
    BUNNY_LIBRARY_ID=552144
    BUNNY_PULL_ZONE=vz-6024b712-a89.b-cdn.net
    BUNNY_STORAGE_ZONE=plfilms-storage
    ```

**Used In**:

-   `app/Services/BunnyVideoService.php` - Video management API
-   `resources/js/components/VideoPlayer.vue` - Video playback
-   `database/seeders/DatabaseSeeder.php` - Seeding video URLs
-   Banner video URLs: `https://{BUNNY_PULL_ZONE}/{video_id}.mp4`

**Video Upload Workflow** (for future):

1. Upload video file to Bunny Storage Zone
2. Bunny transcodes to multiple formats/resolutions
3. Video assigned UUID (video ID)
4. Store video_url in Banner or Movie model
5. Serve from CDN pull zone for streaming

---

### 8. Authentication & Security

**Fortify Configuration** (uses defaults):

| Variable                          | Purpose                        | Default               | Notes                  |
| --------------------------------- | ------------------------------ | --------------------- | ---------------------- |
| `AUTH_GUARD`                      | Authentication guard           | web                   | web guard for sessions |
| `AUTH_PASSWORD_BROKER`            | Password broker                | users                 | Password reset tokens  |
| `AUTH_MODEL`                      | User model class               | App\Models\User       | Custom user model      |
| `AUTH_PASSWORD_RESET_TOKEN_TABLE` | Reset tokens table             | password_reset_tokens | Database table name    |
| `AUTH_PASSWORD_TIMEOUT`           | Reset token lifetime (seconds) | 10800                 | 3 hours                |

**2FA Security**:

-   Time-based One-Time Passwords (TOTP)
-   QR code generation for authenticator apps
-   Recovery codes backup (8 codes, 10 digits each)
-   Stored in `two_factor_auth` table

**Password Security**:

-   Bcrypt hashing with configurable rounds
-   `BCRYPT_ROUNDS=12` (default, more = slower but more secure)

---

### 9. Logging & Debugging

| Variable      | Purpose               | Default | Options                                                         |
| ------------- | --------------------- | ------- | --------------------------------------------------------------- |
| `LOG_CHANNEL` | Logging driver        | stack   | single, daily, stack, syslog, errorlog                          |
| `LOG_LEVEL`   | Minimum log level     | debug   | debug, info, notice, warning, error, critical, alert, emergency |
| `APP_DEBUG`   | Debug exceptions page | true    | true (dev), false (prod)                                        |

**Best Practices**:

-   Development: `LOG_LEVEL=debug`, `APP_DEBUG=true`
-   Production: `LOG_LEVEL=warning`, `APP_DEBUG=false`

---

## Configuration Files Reference

### Main Config Files

| File                  | Purpose              | Variables Used          |
| --------------------- | -------------------- | ----------------------- |
| `config/app.php`      | Core app settings    | APP*\*, LOG*\*          |
| `config/database.php` | Database connection  | DB\_\*                  |
| `config/mail.php`     | Email service        | MAIL\_\*                |
| `config/paystack.php` | Paystack payment     | PAYSTACK\_\*            |
| `config/mnotify.php`  | SMS service          | MNOTIFY\_\*             |
| `config/services.php` | Third-party services | BUNNY*\*, AWS*\*        |
| `config/session.php`  | Session handling     | SESSION\_\*             |
| `config/queue.php`    | Job queuing          | QUEUE\_\*               |
| `config/cache.php`    | Caching              | CACHE*\*, REDIS*\*      |
| `config/auth.php`     | Authentication       | AUTH\_\*                |
| `config/fortify.php`  | 2FA & authentication | (uses app.php AUTH\_\*) |

---

## Environment-Specific Configurations

### Local Development

```env
APP_ENV=local
APP_DEBUG=true
LOG_LEVEL=debug
DB_CONNECTION=sqlite
MAIL_MAILER=log
PAYSTACK_MODE=test
QUEUE_CONNECTION=sync
CACHE_STORE=file
```

### Staging

```env
APP_ENV=staging
APP_DEBUG=true
LOG_LEVEL=info
DB_CONNECTION=mysql
MAIL_MAILER=smtp
PAYSTACK_MODE=test
QUEUE_CONNECTION=database
CACHE_STORE=redis
APP_URL=https://staging.acrazydayinaccra.com
```

### Production

```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=warning
DB_CONNECTION=mysql
MAIL_MAILER=smtp
PAYSTACK_MODE=live
QUEUE_CONNECTION=redis
CACHE_STORE=redis
APP_URL=https://acrazydayinaccra.com
```

---

## Security Best Practices

### 🔒 Never Commit Secrets

1. **Always use .gitignore**:

    ```bash
    .env
    .env.local
    .env.*.php
    ```

2. **Never commit**:

    - API keys (Paystack, Brevo, mNotify, Bunny)
    - Secret keys (all XXXXX_SECRET_KEY)
    - Database passwords
    - SMTP passwords
    - APP_KEY (auto-generated per environment)

3. **Production Deployment**:
    - Set all environment variables on server
    - Use environment-specific secrets
    - Never copy `.env` file to production
    - Use managed secrets service (AWS Secrets Manager, HashiCorp Vault)

### ✅ Key Rotation Schedule

| Service            | Frequency | Impact                                    |
| ------------------ | --------- | ----------------------------------------- |
| Paystack Live Keys | Quarterly | Medium (requires webhook re-registration) |
| Brevo API Key      | Annually  | Low (can generate multiple keys)          |
| mNotify API Key    | Quarterly | Low (update .env only)                    |
| Database Password  | Quarterly | High (need backup plan)                   |
| SMTP Password      | Annually  | Low (can regenerate in Brevo)             |

---

## Troubleshooting

### Email Not Sending

1. **Check MAIL_MAILER setting**:

    ```bash
    php artisan config:cache
    ```

2. **Verify SMTP credentials**:

    ```bash
    php artisan tinker
    >>> config('mail.mailers.smtp')
    ```

3. **Test send**:
    ```bash
    php artisan mail:send --help
    ```

### OTP SMS Not Received

1. **Verify phone format**: Must be E.164 format (+233XXXXXXXXX)
2. **Check rate limit**: 3 sends per 15 minutes per phone
3. **Check mNotify balance**: Ensure account has credits
4. **Check API key**: Verify MNOTIFY_API_KEY is correct

### Payment Not Processing

1. **Verify Paystack keys**: Public key starts with `pk_`, Secret with `sk_`
2. **Check callback URL**: Must match PAYSTACK_CALLBACK_URL in .env
3. **Verify webhook**: Go to Paystack dashboard → Settings → Webhooks
4. **Check logs**: `tail -f storage/logs/laravel.log`

### Video Not Streaming

1. **Verify Bunny credentials**: BUNNY_ACCESS_KEY, BUNNY_LIBRARY_ID
2. **Check pull zone**: Video URL format: `https://{PULL_ZONE}/{video_id}.mp4`
3. **Check expiry**: Bunny URLs may have expiration set
4. **Test in browser**: Try URL directly in incognito mode

---

## Useful Commands

```bash
# View all configuration
php artisan config:show

# Clear all caches
php artisan optimize:clear

# Test specific config
php artisan config:cache
php artisan config:clear

# Generate APP_KEY
php artisan key:generate

# Run migrations with seed
php artisan migrate --seed

# List all environment variables
php artisan env

# Test database connection
php artisan db:show

# Monitor logs
tail -f storage/logs/laravel.log
```

---

## Summary Checklist

-   [ ] `.env.example` is up-to-date and committed to Git
-   [ ] `.env` file is in `.gitignore` and NOT committed
-   [ ] All API keys are stored in `.env` (not committed)
-   [ ] APP_KEY is generated with `php artisan key:generate`
-   [ ] Database is migrated: `php artisan migrate --seed`
-   [ ] All third-party services are configured
-   [ ] Email service is tested and working
-   [ ] Payment gateway is in test mode during development
-   [ ] SMS service is verified to send
-   [ ] Video CDN is accessible and streaming
-   [ ] Logs can be accessed: `tail -f storage/logs/laravel.log`
-   [ ] Sessions persist across requests
-   [ ] Cache is functional
-   [ ] Queue can process jobs

---

## Support

For issues with specific services, refer to:

-   **Paystack**: https://paystack.com/docs
-   **Brevo**: https://developers.brevo.com
-   **mNotify**: https://mnotify.com/docs
-   **Bunny**: https://docs.bunny.net
-   **Laravel**: https://laravel.com/docs
