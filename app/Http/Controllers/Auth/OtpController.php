<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendOtpEmailJob;
use App\Jobs\SendOtpSmsJob;
use App\Jobs\SendWelcomeEmailJob;
use App\Models\User;
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

        // Dispatch SMS job (non-blocking)
        $smsMessage = "Your Promise Land Films verification code: {$code}";
        SendOtpSmsJob::dispatch($phone, $smsMessage)->onQueue('otp');

        // Dispatch email job if email provided (non-blocking)
        if ($validated['email']) {
            SendOtpEmailJob::dispatch($validated['email'], $validated['name'], (string) $code)->onQueue('otp');
        }

        RateLimiter::hit($limitKey, 900);

        Log::info('OTP jobs dispatched', [
            'phone' => $phone,
            'email' => $validated['email'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Verification code sent. Please check your SMS'.($validated['email'] ? ' and email.' : '.'));
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

        // Dispatch SMS job (non-blocking)
        $message = "Your Promise Films password reset code: {$code}";
        SendOtpSmsJob::dispatch($phone, $message)->onQueue('otp');

        RateLimiter::hit($limitKey, 900);

        Log::info('Password reset OTP job dispatched', ['phone' => $phone]);

        return redirect()->back()->with('success', 'Password reset code sent. Please check your SMS.');
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

            // Dispatch welcome email job (non-blocking)
            SendWelcomeEmailJob::dispatch($user->id)->onQueue('emails');

            // Send email verification link after successful SMS OTP verification (already queued via notification)
            try {
                if ($user->hasVerifiedEmail() === false) {
                    $user->notify(new \App\Notifications\VerifyEmailNotification);
                    Log::info('Email verification queued after SMS OTP', ['user_id' => $user->id, 'email' => $user->email]);
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
