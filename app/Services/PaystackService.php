<?php

namespace App\Services;

use Illuminate\Support\Str;

class PaystackService
{
    protected string $baseUrl;

    protected string $secretKey;

    public function __construct(
        private readonly ExternalApiClient $apiClient
    ) {
        $this->baseUrl = (string) (config('services.paystack.payment_url')
            ?: 'https://api.paystack.co');

        $this->secretKey = (string) (config('services.paystack.secret_key')
            ?: config('paystack.secret_key')
            ?: '');
    }

    public function initialize(array $payload): array
    {
        return $this->apiClient->requestWithProfile('paystack', 'post', $this->baseUrl.'/transaction/initialize', [
            'token' => $this->secretKey,
            'json' => $payload,
        ]);
    }

    public function verify(string $reference): array
    {
        return $this->apiClient->requestWithProfile('paystack', 'get', $this->baseUrl.'/transaction/verify/'.urlencode($reference), [
            'token' => $this->secretKey,
        ]);
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
