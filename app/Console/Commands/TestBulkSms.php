<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\BulkSmsService;
use Illuminate\Console\Command;

class TestBulkSms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sms:test {action : The action to test (send-payment|send-reminder|send-custom|list-users)} {--user-id= : User ID for single user tests}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test bulk SMS functionality';

    protected BulkSmsService $bulkSmsService;

    public function __construct(BulkSmsService $bulkSmsService)
    {
        parent::__construct();
        $this->bulkSmsService = $bulkSmsService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');
        $userId = $this->option('user-id');

        switch ($action) {
            case 'send-payment':
                $this->testPaymentNotification($userId);
                break;

            case 'send-reminder':
                $this->testRenewalReminder($userId);
                break;

            case 'send-custom':
                $this->testCustomSms();
                break;

            case 'list-users':
                $this->listUsersWithPhones();
                break;

            default:
                $this->error('Invalid action. Use: send-payment, send-reminder, send-custom, or list-users');

                return 1;
        }

        return 0;
    }

    private function testPaymentNotification(?string $userId): void
    {
        if ($userId) {
            $user = User::find($userId);
            if (! $user) {
                $this->error("User with ID {$userId} not found");

                return;
            }

            $this->info("Sending payment notification to user: {$user->name}");
            $result = $this->bulkSmsService->sendPaymentNotification($user, 'Test Movie', 50.00);

            if ($result) {
                $this->info('✅ Payment notification sent successfully');
            } else {
                $this->error('❌ Failed to send payment notification');
            }
        } else {
            $users = $this->bulkSmsService->getUsersWithPhones();
            if ($users->isEmpty()) {
                $this->warn('No users with phone numbers found');

                return;
            }

            $this->info("Sending payment notifications to {$users->count()} users...");
            $results = $this->bulkSmsService->sendBulkPaymentNotifications($users, 'Test Movie', 50.00);

            $this->info("✅ Successful: {$results['successful']}");
            $this->info("❌ Failed: {$results['failed']}");

            if (! empty($results['errors'])) {
                $this->warn('Errors:');
                foreach ($results['errors'] as $error) {
                    $this->line("  - {$error}");
                }
            }
        }
    }

    private function testRenewalReminder(?string $userId): void
    {
        if ($userId) {
            $user = User::find($userId);
            if (! $user) {
                $this->error("User with ID {$userId} not found");

                return;
            }

            $this->info("Sending renewal reminder to user: {$user->name}");
            $result = $this->bulkSmsService->sendRenewalReminder($user, 'Test Movie', 7);

            if ($result) {
                $this->info('✅ Renewal reminder sent successfully');
            } else {
                $this->error('❌ Failed to send renewal reminder');
            }
        } else {
            $this->warn('Renewal reminders require specific user selection (use --user-id option)');
        }
    }

    private function testCustomSms(): void
    {
        $users = $this->bulkSmsService->getUsersWithPhones();
        if ($users->isEmpty()) {
            $this->warn('No users with phone numbers found');

            return;
        }

        $phoneNumbers = $users->pluck('phone_number')->toArray();
        $message = 'This is a test SMS from Promise platform! 🎬';

        $this->info("Sending custom SMS to {$users->count()} users...");
        $result = $this->bulkSmsService->sendCustomBulkSms($phoneNumbers, $message);

        if ($result['success']) {
            $this->info('✅ Custom SMS sent successfully');
        } else {
            $this->error('❌ Failed to send custom SMS: '.($result['error'] ?? 'Unknown error'));
        }
    }

    private function listUsersWithPhones(): void
    {
        $users = $this->bulkSmsService->getUsersWithPhones();

        if ($users->isEmpty()) {
            $this->warn('No users with phone numbers found');

            return;
        }

        $this->info("Users with phone numbers ({$users->count()} total):");
        $this->table(
            ['ID', 'Name', 'Email', 'Phone'],
            $users->map(function ($user) {
                return [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone_number,
                ];
            })->toArray()
        );
    }
}
