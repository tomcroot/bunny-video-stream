<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Support\PhoneNumber;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);

        // Support phone number or email login
        Fortify::authenticateUsing(function (Request $request) {
            $input = $request->input(Fortify::username());

            // Check if input is email or phone
            if (filter_var($input, FILTER_VALIDATE_EMAIL)) {
                // Email login
                $user = \App\Models\User::where('email', $input)->first();
            } else {
                $phone = PhoneNumber::normalize($input);
                $user = $phone ? \App\Models\User::where('phone_number', $phone)->first() : null;
            }

            if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
                return $user;
            }

            return null;
        });

        // Configure Fortify to use Inertia views
        Fortify::loginView(fn () => inertia('Auth/Login'));
        Fortify::registerView(fn () => inertia('Auth/Register'));
        Fortify::requestPasswordResetLinkView(fn () => inertia('Auth/ForgotPassword'));
        Fortify::resetPasswordView(fn () => inertia('Auth/ResetPassword'));
        Fortify::confirmPasswordView(fn () => inertia('Auth/ConfirmPassword'));
        Fortify::twoFactorChallengeView(fn () => inertia('Auth/TwoFactorChallenge'));
        Fortify::verifyEmailView(fn () => inertia('Auth/VerifyEmail'));

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        // Password reset rate limiter: 5 per hour per email+ip
        RateLimiter::for('reset-password', function (Request $request) {
            $email = (string) $request->input('email');
            $ip = $request->ip();
            $key = Str::lower($email).'|'.$ip;

            return Limit::perHour(5)->by($key);
        });
    }
}
