# Two-Factor Authentication (2FA) Implementation Guide

## Overview

Two-Factor Authentication (2FA) in Promise Films adds an extra security layer using Time-based One-Time Passwords (TOTP). Users can optionally enable 2FA on their accounts, and when enabled, it will be required after password/OTP login verification.

## Architecture

### 2FA Flow in Login Process

```
User Login
    ↓
[Email/Phone + Password] OR [Phone + OTP]
    ↓
Credentials Verified
    ↓
Is 2FA Enabled?
    ├─ NO → Login Complete (Home)
    └─ YES → Display 2FA Challenge
              ↓
         [Enter TOTP Code OR Recovery Code]
              ↓
         Code Verified?
         ├─ YES → Login Complete (Home)
         └─ NO → Show Error, Try Again
```

## Components

### 1. **User Model** (`app/Models/User.php`)
- Uses `TwoFactorAuthenticatable` trait from Fortify
- Provides methods:
  - `two_factor_secret`: Stores encrypted TOTP secret
  - `two_factor_recovery_codes`: Backup recovery codes
  - `recoveryCodes()`: Parse and format recovery codes

### 2. **2FA Settings Page** (`Account/TwoFactorSettings.vue`)
Location: `/account/two-factor`

**Features:**
- Display 2FA status
- Enable 2FA button → Shows QR code + manual secret
- Confirm code entry (6-digit from authenticator)
- Display recovery codes after enabling
- Disable 2FA button (with confirmation)
- Copy recovery codes button

**States:**
- Disabled: Show "Enable Two-Factor Auth" button
- Setup: Show QR code, secret key, code confirmation
- Enabled: Show recovery codes, "Disable" button

### 3. **Login Challenge Page** (`Auth/TwoFactorChallenge.vue`)
Location: `/two-factor-challenge` (shown when 2FA enabled after login)

**Features:**
- Tab interface: "Authenticator" | "Recovery Code"
- Authenticator tab: Enter 6-digit TOTP code
- Recovery Code tab: Enter recovery code (for lost authenticator)
- Form submission to `/two-factor-challenge`

### 4. **Controller** (`TwoFactorAuthenticationController.php`)

**Endpoints:**
- `GET /account/two-factor` → Show 2FA settings page
- `POST /user/two-factor-authentication` → Generate QR + secret
- `POST /user/confirmed-two-factor-authentication` → Confirm code & enable 2FA
- `DELETE /user/two-factor-authentication` → Disable 2FA

**Methods:**
- `show()`: Display 2FA settings with current status
- `store()`: Generate QR code and secret using Fortify provider
- `confirm()`: Verify code and confirm 2FA (uses Fortify action)
- `destroy()`: Disable 2FA (uses Fortify action)

## Integration with Existing Auth

### Login Paths

**Path 1: Email + Password Login**
```
/login (POST)
  → Fortify verifies email+password
  → If 2FA enabled → redirect to /two-factor-challenge
  → User enters TOTP code
  → Fortify verifies & completes login
```

**Path 2: Phone + OTP Login**
```
/otp/send (POST)
  → Send SMS with OTP
/otp/verify (POST)
  → Verify OTP, auto-login user
  → If 2FA enabled → redirect to /two-factor-challenge
  → User enters TOTP code
```

**Path 3: Phone + Password Login**
```
/login (POST with phone)
  → Custom authenticator verifies phone+password
  → If 2FA enabled → redirect to /two-factor-challenge
  → User enters TOTP code
```

### Fortify Configuration

File: `config/fortify.php`

```php
'features' => [
    // ...
    Features::twoFactorAuthentication([
        'confirm' => true,              // Require password before enabling 2FA
        'confirmPassword' => true,      // Use password confirmation
    ]),
]
```

## How to Use 2FA

### For Users

**Enable 2FA:**
1. Log in to account
2. Go to `/account/two-factor`
3. Click "Enable Two-Factor Auth"
4. Scan QR code with authenticator app (Google Authenticator, Authy, Microsoft Authenticator)
5. Enter 6-digit code from app
6. **Save recovery codes** in safe location
7. 2FA is now active

**Login with 2FA:**
1. Enter email/phone + password (or use OTP login)
2. At 2FA challenge screen, enter 6-digit code from authenticator
3. Click "Confirm"
4. Login complete

**If Lost Authenticator:**
1. At 2FA challenge screen
2. Click "Recovery Code" tab
3. Enter one of your saved recovery codes
4. 2FA challenge complete
5. (Regenerate new authenticator app after login)

**Disable 2FA:**
1. Go to `/account/two-factor`
2. Click "Disable Two-Factor Auth"
3. Confirm action
4. 2FA disabled

### For Developers

**Checking if User Has 2FA:**
```php
if ($user->two_factor_secret) {
    // User has 2FA enabled
}
```

**Requiring 2FA for Specific Routes:**
```php
Route::middleware(['auth', 'verified.2fa'])->group(function () {
    // Routes that require 2FA
});
```

**Programmatically Enabling 2FA:**
```php
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;

$provider = app(TwoFactorAuthenticationProvider::class);
$secret = $provider->generate($user);
// ... user confirms code
$user->forceFill([
    'two_factor_secret' => encrypt($secret),
    'two_factor_recovery_codes' => json_encode([...]),
])->save();
```

## Security Considerations

1. **TOTP Standard**: Uses HMAC-SHA1 based time-based OTP (RFC 6238)
2. **Recovery Codes**: 8 alphanumeric codes, single-use, cannot be regenerated (user must disable & re-enable 2FA)
3. **Rate Limiting**: Fortify rate-limits 2FA attempts to 5 per minute
4. **Secret Storage**: TOTP secret is encrypted in database
5. **No Backup Codes**: Unlike some systems, recovery codes are exhaustible

## Testing 2FA

### Using TOTP Codes

**Option 1: Authenticator Apps**
- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Any TOTP-compatible app

**Option 2: Command Line (Testing)**
```bash
# Generate TOTP code from secret
php artisan tinker
> use OTPHP\TOTP;
> $totp = TOTP::create('SECRET_KEY_HERE');
> $totp->now()  // Returns current 6-digit code
```

### Database Testing
```sql
-- Check user 2FA status
SELECT id, email, two_factor_secret, two_factor_recovery_codes 
FROM users 
WHERE id = 1;

-- Disable 2FA for testing
UPDATE users 
SET two_factor_secret = NULL, two_factor_recovery_codes = NULL 
WHERE id = 1;
```

## Common Issues & Troubleshooting

**Issue: QR code not displaying**
- Ensure `laravel/fortify` package is installed
- Check browser console for JavaScript errors
- Verify Inertia rendering is working

**Issue: TOTP code not validating**
- Check device time is synchronized (TOTP is time-based)
- User may be entering code too slowly (codes expire every 30s)
- Secret key may have been entered incorrectly

**Issue: Recovery codes not working**
- Each recovery code can only be used once
- Codes are stored as JSON in database (encrypted)
- If exhausted, user must disable & re-enable 2FA

**Issue: User locked out**
- User can use recovery code to bypass authenticator
- If no recovery codes left, disable 2FA via database or admin
- Send recovery codes via secure channel to user

## Future Enhancements

1. **WebAuthn/FIDO2 Support**: Hardware security key authentication
2. **SMS 2FA Option**: Use existing SMS infrastructure for backup
3. **Remember Device**: Option to skip 2FA on trusted devices (30 days)
4. **2FA Enforcement Policy**: Require 2FA for admin accounts
5. **Audit Log**: Track 2FA enable/disable/challenge events
6. **Backup Codes**: Generate new unlimited backup codes

## Related Files

- `config/fortify.php`: 2FA configuration
- `app/Models/User.php`: User model with 2FA trait
- `app/Http/Controllers/TwoFactorAuthenticationController.php`: 2FA management
- `resources/js/Pages/Account/TwoFactorSettings.vue`: Settings UI
- `resources/js/Pages/Auth/TwoFactorChallenge.vue`: Login challenge UI
- `database/migrations/*_add_two_factor_columns_to_users_table.php`: Schema
