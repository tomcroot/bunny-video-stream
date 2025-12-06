<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailController extends Controller
{
    public function __construct(private EmailService $emailService) {}

    /**
     * Show the email management dashboard.
     */
    public function index()
    {
        $users = $this->emailService->getUsersForEmails();

        return Inertia::render('Admin/Email/Index', [
            'recipients' => $users->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]),
            'stats' => [
                'total_recipients' => $users->count(),
            ],
        ]);
    }

    /**
     * Send a bulk email to selected recipients.
     */
    public function sendBulkEmail(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'subject' => 'required|string|max:255',
            'html_content' => 'required|string',
            'text_content' => 'nullable|string',
        ]);

        $emails = User::whereIn('id', $validated['user_ids'])->pluck('email')->filter()->values()->toArray();

        if (empty($emails)) {
            return back()->with('error', 'No valid email addresses found for the selected recipients.');
        }

        $result = $this->emailService->sendBulkEmail(
            $emails,
            $validated['subject'],
            $validated['html_content'],
            $validated['text_content'] ?? null
        );

        return back()->with(
            $result['success'] ? 'success' : 'error',
            $result['success']
                ? "Bulk email sent successfully to {$result['recipients_count']} recipients via {$result['method']}"
                : ('Failed to send bulk email: '.($result['error'] ?? 'Unknown error'))
        );
    }

    /**
     * Send a promotional campaign to all users.
     */
    public function sendPromotionalCampaign(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'html_content' => 'required|string',
            'text_content' => 'nullable|string',
        ]);

        $users = $this->emailService->getUsersForEmails();

        if ($users->isEmpty()) {
            return back()->with('error', 'No users with valid email addresses found.');
        }

        $result = $this->emailService->sendPromotionalCampaign(
            $users,
            $validated['subject'],
            $validated['html_content'],
            $validated['text_content'] ?? null
        );

        return back()->with(
            $result['success'] ? 'success' : 'error',
            $result['success']
                ? "Promotional campaign sent to {$result['recipients_count']} users via {$result['method']}"
                : ('Failed to send promotional campaign: '.($result['error'] ?? 'Unknown error'))
        );
    }

    /**
     * Send a single test email.
     */
    public function sendTestEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'html_content' => 'required|string',
            'text_content' => 'nullable|string',
        ]);

        $result = $this->emailService->sendBulkEmail(
            [$validated['email']],
            $validated['subject'],
            $validated['html_content'],
            $validated['text_content'] ?? null
        );

        return back()->with(
            $result['success'] ? 'success' : 'error',
            $result['success']
                ? "Test email sent successfully via {$result['method']}"
                : ('Failed to send test email: '.($result['error'] ?? 'Unknown error'))
        );
    }
}
