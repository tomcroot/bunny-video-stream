<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailService;
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
     * Send OTP
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
        ]);

        $phone = $this->normalizePhone($validated['phone']);

        $limitKey = 'otp-send:'.$phone;

        if (RateLimiter::tooManyAttempts($limitKey, 3)) {
            return redirect()->back()
                ->withErrors(['phone' => 'Too many OTP requests. Try again shortly.']);
        }

        $code = random_int(100000, 999999);

        Cache::put('otp:'.$phone, $code, now()->addMinutes(5));

        try {
            $mnotify = new \Arhinful\LaravelMnotify\MNotify;
            $mnotify->setAPIKey(config('mnotify.api_key'));
            $mnotify->setSender(config('mnotify.sender_id'));

            $message = "Your Promise Films login code: {$code}";
            $mnotify->sendQuickSMS([$phone], $message);

            RateLimiter::hit($limitKey, 900);
        } catch (\Throwable $e) {
            Log::error('OTP send failed', ['phone' => $phone, 'error' => $e->getMessage()]);

            return redirect()->back()
                ->withErrors(['phone' => 'Failed to send OTP. Try again.']);
        }

        return redirect()->back()->with('success', 'OTP sent successfully.');
    }

    /**
     * Verify OTP and login (auto-create if needed)
     */
    public function verify(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);

        $phone = $this->normalizePhone($validated['phone']);
        $cached = Cache::get('otp:'.$phone);

        if (! $cached || (string) $cached !== (string) $validated['code']) {
            return redirect()->back()
                ->withErrors(['code' => 'Invalid or expired OTP.']);
        }

        $user = User::where('phone_number', $phone)->first();

        if (! $user) {
            $fakeEmail = preg_replace('/[^0-9]/', '', $phone).'@promiselandfilms.local';

            $user = User::create([
                'name' => $phone,
                'email' => $fakeEmail,
                'password' => Str::random(40),
                'phone_number' => $phone,
            ]);

            try {
                if (app()->bound(EmailService::class)) {
                    app(EmailService::class)->sendWelcomeEmail($user);
                }
            } catch (\Throwable $e) {
                Log::warning('Welcome email failed', ['user_id' => $user->id]);
            }
        }

        Auth::login($user);
        Cache::forget('otp:'.$phone);

        return redirect()->intended('/dashboard');
    }

    /**
     * Verify OTP + full user registration
     */
    public function verifyRegister(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $phone = $this->normalizePhone($validated['phone']);
        $cached = Cache::get('otp:'.$phone);

        if (! $cached || (string) $cached !== (string) $validated['code']) {
            return redirect()->back()
                ->withErrors(['code' => 'Invalid or expired OTP.']);
        }

        if (
            User::where('phone_number', $phone)
                ->orWhere('email', $validated['email'])
                ->exists()
        ) {
            return redirect()->back()
                ->withErrors(['phone' => 'Phone number or email already in use.']);
        }

        $email = $validated['email']
            ?? preg_replace('/[^0-9]/', '', $phone).'@promiselandfilms.local';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $email,
            'password' => Hash::make($validated['password']),
            'phone_number' => $phone,
        ]);

        try {
            if (app()->bound(EmailService::class)) {
                app(EmailService::class)->sendWelcomeEmail($user);
            }
        } catch (\Throwable $e) {
            Log::warning('Welcome email failed', ['user_id' => $user->id]);
        }

        Auth::login($user);
        Cache::forget('otp:'.$phone);

        return redirect()->intended('/dashboard')
            ->with('success', 'Account created successfully.');
    }
}
