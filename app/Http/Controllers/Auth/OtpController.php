<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\HubtelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
                $util = PhoneNumberUtil::getInstance();

                $proto = Str::startsWith($phone, '+')
                    ? $util->parse($phone, null)
                    : $util->parse($phone, 'GH');

                if (! $util->isValidNumber($proto)) {
                    throw new \Exception('Invalid phone');
                }

                return $util->format($proto, PhoneNumberFormat::E164);
            }
        } catch (\Throwable $e) {
            Log::warning('Phone normalization fallback', ['phone' => $raw]);
        }

        if (Str::startsWith($phone, '0')) {
            return '+233'.ltrim($phone, '0');
        }

        if (preg_match('/^233\d+$/', $phone)) {
            return '+'.$phone;
        }

        return $phone;
    }

    /**
     * Send OTP for registration
     */
    public function send(Request $request, HubtelService $hubtel)
    {
        // OTP registration is temporarily disabled. Please proceed to payment directly.
        return redirect()->route('payment.checkout')
            ->with('info', 'Phone verification is currently disabled. Please proceed to payment.');
    }

    /**
     * Verify OTP and complete registration
     */
    public function verifyRegister(Request $request, HubtelService $hubtel)
    {
        // OTP verification is temporarily disabled. Please proceed to payment directly.
        return redirect()->route('payment.checkout')
            ->with('info', 'Phone verification is currently disabled. Please proceed to payment.');
    }

    /**
     * Resend OTP
     */
    public function resend(Request $request, HubtelService $hubtel)
    {
        // OTP resend is temporarily disabled.
        return back()->with('info', 'Phone verification is currently disabled. Please proceed to payment.');
    }
}
