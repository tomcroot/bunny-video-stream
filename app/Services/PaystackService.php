<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaystackService
{
    protected string $baseUrl = 'https://api.paystack.co';

    public function initialize(array $payload): array
    {
        $response = Http::withToken(config('paystack.secret_key'))
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
        $response = Http::withToken(config('paystack.secret_key'))
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
        if (! $signature || ! config('paystack.secret_key')) {
            return false;
        }

        $computed = hash_hmac('sha512', $rawBody, config('paystack.secret_key'));

        return hash_equals($computed, $signature);
    }

    public function generateReference(string $prefix = 'PS_'): string
    {
        return $prefix.Str::uuid();
    }
}
