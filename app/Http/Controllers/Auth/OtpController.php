<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;

class OtpController extends Controller
{
    /**
     * Send an OTP to the provided phone number using mNotify.
     */
    public function send(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string'],
        ]);

        $raw = $request->input('phone');
        $phone = preg_replace('/[^0-9+]/', '', $raw);

        // Prefer libphonenumber if available for robust parsing/formatting
        try {
            if (class_exists(PhoneNumberUtil::class)) {
                $phoneUtil = PhoneNumberUtil::getInstance();
                // try parsing with an assumed region of GH if no + present
                if (Str::startsWith($phone, '+')) {
                    $numberProto = $phoneUtil->parse($phone, null);
                } else {
                    $numberProto = $phoneUtil->parse($phone, 'GH');
                }

                if (! $phoneUtil->isValidNumber($numberProto)) {
                    return response()->json(['success' => false, 'message' => 'Invalid phone number.'], 422);
                }

                $phone = $phoneUtil->format($numberProto, PhoneNumberFormat::E164);
            } else {
                // Basic E.164 normalization for common cases (Ghana-focused)
                if (Str::startsWith($phone, '0')) {
                    $phone = preg_replace('/^0+/', '', $phone);
                    $phone = '+233'.$phone;
                } elseif (preg_match('/^233[0-9]+$/', $phone)) {
                    $phone = '+'.$phone;
                }
            }
        } catch (\Throwable $e) {
            \Log::warning('libphonenumber parsing failed, falling back', ['phone' => $raw, 'error' => $e->getMessage()]);
            if (Str::startsWith($phone, '0')) {
                $phone = preg_replace('/^0+/', '', $phone);
                $phone = '+233'.$phone;
            } elseif (preg_match('/^233[0-9]+$/', $phone)) {
                $phone = '+'.$phone;
            }
        }

        // generate a 6-digit code
        $code = random_int(100000, 999999);

        // store in cache for 5 minutes
        Cache::put('otp:'.$phone, $code, now()->addMinutes(5));

        // check rate limit per phone (3 sends per 15 minutes)
        $limitKey = 'otp-send:'.$phone;
        $maxAttempts = 3;
        $decaySeconds = 900; // 15 minutes

        if (RateLimiter::tooManyAttempts($limitKey, $maxAttempts)) {
            $available = RateLimiter::availableIn($limitKey);

            return response()->json(['success' => false, 'message' => 'Too many requests. Try again later.', 'retry_after' => $available], 429);
        }

        // send via mNotify
        try {
            $mnotify = new \Arhinful\LaravelMnotify\MNotify;
            $mnotify->setAPIKey(config('mnotify.api_key'));
            $mnotify->setSender(config('mnotify.sender_id'));
            $message = "Your Promise Films login code: {$code}";
            $mnotify->sendQuickSMS([$phone], $message);

            // record a successful send attempt
            RateLimiter::hit($limitKey, $decaySeconds);
        } catch (\Throwable $e) {
            \Log::error('OTP send failed', ['phone' => $phone, 'error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'Failed to send OTP.'], 500);
        }

        return response()->json(['success' => true, 'message' => 'OTP sent']);
    }

    /**
     * Verify OTP and log the user in (create if necessary).
     */
    public function verify(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);

        $raw = $request->input('phone');
        $phone = preg_replace('/[^0-9+]/', '', $raw);
        if (Str::startsWith($phone, '0')) {
            $phone = preg_replace('/^0+/', '', $phone);
            $phone = '+233'.$phone;
        } elseif (preg_match('/^233[0-9]+$/', $phone)) {
            $phone = '+'.$phone;
        }
        $code = $request->input('code');

        $cached = Cache::get('otp:'.$phone);

        if (! $cached || (string) $cached !== (string) $code) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired code.'], 422);
        }

        // find or create user by phone
        $user = User::where('phone_number', $phone)->first();

        if (! $user) {
            $fakeEmail = sprintf('%s@promiselandfilms.local', preg_replace('/[^0-9]/', '', $phone));
            $user = User::create([
                'name' => $phone,
                'email' => $fakeEmail,
                'password' => Str::random(40),
                'phone_number' => $phone,
            ]);
            // If the app has EmailService and BREVO configured, send a welcome + verification
            try {
                if (app()->bound(EmailService::class)) {
                    app(EmailService::class)->sendWelcomeEmail($user);
                }
            } catch (\Throwable $e) {
                \Log::warning('Failed to send welcome/verification email', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            }
        }

        Auth::login($user);

        Cache::forget('otp:'.$phone);

        return response()->json(['success' => true, 'message' => 'Authenticated']);
    }

    /**
     * Verify OTP and register a new user with provided credentials.
     */
    public function verifyRegister(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $raw = $request->input('phone');
        $phone = preg_replace('/[^0-9+]/', '', $raw);
        if (Str::startsWith($phone, '0')) {
            $phone = preg_replace('/^0+/', '', $phone);
            $phone = '+233'.$phone;
        } elseif (preg_match('/^233[0-9]+$/', $phone)) {
            $phone = '+'.$phone;
        }
        $code = $request->input('code');

        $cached = Cache::get('otp:'.$phone);

        if (! $cached || (string) $cached !== (string) $code) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired code.'], 422);
        }

        // Check if user already exists
        $existingUser = User::where('phone_number', $phone)->orWhere('email', $request->input('email'))->first();
        if ($existingUser) {
            return response()->json(['success' => false, 'message' => 'Phone or email already in use.'], 422);
        }

        // Create new user with provided credentials
        $email = $request->input('email');
        if (! $email) {
            $email = sprintf('%s@promiselandfilms.local', preg_replace('/[^0-9]/', '', $phone));
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $email,
            'password' => Hash::make($request->input('password')),
            'phone_number' => $phone,
        ]);

        // Send welcome email if configured
        try {
            if (app()->bound(EmailService::class)) {
                app(EmailService::class)->sendWelcomeEmail($user);
            }
        } catch (\Throwable $e) {
            \Log::warning('Failed to send welcome email', ['user_id' => $user->id, 'error' => $e->getMessage()]);
        }

        Auth::login($user);

        Cache::forget('otp:'.$phone);

        return response()->json(['success' => true, 'message' => 'Account created and authenticated']);
    }
}
