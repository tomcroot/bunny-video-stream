<?php

return [
    'mode' => env('PAYSTACK_MODE', 'test'),
    'public_key' => env('PAYSTACK_PUBLIC_KEY', ''),
    'secret_key' => env('PAYSTACK_SECRET_KEY', ''),
    'payment_url' => env('PAYSTACK_PAYMENT_URL', 'https://api.paystack.co'),
    'currency' => env('PAYSTACK_CURRENCY', 'GHS'),
    'callback_url' => env('PAYSTACK_CALLBACK_URL', env('APP_URL').'/payment'),
    // Prefer plural + namespaced webhook path for clarity
    'webhook_url' => env('PAYSTACK_WEBHOOK_URL', env('APP_URL').'/webhooks/paystack'),
];
