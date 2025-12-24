<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HubtelService
{
    protected function client()
    {
        return Http::withBasicAuth(
            config('services.hubtel.client_id'),
            config('services.hubtel.client_secret')
        )
            ->acceptJson()
            ->timeout(15);
    }

    /* ============================
     | OTP METHODS
     |============================ */

    public function sendOtp(string $phone, string $countryCode = 'GH'): array
    {
        $response = $this->client()->post(
            config('services.hubtel.base_url').'/otp/send',
            [
                'senderId' => config('services.hubtel.sender_id'),
                'phoneNumber' => $phone,
                'countryCode' => $countryCode,
            ]
        );

        if (! $response->successful() || data_get($response->json(), 'code') !== '0000') {
            Log::error('Hubtel OTP send failed', [
                'phone' => $phone,
                'response' => $response->json(),
            ]);

            throw new \RuntimeException('Unable to send OTP.');
        }

        return $response->json('data');
    }

    public function verifyOtp(string $requestId, string $prefix, string $code): bool
    {
        $response = $this->client()->post(
            config('services.hubtel.base_url').'/otp/verify',
            [
                'requestId' => $requestId,
                'prefix' => $prefix,
                'code' => $code,
            ]
        );

        return $response->status() === 200;
    }

    public function resendOtp(string $requestId): array
    {
        $response = $this->client()->post(
            config('services.hubtel.base_url').'/otp/resend',
            [
                'requestId' => $requestId,
            ]
        );

        if (! $response->successful() || data_get($response->json(), 'code') !== '0000') {
            Log::error('Hubtel OTP resend failed', [
                'request_id' => $requestId,
                'response' => $response->json(),
            ]);

            throw new \RuntimeException('Unable to resend OTP.');
        }

        return $response->json('data');
    }
}
