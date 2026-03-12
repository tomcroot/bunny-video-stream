<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaystackService
{
    protected string $baseUrl;

    protected string $secretKey;

    public function __construct()
    {
        $this->baseUrl = (string) (config('services.paystack.payment_url')
            ?: 'https://api.paystack.co');

        $this->secretKey = (string) (config('services.paystack.secret_key')
            ?: config('paystack.secret_key')
            ?: '');
    }

    public function initialize(array $payload): array
    {
        $response = Http::withToken($this->secretKey)
            ->connectTimeout(5)
            ->timeout(15)
            ->retry(2, 500)
            ->post($this->baseUrl.'/transaction/initialize', $payload);

        return [
            'ok' => $response->ok(),
            'status' => $response->status(),
            'body' => $response->json(),
        ];
    }

    public function verify(string $reference): array
    {
        $response = Http::withToken($this->secretKey)
            ->connectTimeout(5)
            ->timeout(15)
            ->retry(2, 500)
            ->get($this->baseUrl.'/transaction/verify/'.urlencode($reference));

        return [
            'ok' => $response->ok(),
            'status' => $response->status(),
            'body' => $response->json(),
        ];
    }

    public function validWebhookSignature(string $rawBody, ?string $signature): bool
    {
        if (! $signature || ! $this->secretKey) {
            return false;
        }

        $computed = hash_hmac('sha512', $rawBody, $this->secretKey);

        return hash_equals($computed, $signature);
    }

    public function generateReference(string $prefix = 'PS_'): string
    {
        return $prefix.Str::uuid();
    }
}
