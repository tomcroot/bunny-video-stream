<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentHistoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $payments = Payment::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $hasAccess = $user->hasSuccessfulPayment();

        return Inertia::render('Profile/Payments', [
            'payments' => $payments,
            'hasAccess' => $hasAccess,
        ]);
    }
}
