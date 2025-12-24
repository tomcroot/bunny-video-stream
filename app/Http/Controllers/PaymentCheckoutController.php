<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentCheckoutController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // If user already has successful payment or active subscription, redirect to watch
        if ($user && ($user->hasSuccessfulPayment() || $user->hasActiveSubscription())) {
            return redirect()->route('watch')->with('status', 'You already have access to the movie!');
        }

        return Inertia::render('Payment', [
            'user' => $user,
            'alreadyPaid' => false, // Will always be false due to above check
        ]);
    }
}
