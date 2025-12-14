<?php

namespace App\Services;

use Hofmannsven\Brevo\Facades\Brevo;
use Illuminate\Support\Facades\Log;

class BrevoService
{
    /**
     * Send OTP verification email
     */
    public function sendOtpEmail(string $email, string $name, string $code): bool
    {
        try {
            Brevo::sendEmail([
                'sender' => [
                    'email' => config('mail.from.address'),
                    'name' => config('mail.from.name', 'Promise Land Films'),
                ],
                'to' => [[
                    'email' => $email,
                    'name' => $name,
                ]],
                'subject' => 'Your Promise Films verification code',
                'htmlContent' => $this->getOtpEmailHtml($name, $code),
            ]);

            Log::info('OTP email sent via Brevo', [
                'email' => $email,
                'name' => $name,
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Brevo OTP email failed', [
                'email' => $email,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Generate OTP email HTML content
     */
    protected function getOtpEmailHtml(string $name, string $code): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .code { font-size: 32px; font-weight: bold; color: #e11d48; letter-spacing: 8px; padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello {$name},</h2>
        <p>Your verification code for Promise Land Films is:</p>
        <div class="code">{$code}</div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <div class="footer">
            <p>Best regards,<br>The Promise Land Films Team</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Send a transactional email via Brevo API
     */
    public function sendEmail(string $email, string $name, string $subject, string $htmlContent): bool
    {
        try {
            Brevo::sendEmail([
                'sender' => [
                    'email' => config('mail.from.address'),
                    'name' => config('mail.from.name', 'Promise Land Films'),
                ],
                'to' => [[
                    'email' => $email,
                    'name' => $name,
                ]],
                'subject' => $subject,
                'htmlContent' => $htmlContent,
            ]);

            Log::info('Email sent via Brevo', [
                'email' => $email,
                'subject' => $subject,
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Brevo email failed', [
                'email' => $email,
                'subject' => $subject,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
