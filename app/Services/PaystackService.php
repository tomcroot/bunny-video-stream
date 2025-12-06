<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaystackService
{
    protected string $baseUrl = 'https://api.paystack.co';

    public function initialize(array $payload): array
    {
        $secret = config('paystack.secret_key');
        $response = Http::withToken($secret)
            ->post($this->baseUrl.'/transaction/initialize', $payload);

        return [
            'ok' => $response->ok(),
            'status' => $response->status(),
            'body' => $response->json(),
        ];
    }

    public function verify(string $reference): array
    {
        $secret = config('paystack.secret_key');
        $response = Http::withToken($secret)
            ->get($this->baseUrl.'/transaction/verify/'.urlencode($reference));

        return [
            'ok' => $response->ok(),
            'status' => $response->status(),
            'body' => $response->json(),
        ];
    }

    public function validWebhookSignature(string $rawBody, ?string $signature): bool
    {
        // Paystack uses SHA512 HMAC: x-paystack-signature header matches hash_hmac('sha512', body, secret)
        $secret = config('paystack.secret_key');
        if (! $signature || ! $secret) {
            return false;
        }
        $computed = hash_hmac('sha512', $rawBody, $secret);

        return hash_equals($computed, $signature);
    }

    public function generateReference(string $prefix = 'PS_'): string
    {
        return $prefix.Str::uuid()->toString();
    }
}
