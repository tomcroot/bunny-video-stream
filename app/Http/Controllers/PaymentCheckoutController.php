<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentCheckoutController extends Controller
{
    public function __construct(
        private readonly ReferralService $referralService
    ) {}

    public function index(Request $request)
    {
        /** @var User|null $user */
        $user = Auth::user();

        // If user already has successful payment or active subscription, redirect to watch
        if ($user && ($user->hasSuccessfulPayment() || $user->hasActiveSubscription())) {
            return redirect()->route('watch')->with('status', 'You already have access to the movie!');
        }

        // ⭐ FIX #4: Get movieId from query param and pass to view
        $movieId = $request->query('movieId', 1);  // Default to 1 if not provided
        $prefilledReferralCode = strtoupper((string) ($request->query('ref') ?? $request->session()->get('referral_code', '')));

        if ($prefilledReferralCode !== '') {
            $isValidReferral = $this->referralService->getCodeByString($prefilledReferralCode)?->is_active ?? false;

            if (! $isValidReferral) {
                $prefilledReferralCode = '';
                $request->session()->forget('referral_code');
            } else {
                $request->session()->put('referral_code', $prefilledReferralCode);
            }
        }

        // Evaluate access status (avoids static analyzer false positives)
        $hasPayment = $user ? $user->hasSuccessfulPayment() : false;
        $hasSubscription = $user ? $user->hasActiveSubscription() : false;

        Log::info('Payment checkout page accessed', [
            'user_id' => $user?->id,
            'movie_id' => $movieId,
            'has_payment' => $hasPayment,
            'has_subscription' => $hasSubscription,
        ]);

        return Inertia::render('Payment', [
            'user' => $user,
            'alreadyPaid' => false,
            'movieId' => $movieId,  // ← PASS TO FRONTEND
            'prefilledReferralCode' => $prefilledReferralCode,
        ]);
    }
}
