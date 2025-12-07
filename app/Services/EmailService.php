<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\EmailLoginNotification;
use App\Notifications\EmailVerificationNotification;
use App\Notifications\PasswordResetNotification;
use Hofmannsven\Brevo\Facades\Brevo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    /**
     * Send login notification to a user
     */
    public function sendLoginNotification(User $user, ?string $ipAddress = null, ?string $userAgent = null): bool
    {
        try {
            $user->notify(new EmailLoginNotification($ipAddress, $userAgent));

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send login email notification', [
                'user_id' => $user->id,
                'ip_address' => $ipAddress,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send password reset notification to a user
     */
    public function sendPasswordResetNotification(User $user, string $token): bool
    {
        try {
            $user->notify(new PasswordResetNotification($token));

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send password reset email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send email verification notification to a user
     */
    public function sendEmailVerificationNotification(User $user): bool
    {
        try {
            $user->notify(new EmailVerificationNotification);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send email verification', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send bulk email to multiple users using Brevo API with SMTP fallback
     */
    public function sendBulkEmail(array $emailAddresses, string $subject, string $htmlContent, ?string $textContent = null): array
    {
        // Try Brevo API first
        try {
            $transactionalEmailsApi = Brevo::TransactionalEmailsApi();

            $sendSmtpEmail = new \Brevo\Client\Model\SendSmtpEmail([
                'to' => array_map(function ($email) {
                    return ['email' => $email];
                }, $emailAddresses),
                'subject' => $subject,
                'htmlContent' => $htmlContent,
                'textContent' => $textContent,
                'sender' => [
                    'name' => 'Promise - A Crazy Day in Accra',
                    'email' => 'info@acrazydayinaccra.com',
                ],
            ]);

            $response = $transactionalEmailsApi->sendTransacEmail($sendSmtpEmail);

            return [
                'success' => true,
                'method' => 'brevo_api',
                'message_id' => $response['messageId'] ?? null,
                'recipients_count' => count($emailAddresses),
            ];
        } catch (\Exception $e) {
            Log::warning('Brevo API failed, falling back to SMTP', [
                'emails' => $emailAddresses,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);

            // Fall back to SMTP
            return $this->sendBulkEmailViaSmtp($emailAddresses, $subject, $htmlContent, $textContent);
        }
    }

    /**
     * Send bulk email via SMTP as fallback
     */
    private function sendBulkEmailViaSmtp(array $emailAddresses, string $subject, string $htmlContent, ?string $textContent = null): array
    {
        try {
            $successful = 0;
            $failed = 0;
            $errors = [];

            foreach ($emailAddresses as $email) {
                try {
                    Mail::html($htmlContent, function ($message) use ($email, $subject) {
                        $message->to($email)
                            ->subject($subject)
                            ->from('info@acrazydayinaccra.com', 'Promise - A Crazy Day in Accra');
                    });
                    $successful++;
                } catch (\Exception $e) {
                    $failed++;
                    $errors[] = "Failed to send to {$email}: {$e->getMessage()}";
                }
            }

            return [
                'success' => $failed === 0,
                'method' => 'smtp_fallback',
                'successful' => $successful,
                'failed' => $failed,
                'errors' => $errors,
                'recipients_count' => count($emailAddresses),
            ];
        } catch (\Exception $e) {
            Log::error('SMTP fallback also failed', [
                'emails' => $emailAddresses,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'method' => 'smtp_fallback',
                'error' => $e->getMessage(),
                'recipients_count' => count($emailAddresses),
            ];
        }
    }

    /**
     * Send promotional email campaign to all users
     */
    public function sendPromotionalCampaign(Collection $users, string $subject, string $htmlContent, ?string $textContent = null): array
    {
        $emailAddresses = $users->pluck('email')->toArray();

        return $this->sendBulkEmail($emailAddresses, $subject, $htmlContent, $textContent);
    }

    /**
     * Get users for bulk email operations
     */
    public function getUsersForEmails(): Collection
    {
        return User::whereNotNull('email')
            ->where('email', '!=', '')
            ->get();
    }

    /**
     * Send welcome email to new user
     */
    public function sendWelcomeEmail(User $user): bool
    {
        try {
            // Send both email verification and welcome message
            $this->sendEmailVerificationNotification($user);

            // You could also send a separate welcome email here if needed
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
