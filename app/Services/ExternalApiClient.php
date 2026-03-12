<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Throwable;

class ExternalApiClient
{
    /**
     * Provider-level default HTTP behavior profiles.
     *
     * @var array<string, array<string, int>>
     */
    private const PROFILES = [
        'default' => [
            'connect_timeout' => 5,
            'timeout' => 15,
            'retry_attempts' => 2,
            'retry_delay_ms' => 500,
        ],
        'paystack' => [
            'connect_timeout' => 3,
            'timeout' => 10,
            'retry_attempts' => 2,
            'retry_delay_ms' => 250,
        ],
        'bunny' => [
            'connect_timeout' => 5,
            'timeout' => 20,
            'retry_attempts' => 2,
            'retry_delay_ms' => 500,
        ],
    ];

    /**
     * Perform a JSON-oriented external API request with consistent retry/timeout behavior.
     *
     * @param  array<string, mixed>  $options
     * @return array{ok: bool, status: int, body: mixed, error: ?string}
     */
    public function request(string $method, string $url, array $options = []): array
    {
        $resolved = array_merge(self::PROFILES['default'], $options);

        $headers = $resolved['headers'] ?? [];
        $token = $resolved['token'] ?? null;
        $connectTimeout = (int) ($resolved['connect_timeout'] ?? 5);
        $timeout = (int) ($resolved['timeout'] ?? 15);
        $retryAttempts = (int) ($resolved['retry_attempts'] ?? 2);
        $retryDelayMs = (int) ($resolved['retry_delay_ms'] ?? 500);

        $request = Http::acceptJson()
            ->connectTimeout($connectTimeout)
            ->timeout($timeout)
            ->retry($retryAttempts, $retryDelayMs)
            ->withHeaders($headers);

        if (! empty($token)) {
            $request = $request->withToken((string) $token);
        }

        try {
            $response = match (strtolower($method)) {
                'get' => $request->get($url, $resolved['query'] ?? []),
                'post' => $request->post($url, $resolved['json'] ?? []),
                'put' => $request->put($url, $resolved['json'] ?? []),
                'patch' => $request->patch($url, $resolved['json'] ?? []),
                'delete' => $request->delete($url, $resolved['json'] ?? []),
                default => throw new \InvalidArgumentException('Unsupported HTTP method: '.$method),
            };

            return [
                'ok' => $response->ok(),
                'status' => $response->status(),
                'body' => $response->json(),
                'error' => null,
            ];
        } catch (Throwable $e) {
            return [
                'ok' => false,
                'status' => 0,
                'body' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Perform a request using a predefined provider profile.
     *
     * @param  array<string, mixed>  $options
     * @return array{ok: bool, status: int, body: mixed, error: ?string}
     */
    public function requestWithProfile(string $profile, string $method, string $url, array $options = []): array
    {
        $profileDefaults = self::PROFILES[$profile] ?? self::PROFILES['default'];

        return $this->request($method, $url, array_merge($profileDefaults, $options));
    }
}
