# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Updated

-   **Video URLs - Bunny CDN (HLS Streaming)**:
    -   Updated banner seeder with Bunny CDN HLS playlist URLs
    -   Trailer: `https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/playlist.m3u8` (HLS format)
    -   Main Movie: `https://vz-6024b712-a89.b-cdn.net/41d7b1aa-fca0-49dd-bb64-ad881d0a4ff6/playlist.m3u8` (HLS format)
    -   Thumbnail: `https://vz-6024b712-a89.b-cdn.net/643d70e3-19ee-4ae9-a2c9-ec20bf5742d9/thumbnail_d5a0c8c0.jpg` (JPEG image)
    -   HLS format provides adaptive bitrate streaming for optimal video delivery
    -   Thumbnail now uses Bunny CDN instead of Unsplash placeholder

### Added

-   **Two-Factor Authentication (2FA) Management**: Complete TOTP-based 2FA system

    -   New page: `Account/TwoFactorSettings.vue` for enabling/disabling 2FA
    -   QR code generation for authenticator app setup (Google Authenticator, Authy, Microsoft Authenticator, etc.)
    -   Manual secret key entry as fallback
    -   Recovery codes display and copy functionality
    -   New controller: `TwoFactorAuthenticationController` for managing 2FA lifecycle
    -   Routes: `/account/two-factor` (settings), `/user/two-factor-authentication` (enable/disable), `/user/confirmed-two-factor-authentication` (confirm)
    -   User model now includes `TwoFactorAuthenticatable` trait from Fortify
    -   Fortify 2FA already configured in config/fortify.php

-   **Enhanced 2FA Login Challenge**: Improved `TwoFactorChallenge.vue` component

    -   Tab-based interface for Authenticator Code or Recovery Code
    -   Recovery code entry option for users who lost authenticator access
    -   Better UX with clear instructions and validation feedback

-   **OTP-Based Registration**: Users can now register with Name + Phone + Password

    -   Step 1: Enter name, phone, password, and click "Send Verification Code"
    -   Step 2: Receive 6-digit OTP via SMS and enter to complete registration
    -   Creates user account with provided password (not random)
    -   New endpoint: `POST /otp/verify-register`

-   **Phone+Password Login Support**: Users can login with either:

    -   Email + Password
    -   Phone Number + Password
    -   Phone + OTP (existing flow, auto-login)
    -   Fortify authenticator customized to accept phone or email as username field
    -   Phone numbers normalized automatically (0XXXXXXXXX → +233XXXXXXXXX)

-   **Subscription Model**: Created `Subscription` model with 365-day expiry tracking for video access

    -   Fields: `user_id`, `movie_id`, `payment_id`, `expires_at`
    -   Relationships: user(), movie(), payment()
    -   Method: isActive() to check if subscription hasn't expired
    -   Migration: `2025_12_05_212844_create_subscriptions_table`

-   **Payment Success Email**: Created `PaymentSuccessEmail` Mailable class

    -   Queued email for async delivery
    -   Includes payment details, movie info, access expiry date
    -   Template: `resources/views/emails/payment-success.blade.php`

-   **Streamer Dashboard**: Created `Streamer/Dashboard.vue` component

    -   Authenticated user home page with profile stats
    -   Featured content grid (up to 6 active banners)
    -   Quick access links to settings and watch history

-   **Payment Checkout Page**: Created `Payment.vue` component

    -   Guest/auth payment form for video access
    -   Payment method selection (card/mobile money)
    -   Coupon code framework (ready for expansion)
    -   Paystack payment integration

-   **StreamerDashboardController**: New controller for dashboard data

    -   Fetches user info and featured banners
    -   Route: `GET /dashboard`

-   **User Relationships**: Added to `User` model
    -   `subscriptions()` relationship
    -   `hasActiveSubscription($movieId)` method to check video access

### Modified

-   **Register.vue**: Complete redesign for OTP-based registration

    -   Two-step process: Form input → OTP verification
    -   Simple and direct UI with clear feedback
    -   Supports optional email field

-   **Login.vue**: Simplified login form

    -   Single "Email or Phone" input field (accepts both)
    -   OTP option moved to primary flow with tab
    -   Password option as secondary with "Or log in with password" divider

-   **FortifyServiceProvider**: Custom authenticator for phone+password support

    -   `Fortify::authenticateUsing()` callback checks if input is email or phone
    -   Automatically normalizes phone numbers
    -   Falls back to standard password verification

-   **OtpController**: Added new `verifyRegister()` method

    -   Validates OTP and user input together
    -   Creates user with provided name and password
    -   Checks for duplicate phone/email before creation

-   **PaymentController**: Updated `webhook()` method

    -   Now creates `Subscription` record on successful payment with 365-day expiry
    -   Dispatches `PaymentSuccessEmail` to user after payment success
    -   Added error logging for email failures
        -   Imports: Added `PaymentSuccessEmail`, `Subscription`, `Mail`, `Log` facades

-   **Routes**: Disabled SMS/Email admin bulk pages

    -   Commented out SMS/Email route groups
    -   Added note: "SMS & Email routes disabled - automated emails/SMS triggered on payment events instead"
    -   Added new routes: `/dashboard` (StreamerDashboardController), `/payment/checkout` (Payment.vue)

-   **Admin Dashboard** (`resources/js/Pages/Admin/Dashboard.vue`):
    -   Removed SMS management card from grid
    -   Removed Email management card from grid
    -   Removed SMS navbar link
    -   Removed Email navbar link
    -   Retained: Banners, Cast & Crew, Gallery, Reviews, Content management

### Database

-   Migration created: `create_subscriptions_table`
    -   Fields: id, user_id (FK), movie_id (FK), payment_id (FK nullable), expires_at, timestamps
    -   Indexes: expires_at (searchable for active checks)
    -   Constraints: Unique (user_id, movie_id), cascading deletes

### Fixed

-   **OtpController Syntax Error**: Fixed missing closing brace for class (line 219)

    -   Error: `ParseError: Unclosed '{' on line 17`
    -   Caused 500 errors on `/otp/send` endpoint
    -   Required PHP-FPM restart to clear OPcache
    -   Verified brace matching: 34 opening, 34 closing

-   **Login.vue Error Handling**: Improved OTP flow error messages

    -   Added client-side phone validation (9-12 digits)
    -   Better error messages for user feedback
    -   Changed OTP validation from 4+ to full 6 digits required
    -   Added console logging for debugging
    -   Added success message with delay before redirect

-   **Logout Functionality**: Added logout button to PublicLayout

    -   Logout button appears in navbar when authenticated
    -   Dashboard link added for logged-in users
    -   Form submits to `/logout` with CSRF protection
    -   Uses Fortify's built-in logout route

-   **Video/Banner UUID Route**: Added fallback route for video ID redirects
    -   Route: `GET /{id}` where id is UUID or numeric
    -   Automatically redirects to `/watch` page
    -   Handles video IDs from banners (e.g., Bunny CDN video IDs)
    -   Pattern: `[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}` or numeric IDs

### Build Status

-   ✓ `npm run build` passing (3057 modules, no errors)
-   ✓ All Vue components compiling correctly
-   ✓ No undefined prop warnings or console errors

### Architecture Changes

-   **Event-Driven Email**: Replaced manual SMS/Email admin pages with automated payment success trigger
-   **Subscription Model**: 365-day video access tied to Payment record
-   **Access Control**: Video access now checked via Subscription expiry instead of Payment status alone

### Configuration

-   **mNotify SMS Service**: Configured with API credentials in `.env`
    -   `MNOTIFY_API_KEY` - API authentication key
    -   `MNOTIFY_SENDER_ID` - SMS sender display name ("PL Films")
-   **Rate Limiting**:
    -   OTP send: 3 attempts per 15 minutes per phone number
    -   2FA login: 5 attempts per minute per user
-   **OTP Expiry**: 5 minutes cache storage
-   **Subscription Duration**: 365 days per payment

### Testing Guide

**OTP Login:**

1. Navigate to `/login`
2. Enter phone: `0244123456` or `+233244123456`
3. Click "Send OTP" → Check SMS for 6-digit code
4. Enter code → Click "Verify" → Logged in

**Password Login:**

1. Navigate to `/login`
2. Enter email or phone + password
3. Click "Log in" → Logged in

**Registration:**

1. Navigate to `/register`
2. Fill: Name, Phone, Email (optional), Password
3. Click "Next" → Check SMS for OTP
4. Enter code → Click "Verify & Register" → Account created + logged in

**2FA Setup:**

1. Login → Navigate to `/account/two-factor`
2. Click "Enable Two-Factor Authentication"
3. Scan QR code with authenticator app
4. Enter TOTP code to confirm
5. Save recovery codes
6. Logout and login again → 2FA challenge appears

**Logout:**

1. Click "Logout" button in navbar (when logged in)
2. Redirected to home page as guest

### Known Issues

-   **OPcache Persistence**: After fixing syntax errors in controllers, may require `brew services restart php` to clear OPcache
-   **CSRF Protection**: All OTP endpoints require CSRF token from web middleware
-   **Rate Limiting**: After 3 OTP attempts in 15 minutes, users must wait before requesting new codes

### Debugging Notes

-   **Payment Callback Flow**:
    -   Paystack redirects to `GET /payment?reference=...&trxref=...` after payment
    -   Route handler: `PaymentController@callback`
    -   Callback verifies payment status and redirects to home with status message
    -   If redirect appears to 404, check: domain name (typos like "creazyday.test" vs "crazyday.test"), DNS resolution, and APP_URL in .env
    -   PAYSTACK_CALLBACK_URL defaults to `{APP_URL}/payment`

### Environment Configuration Audit

-   **Updated `.env.example`**: From 81 to 142 lines with comprehensive service documentation

    -   Added all missing environment variables: BREVO_API_KEY, complete mNotify config, complete Paystack/Bunny details
    -   Organized into logical sections: Core App, Database, Session/Cache, Email, Payments, SMS, Video CDN, Authentication
    -   Added placeholder values and reference links for obtaining credentials from each service
    -   Includes inline documentation explaining each service's purpose and required setup

-   **Created Documentation**:

    -   `docs/ENVIRONMENT_CONFIGURATION.md` (1,200+ lines)
        -   Comprehensive guide to all environment variables
        -   Step-by-step setup for each service (Brevo, Paystack, mNotify, Bunny CDN, Fortify)
        -   Local vs Staging vs Production environment configurations
        -   Troubleshooting section for common issues
        -   Useful command reference
    -   `docs/DEPLOYMENT_ENV_CHECKLIST.md` (400+ lines)
        -   Pre-deployment verification checklist for each service
        -   Required vs optional variables table
        -   Common issues and solutions
        -   Post-deployment verification steps
        -   Version control rules (.gitignore compliance)

-   **Verified Architecture**:

    -   ✓ All config files use `env()` with sensible defaults
    -   ✓ All app code uses `config()` indirection (no hardcoded secrets)
    -   ✓ No secrets committed to Git (`.gitignore` properly configured for `.env`)
    -   ✓ Service integrations: Paystack (payments), Brevo (email), mNotify (SMS), Bunny CDN (video), Fortify (auth)
    -   ✓ Production-ready configuration structure with clear separation of concerns

-   **Security Best Practices**:
    -   Documented key rotation schedule for all services
    -   Verified secrets never hardcoded in application code
    -   Verified `.env` excluded from version control
    -   Added production vs development environment differences
    -   Documented API key management and rotation procedures
