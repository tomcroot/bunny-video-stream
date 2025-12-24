<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;

class PhoneNumber
{
    /**
     * Normalize a phone number to E.164 when possible.
     */
    public static function normalize(?string $raw): ?string
    {
        if ($raw === null) {
            return null;
        }

        $phone = preg_replace('/[^0-9+]/', '', $raw);

        if ($phone === '') {
            return null;
        }

        try {
            if (class_exists(PhoneNumberUtil::class)) {
                $phoneUtil = PhoneNumberUtil::getInstance();

                $numberProto = Str::startsWith($phone, '+')
                    ? $phoneUtil->parse($phone, null)
                    : $phoneUtil->parse($phone, 'GH');

                if ($phoneUtil->isValidNumber($numberProto)) {
                    return $phoneUtil->format($numberProto, PhoneNumberFormat::E164);
                }
            }
        } catch (\Throwable $e) {
            Log::debug('Phone normalization fallback triggered', [
                'input' => $raw,
                'reason' => $e->getMessage(),
            ]);
        }

        if (Str::startsWith($phone, '0')) {
            return '+233'.preg_replace('/^0+/', '', $phone);
        }

        if (preg_match('/^233[0-9]+$/', $phone)) {
            return '+'.$phone;
        }

        return $phone ?: null;
    }

    /**
     * Build a deterministic placeholder email from a phone number.
     */
    public static function placeholderEmail(?string $raw): string
    {
        $digits = preg_replace('/[^0-9]/', '', $raw ?? '') ?: 'user'.Str::random(8);
        $domain = config('app.fallback_email_domain', 'acrazydayinaccra.com');

        return Str::lower($digits).'@'.$domain;
    }
}
