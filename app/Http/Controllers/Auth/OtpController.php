<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailService;
use Hofmannsven\Brevo\Facades\Brevo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;

class OtpController extends Controller
{
    /**
     * Normalize phone number to E.164
     */
    protected function normalizePhone(string $raw): string
    {
        $phone = preg_replace('/[^0-9+]/', '', $raw);

        try {
            if (class_exists(PhoneNumberUtil::class)) {
                $phoneUtil = PhoneNumberUtil::getInstance();

                $numberProto = Str::startsWith($phone, '+')
                    ? $phoneUtil->parse($phone, null)
                    : $phoneUtil->parse($phone, 'GH');

                if (! $phoneUtil->isValidNumber($numberProto)) {
                    throw new \Exception('Invalid phone');
                }

                return $phoneUtil->format($numberProto, PhoneNumberFormat::E164);
            }
        } catch (\Throwable $e) {
            Log::warning('libphonenumber failed, falling back', ['phone' => $raw]);
        }

        if (Str::startsWith($phone, '0')) {
            return '+233'.preg_replace('/^0+/', '', $phone);
        }

        if (preg_match('/^233[0-9]+$/', $phone)) {
            return '+'.$phone;
        }

        return $phone;
    }

    /**
     * Send OTP for registration
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $phone = $this->normalizePhone($validated['phone_number']);

        // Check uniqueness
        if (User::where('phone_number', $phone)->exists()) {
            return redirect()->back()->withErrors(['phone_number' => 'This phone number is already registered.']);
        }

        if ($validated['email'] && User::where('email', $validated['email'])->exists()) {
            return redirect()->back()->withErrors(['email' => 'This email is already registered.']);
        }

        $otpKey = $phone;
        $limitKey = 'otp-send:'.$otpKey;

        if (RateLimiter::tooManyAttempts($limitKey, 3)) {
            return redirect()->back()
                ->withErrors(['phone_number' => 'Too many OTP requests. Try again shortly.']);
        }

        $code = random_int(100000, 999999);
        Cache::put('otp:'.$otpKey, [
            'code' => $code,
            'name' => $validated['name'],
            'password' => $validated['password'],
            'phone' => $phone,
            'email' => $validated['email'],
        ], now()->addMinutes(10));

        $smsSent = false;
        try {
            // Send OTP via SMS (required for account creation)
            $mnotify = new \Arhinful\LaravelMnotify\MNotify;
            $mnotify->setAPIKey(config('mnotify.api_key'));
            $mnotify->setSender(config('mnotify.sender_id'));

            $smsMessage = "Your Promise Land Films verification code: {$code}";
            $mnotify->sendQuickSMS([$phone], $smsMessage);
            $smsSent = true;
        } catch (\Throwable $e) {
            Log::error('OTP SMS send failed', ['identifier' => $phone, 'error' => $e->getMessage()]);
        }

        $emailSent = false;
        if ($validated['email']) {
            try {
                Brevo::sendEmail([
                    'sender' => [
                        'email' => config('mail.from.address'),
                        'name' => config('mail.from.name', 'Promise Land Films'),
                    ],
                    'to' => [[
                        'email' => $validated['email'],
                        'name' => $validated['name'],
                    ]],
                    'subject' => 'Your Promise Films verification code',
                    'htmlContent' => "<p>Your verification code is: <strong>{$code}</strong></p><p>This code expires in 10 minutes.</p>",
                ]);
                $emailSent = true;
            } catch (\Throwable $e) {
                Log::warning('OTP email send failed', ['email' => $validated['email'], 'error' => $e->getMessage()]);
            }
        }

        if (! $smsSent && ! $emailSent) {
            return redirect()->back()
                ->withErrors(['phone_number' => 'Failed to send verification code. Try again.']);
        }

        RateLimiter::hit($limitKey, 900);

        return redirect()->back()->with('success', $smsSent ? 'Verification code sent via SMS.' : 'Verification code sent via email.');
    }

    /**
     * Send OTP for password reset
     */
    public function sendPasswordReset(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
        ]);

        $phone = $this->normalizePhone($validated['phone']);

        $user = User::where('phone_number', $phone)
            ->orWhere('email', $validated['phone'])
            ->first();

        if (! $user) {
            return redirect()->back()
                ->withErrors(['phone' => 'No account found with this phone number or email.']);
        }

        $limitKey = 'otp-reset:'.$phone;

        if (RateLimiter::tooManyAttempts($limitKey, 3)) {
            return redirect()->back()
                ->withErrors(['phone' => 'Too many reset requests. Try again shortly.']);
        }

        $code = random_int(100000, 999999);
        Cache::put('otp-reset:'.$phone, $code, now()->addMinutes(10));

        try {
            $mnotify = new \Arhinful\LaravelMnotify\MNotify;
            $mnotify->setAPIKey(config('mnotify.api_key'));
            $mnotify->setSender(config('mnotify.sender_id'));

            $message = "Your Promise Films password reset code: {$code}";
            $mnotify->sendQuickSMS([$phone], $message);

            RateLimiter::hit($limitKey, 900);
        } catch (\Throwable $e) {
            Log::error('Password reset OTP send failed', ['phone' => $phone, 'error' => $e->getMessage()]);

            return redirect()->back()
                ->withErrors(['phone' => 'Failed to send reset code. Try again.']);
        }

        return redirect()->back()->with('success', 'Password reset code sent successfully.');
    }

    /**
     * Verify OTP + complete registration
     */
    public function verifyRegister(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'email' => ['nullable', 'email', 'max:255'],
            'code' => ['required', 'string'],
        ]);

        $otpKey = $this->normalizePhone($validated['phone']);

        $cached = Cache::get('otp:'.$otpKey);

        if (! $cached || ! is_array($cached)) {
            return redirect()->back()
                ->withErrors(['code' => 'OTP session expired. Please start over.']);
        }

        if ((string) $cached['code'] !== (string) $validated['code']) {
            return redirect()->back()
                ->withErrors(['code' => 'Invalid verification code.']);
        }

        // Create user with cached data
        $email = $cached['email'] ?: (preg_replace('/[^0-9]/', '', $cached['phone']).'@promiselandfilms.local');

        // Check if user already exists (handle edge case where user was created between initial check and OTP verification)
        $user = User::where('phone_number', $cached['phone'])->first();

        if (! $user) {
            // Double-check email uniqueness before creating
            if (User::where('email', $email)->exists()) {
                Cache::forget('otp:'.$otpKey);

                return redirect()->back()
                    ->withErrors(['email' => 'This email is already registered. Please use a different email or login.']);
            }

            $user = User::create([
                'name' => $cached['name'],
                'email' => $email,
                'phone_number' => $cached['phone'],
                'password' => Hash::make($cached['password']),
            ]);

            // Send welcome email only for newly created users
            try {
                if (app()->bound(EmailService::class)) {
                    app(EmailService::class)->sendWelcomeEmail($user);
                }
            } catch (\Throwable $e) {
                Log::warning('Welcome email failed', ['user_id' => $user->id]);
            }

            // Send email verification link after successful SMS OTP verification
            try {
                if ($user->hasVerifiedEmail() === false) {
                    $user->notify(new \App\Notifications\VerifyEmailNotification);
                    Log::info('Email verification sent after SMS OTP', ['user_id' => $user->id, 'email' => $user->email]);
                }
            } catch (\Throwable $e) {
                Log::warning('Email verification notification failed', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            }
        }

        Auth::login($user, true); // Remember user for 30 days
        Cache::forget('otp:'.$otpKey);

        return redirect()->route('payment.checkout')
            ->with('success', 'Account created successfully! Please complete your payment to access the movie.');
    }
}
