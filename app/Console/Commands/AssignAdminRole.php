<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AssignAdminRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:make-admin {email? : The email of the user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign admin role to a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        // If no email provided, ask for it
        if (! $email) {
            $email = $this->ask('Enter the user email address');
        }

        // Find the user
        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email '{$email}' not found.");

            // Show available users
            $this->info("\nAvailable users:");
            User::all()->each(function ($u) {
                $this->line("  - {$u->email} ({$u->name})");
            });

            return 1;
        }

        // Check if already admin
        if ($user->hasRole('admin')) {
            $this->warn("User '{$user->email}' already has admin role.");

            return 0;
        }

        // Assign admin role
        $user->assignRole('admin');

        $this->info("✓ Admin role assigned to {$user->name} ({$user->email})");
        $this->line("\nThe user can now access the admin panel at /admin");

        return 0;
    }
}
