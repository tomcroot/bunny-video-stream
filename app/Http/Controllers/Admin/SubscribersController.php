<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubscribersController extends Controller
{
    public function index(Request $request)
    {
        $subscriptions = Subscription::with(['user', 'payment'])
            ->latest()
            ->paginate(25)
            ->through(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'user_name' => $subscription->user?->name,
                    'user_email' => $subscription->user?->email,
                    'payment_reference' => $subscription->payment?->reference,
                    'payment_status' => $subscription->payment?->status,
                    'amount' => $subscription->payment?->amount,
                    'expires_at' => $subscription->expires_at,
                    'created_at' => $subscription->created_at,
                    'is_active' => $subscription->isActive(),
                ];
            });

        return Inertia::render('Admin/Subscribers/Index', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function export(): StreamedResponse
    {
        $fileName = 'subscribers-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'ID', 'Name', 'Email', 'Payment Ref', 'Payment Status', 'Amount (GHS)', 'Active', 'Expires At', 'Created At',
            ]);

            Subscription::with(['user', 'payment'])
                ->orderByDesc('id')
                ->chunk(500, function ($chunk) use ($handle) {
                    foreach ($chunk as $subscription) {
                        fputcsv($handle, [
                            $subscription->id,
                            $subscription->user?->name,
                            $subscription->user?->email,
                            $subscription->payment?->reference,
                            $subscription->payment?->status,
                            $subscription->payment?->amount ? number_format($subscription->payment->amount / 100, 2) : null,
                            $subscription->isActive() ? 'Yes' : 'No',
                            optional($subscription->expires_at)?->toDateTimeString(),
                            optional($subscription->created_at)?->toDateTimeString(),
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
