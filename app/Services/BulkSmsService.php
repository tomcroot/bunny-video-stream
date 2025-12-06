<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\PaymentSuccessfulNotification;
use App\Notifications\RenewalReminderNotification;
use Arhinful\LaravelMNotify\MNotify;
use Illuminate\Support\Collection;

class BulkSmsService
{
    /**
     * Send payment successful notification to a user
     */
    public function sendPaymentNotification(User $user, string $movieTitle, float $amount): bool
    {
        try {
            $user->notify(new PaymentSuccessfulNotification($movieTitle, $amount));

            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to send payment SMS notification', [
                'user_id' => $user->id,
                'movie_title' => $movieTitle,
                'amount' => $amount,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send renewal reminder to a user
     */
    public function sendRenewalReminder(User $user, string $movieTitle, int $daysRemaining): bool
    {
        try {
            $user->notify(new RenewalReminderNotification($movieTitle, $daysRemaining));

            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to send renewal reminder SMS', [
                'user_id' => $user->id,
                'movie_title' => $movieTitle,
                'days_remaining' => $daysRemaining,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send bulk payment notifications to multiple users
     */
    public function sendBulkPaymentNotifications(Collection $users, string $movieTitle, float $amount): array
    {
        $results = [
            'successful' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($users as $user) {
            if ($this->sendPaymentNotification($user, $movieTitle, $amount)) {
                $results['successful']++;
            } else {
                $results['failed']++;
                $results['errors'][] = "Failed to send to user {$user->id} ({$user->name})";
            }
        }

        return $results;
    }

    /**
     * Send bulk renewal reminders to multiple users
     */
    public function sendBulkRenewalReminders(Collection $users, string $movieTitle, int $daysRemaining): array
    {
        $results = [
            'successful' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($users as $user) {
            if ($this->sendRenewalReminder($user, $movieTitle, $daysRemaining)) {
                $results['successful']++;
            } else {
                $results['failed']++;
                $results['errors'][] = "Failed to send to user {$user->id} ({$user->name})";
            }
        }

        return $results;
    }

    /**
     * Send custom SMS message to multiple recipients using MNotify API
     */
    public function sendCustomBulkSms(array $phoneNumbers, string $message): array
    {
        try {
            $mnotify = new \Arhinful\LaravelMnotify\MNotify;
            $mnotify->setAPIKey(config('mnotify.api_key'));
            $mnotify->setSender(config('mnotify.sender_id'));

            $response = $mnotify->sendQuickSMS($phoneNumbers, $message);

            return [
                'success' => true,
                'response' => $response,
                'recipients_count' => count($phoneNumbers),
            ];
        } catch (\Exception $e) {
            \Log::error('Failed to send bulk SMS', [
                'phone_numbers' => $phoneNumbers,
                'message' => $message,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'recipients_count' => count($phoneNumbers),
            ];
        }
    }

    /**
     * Get users with phone numbers for bulk operations
     */
    public function getUsersWithPhones(): Collection
    {
        return User::whereNotNull('phone_number')
            ->where('phone_number', '!=', '')
            ->get();
    }

    /**
     * Get users expiring within specified days
     */
    public function getUsersExpiringSoon(int $days = 7): Collection
    {
        // This would need to be implemented based on your subscription/access model
        // For now, returning empty collection as placeholder
        return collect();
    }
}
