<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHasPaid
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return redirect()->route('login')->with('status', 'Please sign in first.');
        }

        // Admins get free access to watch page
        if ($user->hasRole('admin')) {
            return $next($request);
        }

        // Non-admin users must have successful payment or active subscription
        if (! $user->hasSuccessfulPayment() && ! $user->hasActiveSubscription()) {
            return redirect()->route('payment.checkout')->with('status', 'Complete your payment to watch the movie.');
        }

        return $next($request);
    }
}
