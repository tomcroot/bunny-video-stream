<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BulkSmsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SmsController extends Controller
{
    protected BulkSmsService $bulkSmsService;

    public function __construct(BulkSmsService $bulkSmsService)
    {
        $this->bulkSmsService = $bulkSmsService;
    }

    /**
     * Show the SMS management dashboard
     */
    public function index()
    {
        $usersWithPhones = $this->bulkSmsService->getUsersWithPhones();

        return Inertia::render('Admin/Sms/Index', [
            'usersWithPhones' => $usersWithPhones->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                ];
            }),
            'stats' => [
                'total_users_with_phones' => $usersWithPhones->count(),
            ],
        ]);
    }

    /**
     * Send custom bulk SMS
     */
    public function sendCustomSms(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'message' => 'required|string|max:160',
        ]);

        $result = $this->bulkSmsService->sendCustomBulkSms(
            $request->user_ids,
            $request->message
        );

        return back()->with($result['success'] ? 'success' : 'error',
            $result['success']
                ? "SMS sent successfully to {$result['recipients_count']} recipients"
                : 'Failed to send SMS: '.($result['error'] ?? 'Unknown error')
        );
    }

    /**
     * Send payment notifications to all users
     */
    public function sendPaymentNotifications(Request $request)
    {
        $request->validate([
            'movie_title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
        ]);

        $users = $this->bulkSmsService->getUsersWithPhones();

        if ($users->isEmpty()) {
            return back()->with('error', 'No users with phone numbers found');
        }

        $results = $this->bulkSmsService->sendBulkPaymentNotifications(
            $users,
            $request->movie_title,
            $request->amount
        );

        $message = "Payment notifications sent: {$results['successful']} successful, {$results['failed']} failed";

        return back()->with($results['failed'] === 0 ? 'success' : 'warning', $message);
    }

    /**
     * Send renewal reminders (placeholder for future implementation)
     */
    public function sendRenewalReminders(Request $request)
    {
        $request->validate([
            'movie_title' => 'required|string|max:255',
            'days_remaining' => 'required|integer|min:1|max:365',
        ]);

        // This would need subscription/access logic to be implemented
        return back()->with('info', 'Renewal reminders feature will be available once subscription system is implemented');
    }
}
