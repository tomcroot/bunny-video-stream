<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;

class TwoFactorAuthenticationController extends Controller
{
    /**
     * Display the 2FA settings page.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Account/TwoFactorSettings', [
            'userTwoFactorEnabled' => ! is_null($user->two_factor_secret),
            'recoveryCodes' => $user->two_factor_recovery_codes
                ? json_decode(decrypt($user->two_factor_recovery_codes), true)
                : [],
        ]);
    }

    /**
     * Enable two-factor authentication and generate QR code.
     */
    public function store(
        Request $request,
        TwoFactorAuthenticationProvider $provider
    ) {
        $user = $request->user();

        if ($user->two_factor_secret) {
            return redirect()->back()
                ->withErrors(['two_factor' => 'Two-factor authentication is already enabled.']);
        }

        // Generate and save secret
        $provider->generate($user);

        // Generate QR code
        $qrCode = $provider->qrCode(
            config('app.name'),
            $user->email,
            decrypt($user->two_factor_secret)
        );

        return redirect()->back()->with([
            'two_factor_qr' => $qrCode,
            'two_factor_enabled' => true,
        ]);
    }

    /**
     * Confirm two-factor authentication.
     */
    public function confirm(
        Request $request,
        ConfirmTwoFactorAuthentication $confirm
    ) {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $confirmed = $confirm($request->user(), $request->code);

        if (! $confirmed) {
            return redirect()->back()
                ->withErrors(['code' => 'Invalid two-factor authentication code.']);
        }

        return redirect()->back()->with('success', 'Two-factor authentication confirmed.');
    }

    /**
     * Disable two-factor authentication.
     */
    public function destroy(
        Request $request,
        DisableTwoFactorAuthentication $disable
    ) {
        $disable($request->user());

        return redirect()->back()->with('success', 'Two-factor authentication disabled.');
    }
}
