<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubscribersController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $filter = $request->get('filter', 'all'); // all, paid, unpaid

        // Get all users with their payment and subscription status
        $usersQuery = User::query()
            ->with(['payments' => function ($q) {
                $q->where('status', 'success')->latest();
            }, 'subscriptions' => function ($q) {
                $q->latest();
            }])
            ->withCount(['payments as successful_payments_count' => function ($q) {
                $q->where('status', 'success');
            }]);

        // Apply search filter
        if ($search) {
            $usersQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        // Apply payment status filter
        if ($filter === 'paid') {
            $usersQuery->whereHas('payments', function ($q) {
                $q->where('status', 'success');
            });
        } elseif ($filter === 'unpaid') {
            $usersQuery->whereDoesntHave('payments', function ($q) {
                $q->where('status', 'success');
            });
        }

        $users = $usersQuery->latest()->paginate(25)->through(function ($user) {
            $latestPayment = $user->payments->first();
            $latestSubscription = $user->subscriptions->first();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'has_paid' => $user->successful_payments_count > 0,
                'payment_count' => $user->successful_payments_count,
                'latest_payment' => $latestPayment ? [
                    'reference' => $latestPayment->reference,
                    'amount' => $latestPayment->amount,
                    'status' => $latestPayment->status,
                    'created_at' => $latestPayment->created_at,
                ] : null,
                'subscription' => $latestSubscription ? [
                    'is_active' => $latestSubscription->isActive(),
                    'expires_at' => $latestSubscription->expires_at,
                ] : null,
                'email_verified' => $user->email_verified_at !== null,
                'created_at' => $user->created_at,
            ];
        });

        // Get summary stats
        $stats = [
            'total_users' => User::count(),
            'paid_users' => User::whereHas('payments', fn ($q) => $q->where('status', 'success'))->count(),
            'unpaid_users' => User::whereDoesntHave('payments', fn ($q) => $q->where('status', 'success'))->count(),
            'total_revenue' => Payment::where('status', 'success')->sum('amount'),
        ];

        return Inertia::render('Admin/Subscribers/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'filter' => $filter,
            ],
        ]);
    }

    public function export(): StreamedResponse
    {
        $fileName = 'users-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'ID', 'Name', 'Email', 'Phone Number', 'Has Paid', 'Payment Count', 'Latest Payment Ref',
                'Amount (GHS)', 'Subscription Active', 'Expires At', 'Email Verified', 'Registered At',
            ]);

            User::with(['payments' => function ($q) {
                $q->where('status', 'success')->latest();
            }, 'subscriptions' => function ($q) {
                $q->latest();
            }])
                ->withCount(['payments as successful_payments_count' => function ($q) {
                    $q->where('status', 'success');
                }])
                ->orderByDesc('id')
                ->chunk(500, function ($chunk) use ($handle) {
                    foreach ($chunk as $user) {
                        $latestPayment = $user->payments->first();
                        $latestSubscription = $user->subscriptions->first();

                        fputcsv($handle, [
                            $user->id,
                            $user->name,
                            $user->email,
                            $user->phone_number,
                            $user->successful_payments_count > 0 ? 'Yes' : 'No',
                            $user->successful_payments_count,
                            $latestPayment?->reference,
                            $latestPayment?->amount ? number_format($latestPayment->amount / 100, 2) : null,
                            $latestSubscription?->isActive() ? 'Yes' : 'No',
                            $latestSubscription?->expires_at?->toDateTimeString(),
                            $user->email_verified_at ? 'Yes' : 'No',
                            $user->created_at?->toDateTimeString(),
                        ]);
                    }
                });

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv',
            'Cache-Control' => 'no-store, no-cache',
        ]);
    }
}
