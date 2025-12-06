<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\BulkSmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BulkSmsController extends Controller
{
    protected BulkSmsService $bulkSmsService;

    public function __construct(BulkSmsService $bulkSmsService)
    {
        $this->bulkSmsService = $bulkSmsService;
    }

    /**
     * Send custom bulk SMS to selected users
     */
    public function sendCustomSms(Request $request): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'message' => 'required|string|max:160',
        ]);

        $users = User::whereIn('id', $request->user_ids)
            ->whereNotNull('phone_number')
            ->where('phone_number', '!=', '')
            ->get();

        if ($users->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No users with valid phone numbers found',
            ], 400);
        }

        $phoneNumbers = $users->pluck('phone_number')->toArray();

        $result = $this->bulkSmsService->sendCustomBulkSms($phoneNumbers, $request->message);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['success']
                ? "SMS sent to {$result['recipients_count']} recipients"
                : 'Failed to send SMS: '.($result['error'] ?? 'Unknown error'),
            'data' => $result,
        ]);
    }

    /**
     * Send payment notifications to all users with phone numbers
     */
    public function sendPaymentNotifications(Request $request): JsonResponse
    {
        $request->validate([
            'movie_title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
        ]);

        $users = $this->bulkSmsService->getUsersWithPhones();

        if ($users->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No users with phone numbers found',
            ], 400);
        }

        $results = $this->bulkSmsService->sendBulkPaymentNotifications(
            $users,
            $request->movie_title,
            $request->amount
        );

        return response()->json([
            'success' => true,
            'message' => "Payment notifications sent: {$results['successful']} successful, {$results['failed']} failed",
            'data' => $results,
        ]);
    }

    /**
     * Send renewal reminders to users expiring soon
     */
    public function sendRenewalReminders(Request $request): JsonResponse
    {
        $request->validate([
            'movie_title' => 'required|string|max:255',
            'days_remaining' => 'required|integer|min:1|max:365',
        ]);

        $users = $this->bulkSmsService->getUsersExpiringSoon($request->days_remaining);

        if ($users->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No users expiring within the specified period',
            ], 400);
        }

        $results = $this->bulkSmsService->sendBulkRenewalReminders(
            $users,
            $request->movie_title,
            $request->days_remaining
        );

        return response()->json([
            'success' => true,
            'message' => "Renewal reminders sent: {$results['successful']} successful, {$results['failed']} failed",
            'data' => $results,
        ]);
    }

    /**
     * Get users with phone numbers for bulk operations
     */
    public function getUsersWithPhones(): JsonResponse
    {
        $users = $this->bulkSmsService->getUsersWithPhones();

        return response()->json([
            'success' => true,
            'data' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                ];
            }),
        ]);
    }
}
