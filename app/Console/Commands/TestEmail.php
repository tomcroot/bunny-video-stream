<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\EmailService;
use Illuminate\Console\Command;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {action : The action to test (login|reset|verification|bulk|promo)} {--user-id= : User ID for single user tests} {--email= : Email address for test emails}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email functionality';

    protected EmailService $emailService;

    public function __construct(EmailService $emailService)
    {
        parent::__construct();
        $this->emailService = $emailService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');
        $userId = $this->option('user-id');
        $email = $this->option('email');

        switch ($action) {
            case 'login':
                $this->testLoginNotification($userId);
                break;

            case 'reset':
                $this->testPasswordReset($userId);
                break;

            case 'verification':
                $this->testEmailVerification($userId);
                break;

            case 'bulk':
                $this->testBulkEmail();
                break;

            case 'promo':
                $this->testPromotionalCampaign();
                break;

            default:
                $this->error('Invalid action. Use: login, reset, verification, bulk, or promo');

                return 1;
        }

        return 0;
    }

    private function testLoginNotification(?string $userId): void
    {
        if (! $userId) {
            $this->error('User ID is required for login notification test. Use --user-id option.');

            return;
        }

        $user = User::find($userId);
        if (! $user) {
            $this->error("User with ID {$userId} not found");

            return;
        }

        $this->info("Sending login notification to user: {$user->name}");
        $result = $this->emailService->sendLoginNotification($user, '192.168.1.100', 'Mozilla/5.0 (Test Browser)');

        if ($result) {
            $this->info('✅ Login notification sent successfully');
        } else {
            $this->error('❌ Failed to send login notification');
        }
    }

    private function testPasswordReset(?string $userId): void
    {
        if (! $userId) {
            $this->error('User ID is required for password reset test. Use --user-id option.');

            return;
        }

        $user = User::find($userId);
        if (! $user) {
            $this->error("User with ID {$userId} not found");

            return;
        }

        $token = \Illuminate\Support\Str::random(64);
        $this->info("Sending password reset to user: {$user->name}");
        $result = $this->emailService->sendPasswordResetNotification($user, $token);

        if ($result) {
            $this->info('✅ Password reset email sent successfully');
        } else {
            $this->error('❌ Failed to send password reset email');
        }
    }

    private function testEmailVerification(?string $userId): void
    {
        if (! $userId) {
            $this->error('User ID is required for email verification test. Use --user-id option.');

            return;
        }

        $user = User::find($userId);
        if (! $user) {
            $this->error("User with ID {$userId} not found");

            return;
        }

        $this->info("Sending email verification to user: {$user->name}");
        $result = $this->emailService->sendEmailVerificationNotification($user);

        if ($result) {
            $this->info('✅ Email verification sent successfully');
        } else {
            $this->error('❌ Failed to send email verification');
        }
    }

    private function testBulkEmail(): void
    {
        $emails = $this->option('email') ? [$this->option('email')] : ['brandsafric@gmail.com', 'info@acrazydayinaccra.com'];

        $subject = 'Test Bulk Email from A Crazy Day in Accra';
        $htmlContent = '<h1>Test Email from A Crazy Day in Accra</h1><p>This is a test bulk email from the A Crazy Day in Accra platform.</p><p>Sent from: info@acrazydayinaccra.com</p>';
        $textContent = 'This is a test bulk email from the A Crazy Day in Accra platform. Sent from: info@acrazydayinaccra.com';

        $this->info('Sending test bulk email to: '.implode(', ', $emails));
        $result = $this->emailService->sendBulkEmail($emails, $subject, $htmlContent, $textContent);

        if ($result['success']) {
            $this->info('✅ Bulk email sent successfully');
        } else {
            $this->error('❌ Failed to send bulk email: '.($result['error'] ?? 'Unknown error'));
        }
    }

    private function testPromotionalCampaign(): void
    {
        $users = $this->emailService->getUsersForEmails();
        if ($users->isEmpty()) {
            $this->warn('No users with email addresses found');

            return;
        }

        $subject = '🎬 Special Promotion from A Crazy Day in Accra!';
        $htmlContent = '
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Special Movie Promotion!</h1>
                <p>Dear valued customer,</p>
                <p>We have an exciting promotion just for you! Get 20% off on all movie rentals this week.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Claim Your Discount</a>
                </div>
                <p>Happy watching!</p>
                <p>The A Crazy Day in Accra Team</p>
            </div>
        ';
        $textContent = 'Special Movie Promotion! Get 20% off on all movie rentals this week. Visit acrazydayinaccra.com to claim your discount. Happy watching! - The A Crazy Day in Accra Team';

        $this->info("Sending promotional campaign to {$users->count()} users...");
        $result = $this->emailService->sendPromotionalCampaign($users, $subject, $htmlContent, $textContent);

        if ($result['success']) {
            $this->info('✅ Promotional campaign sent successfully');
        } else {
            $this->error('❌ Failed to send promotional campaign: '.($result['error'] ?? 'Unknown error'));
        }
    }
}
