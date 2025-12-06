# Security Enhancements

This document outlines the security measures implemented in the CrazyDay application.

## 1. Security Headers Middleware (`app/Http/Middleware/SecurityHeaders.php`)

Adds essential HTTP security headers to all responses:

-   **X-Frame-Options: SAMEORIGIN** - Prevents clickjacking by restricting frame embedding
-   **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing attacks
-   **X-XSS-Protection: 1; mode=block** - Enables browser XSS protection
-   **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
-   **Content-Security-Policy (CSP)** - Restricts resource loading:

    -   Scripts: Self + unsafe-inline/eval (required for Vue) + CDN
    -   Styles: Self + unsafe-inline + Bunny Fonts
    -   Fonts: Bunny Fonts
    -   Images: Self + HTTPS + data URIs
    -   Media: Self + HTTPS (for HLS videos)
    -   Connections: Self + HTTPS

-   **Permissions-Policy** - Disables unused browser APIs:
    -   accelerometer, camera, geolocation, gyroscope, magnetometer, microphone, payment, usb

## 2. Rate Limiting Middleware (`app/Http/Middleware/RateLimitSensitiveEndpoints.php`)

Protects sensitive endpoints from abuse:

### Login Attempts

-   **5 requests per minute per IP**
-   Returns 429 (Too Many Requests) when exceeded

### Contact Form

-   **3 requests per hour per IP**
-   Prevents spam submissions

### Review Submissions

-   **5 requests per hour per user**
-   Rate limited by authenticated user ID

### OTP Requests

-   **3 requests per hour per email**
-   Prevents brute-force OTP attacks

## 3. Other Security Measures

### Existing Implementations

-   **Email Verification**: Users must verify email before account access
-   **Admin Middleware**: Protects admin routes with role-based access
-   **Paid Middleware**: Restricts content access to paying users
-   **HMAC-SHA512 Webhook Verification**: Validates Paystack payments
-   **Database Encryption**: SQLite with configuration-based encryption support

### Recommended Next Steps

-   Implement CAPTCHA on contact form and login page
-   Add IP whitelisting for admin panel
-   Enable database encryption in production
-   Implement session timeout policies
-   Add suspicious activity logging and alerting
-   Regular security audits and dependency updates

## Configuration

The middleware is automatically applied to all web requests through the bootstrap middleware configuration in `bootstrap/app.php`:

```php
$middleware->web(append: [
    \App\Http\Middleware\SecurityHeaders::class,
    \App\Http\Middleware\RateLimitSensitiveEndpoints::class,
    \App\Http\Middleware\HandleInertiaRequests::class,
]);
```

## Testing Security Headers

Visit any page and check response headers:

```bash
curl -I https://crazyday.test/
```

Expected headers should include:

-   X-Frame-Options
-   X-Content-Type-Options
-   X-XSS-Protection
-   Referrer-Policy
-   Content-Security-Policy
-   Permissions-Policy
