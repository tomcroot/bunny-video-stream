# Security Testing Quick Reference

## 🔒 Testing Security Headers

### Check All Headers

```bash
curl -I https://crazyday.test/
```

### Expected Output

```
HTTP/2 200
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
content-security-policy: default-src 'self'; script-src ...
permissions-policy: accelerometer=(), camera=(), geolocation=(), ...
```

## 🚦 Testing Rate Limiting

### Test Login Rate Limit (5 per minute)

```bash
# Run this 6 times to trigger the limit
for i in {1..6}; do
  curl -X POST https://crazyday.test/login \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "email=test@test.com&password=wrong" \
    -i
done
# Response: 429 Too Many Requests (on 6th attempt)
```

### Test OTP Rate Limit (3 per hour)

```bash
# Run this 4 times to trigger the limit
for i in {1..4}; do
  curl -X POST https://crazyday.test/api/otp/send \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com"}' \
    -i
done
# Response: 429 Too Many Requests (on 4th attempt)
```

### Test Contact Form Rate Limit (3 per hour)

```bash
# Run this 4 times to trigger the limit
for i in {1..4}; do
  curl -X POST https://crazyday.test/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test"}' \
    -i
done
# Response: 429 Too Many Requests (on 4th attempt)
```

## 🧪 Testing CSP Compliance

### Check CSP Policy

```bash
curl -I https://crazyday.test/ | grep -i content-security-policy
```

### Verify No CSP Violations

Open browser DevTools → Console and look for CSP errors (should be none)

## 🛡️ Testing Error Pages

### Test 404 Page

```bash
curl https://crazyday.test/nonexistent
```

Expected: Custom 404 page with "Scene Not Found"

### Test 500 Page (simulate)

```bash
curl https://crazyday.test/admin  # If not authenticated
```

### Test 403 Page

```bash
curl https://crazyday.test/admin  # If user role (not admin)
```

## 🔐 Testing Authentication

### Test Email Verification

1. Register new account
2. Check email for verification link
3. Verify email and login
4. Attempt login without verification should show error

### Test OTP Authentication

1. Enter email at login page
2. Should receive OTP within 30 seconds
3. Test OTP rate limiting after 3 requests

## 💳 Testing Payment Security

### Verify HMAC Verification

```bash
# Check webhook handler logs
tail -f storage/logs/laravel.log | grep -i paystack
```

### Test Webhook

```bash
curl -X POST https://crazyday.test/webhooks/paystack \
  -H "Content-Type: application/json" \
  -H "X-Paystack-Signature: $(echo -n 'payload' | openssl dgst -sha512 -mac HMAC -macopt key:SECRET_KEY | sed 's/^.* //')" \
  -d '{"event":"charge.success","data":{"reference":"ref123"}}'
```

## 📊 Testing Performance

### Load Testing

```bash
# Using Apache Bench (ab)
ab -n 1000 -c 10 https://crazyday.test/

# Using wrk
wrk -t12 -c400 -d30s https://crazyday.test/
```

### Monitor Rate Limiting Under Load

```bash
# Run concurrent requests and count 429 responses
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://crazyday.test/api/contact \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test"}'
done | sort | uniq -c
```

## 🔍 Testing Specific Scenarios

### Test Admin Access Control

```bash
# As regular user
curl -H "Cookie: XSRF-TOKEN=token; laravel_session=sess123" \
  https://crazyday.test/admin

# Expected: 403 Forbidden or redirect to login
```

### Test Paid Content Access

```bash
# As user without payment
curl https://crazyday.test/paid-content

# Expected: 403 Forbidden or redirect to payment page
```

### Test SEO Elements

```bash
# Check meta tags
curl https://crazyday.test/ | grep -i '<meta'

# Check Open Graph tags
curl https://crazyday.test/ | grep -i 'og:'

# Check Twitter cards
curl https://crazyday.test/ | grep -i 'twitter:'

# Check schema.org
curl https://crazyday.test/ | grep -i 'schema.org'
```

### Test Sitemap

```bash
curl https://crazyday.test/sitemap.xml | head -20
```

## 📋 Browser Testing Checklist

-   [ ] Open browser DevTools Console - check for errors
-   [ ] Open DevTools Network - verify security headers present
-   [ ] Open DevTools Security tab - check certificate validity
-   [ ] Test Share buttons (Twitter, Facebook, LinkedIn)
-   [ ] Test video player on Watch page
-   [ ] Test form submissions (contact, reviews)
-   [ ] Test mobile responsiveness
-   [ ] Test dark/light mode toggle
-   [ ] Test login flow (email, password, OTP)
-   [ ] Test profile edit and password change
-   [ ] Test payment flow
-   [ ] Test admin dashboard (if admin user)

## 🐛 Debugging Rate Limits

### View Rate Limit Cache

```bash
# If using Redis (not applicable to this setup, but for reference)
redis-cli KEYS "rate-limit:*"
redis-cli GET "rate-limit:login:127.0.0.1"

# For file-based cache (current setup)
ls -la storage/framework/cache/
```

### Reset Rate Limits (Debug Only)

```bash
php artisan cache:clear
```

### Monitor Rate Limits in Real-time

```bash
# Watch Laravel logs for rate limit events
tail -f storage/logs/laravel.log | grep -i "rate\|429\|limit"
```

## 🚨 Security Scanning Tools

### Using Online Tools

-   OWASP ZAP: https://www.zaproxy.org/
-   Burp Suite Community: https://portswigger.net/burp/communitydownload
-   SSL Labs: https://www.ssllabs.com/ssltest/

### Using CLI Tools

```bash
# OWASP ZAP command line
zaproxy.sh -cmd -quickurl https://crazyday.test/ -quickout report.html

# nmap security scan
nmap -A https://crazyday.test

# nikto web server scan
nikto -h https://crazyday.test
```

## 📝 Logging Security Events

### View Auth Attempts

```bash
tail -f storage/logs/laravel.log | grep -i "unauthorized\|unauthenticated\|forbidden"
```

### View Payment Events

```bash
tail -f storage/logs/laravel.log | grep -i "paystack\|payment"
```

### View Rate Limit Events

```bash
tail -f storage/logs/laravel.log | grep -i "too many\|rate"
```

## ✅ Pre-Launch Security Checklist

-   [ ] All security headers present and correct
-   [ ] Rate limiting working on sensitive endpoints
-   [ ] HTTPS/SSL certificate valid
-   [ ] Database credentials not exposed in logs
-   [ ] API keys not exposed in repository
-   [ ] Error messages don't leak sensitive info
-   [ ] CORS properly configured
-   [ ] CSRF protection enabled
-   [ ] Password reset tokens expire correctly
-   [ ] Payment webhook signatures verified
-   [ ] Email verification working
-   [ ] Admin routes require authentication
-   [ ] File uploads restricted and validated
-   [ ] Input validation on all forms
-   [ ] Output escaping in templates
-   [ ] No debug mode in production
-   [ ] Logs rotated and retained
-   [ ] Backups automated and tested

---

**Remember**: Security is an ongoing process. Regularly update dependencies, monitor logs, and stay informed about new vulnerabilities.
