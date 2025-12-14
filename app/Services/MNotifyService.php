<?php

namespace App\Services;

use Arhinful\LaravelMNotify\MNotify;
use Illuminate\Support\Facades\Log;

class MNotifyService
{
    protected MNotify $client;

    public function __construct()
    {
        $this->client = new MNotify;
        $this->client->setAPIKey(config('mnotify.api_key'));
        $this->client->setSender(config('mnotify.sender_id'));
    }

    /**
     * Send SMS to a single phone number
     */
    public function sendSms(string $phone, string $message): bool
    {
        try {
            $this->client->sendQuickSMS([$phone], $message);

            Log::info('SMS sent successfully', [
                'phone' => $phone,
                'message_length' => strlen($message),
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('SMS send failed', [
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Send SMS to multiple phone numbers
     */
    public function sendBulkSms(array $phones, string $message): bool
    {
        try {
            $this->client->sendQuickSMS($phones, $message);

            Log::info('Bulk SMS sent successfully', [
                'recipients' => count($phones),
                'message_length' => strlen($message),
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Bulk SMS send failed', [
                'recipients' => count($phones),
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
