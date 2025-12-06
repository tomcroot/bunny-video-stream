<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();

        $totalRevenue = Payment::where('status', 'completed')
            ->sum('amount');

        $completedPayments = Payment::where('status', 'completed')->count();
        $pendingPayments = Payment::where('status', 'initialized')->count();
        $failedPayments = Payment::where('status', 'failed')->count();

        $recentPayments = Payment::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'totalUsers' => $totalUsers,
                // Format total revenue to two decimal places (payments stored in cents)
                'totalRevenue' => number_format($totalRevenue / 100, 2, '.', ''),
                'completedPayments' => $completedPayments,
                'pendingPayments' => $pendingPayments,
                'failedPayments' => $failedPayments,
            ],
            'recentPayments' => $recentPayments,
        ]);
    }
}
