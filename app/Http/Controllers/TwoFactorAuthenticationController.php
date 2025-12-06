<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;

class TwoFactorAuthenticationController extends Controller
{
    /**
     * Display the 2FA settings page.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        return Inertia::render('Account/TwoFactorSettings', [
            'userTwoFactorEnabled' => ! is_null($user->two_factor_secret),
            'recoveryCodes' => $user->recoveryCodes(),
        ]);
    }

    /**
     * Enable two-factor authentication and display QR code.
     */
    public function store(Request $request, TwoFactorAuthenticationProvider $provider)
    {
        $user = $request->user();

        if ($user->two_factor_secret) {
            return response()->json(['message' => 'Two-factor authentication already enabled'], 422);
        }

        $secret = $provider->generate($user);
        $qrCode = $provider->qrCode(config('app.name'), $user->email, $secret);

        return response()->json([
            'secret' => $secret,
            'qr_code' => $qrCode,
        ]);
    }

    /**
     * Confirm two-factor authentication.
     */
    public function confirm(Request $request, ConfirmTwoFactorAuthentication $confirm)
    {
        $request->validate(['code' => ['required', 'string']]);

        $confirmed = $confirm($request->user(), $request->code);

        if (! $confirmed) {
            return response()->json(['message' => 'Invalid two-factor authentication code'], 422);
        }

        return response()->json(['message' => 'Two-factor authentication confirmed']);
    }

    /**
     * Disable two-factor authentication.
     */
    public function destroy(Request $request, DisableTwoFactorAuthentication $disable)
    {
        $disable($request->user());

        return response()->json(['message' => 'Two-factor authentication disabled']);
    }
}
