// ...existing code...
<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PageController::class, 'index'])->name('home');

Route::get('/details', [PageController::class, 'information'])->name('details');
Route::post('/reviews', [\App\Http\Controllers\ReviewSubmissionController::class, 'store'])->name('reviews.store');

Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

Route::get('/terms', [PageController::class, 'terms'])->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::get('/gallery', [PageController::class, 'gallery'])->name('gallery');

// SEO Routes
Route::get('/sitemap.xml', function () {
    return response()->file(public_path('sitemap.xml'));
})->name('sitemap');

// Fortify Authentication Routes
Route::middleware(['guest'])->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');

    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');

    Route::get('/forgot-password', function () {
        return Inertia::render('Auth/ForgotPassword');
    })->name('password.request');

    Route::get('/reset-password/{token}', function ($token) {
        return Inertia::render('Auth/ResetPassword', ['token' => $token]);
    })->name('password.reset');

    // OTP endpoints disabled: registration now handled by /register-and-pay
    // Route::post('/otp/send', [\App\Http\Controllers\Auth\OtpController::class, 'send']);
    // Route::post('/otp/verify-register', [\App\Http\Controllers\Auth\OtpController::class, 'verifyRegister']);
    // Route::post('/otp/send-password-reset', [\App\Http\Controllers\Auth\OtpController::class, 'sendPasswordReset']);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/verify-email', function () {
        return Inertia::render('Auth/VerifyEmail');
    })->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (Illuminate\Foundation\Auth\EmailVerificationRequest $request) {
        $request->fulfill();

        return redirect('/')->with('message', 'Email verified successfully!');
    })->middleware(['signed'])->name('verification.verify');

    Route::post('/email/verification-notification', function (Illuminate\Http\Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('message', 'Verification link sent!');
    })->middleware(['throttle:6,1'])->name('verification.send');

    Route::get('/confirm-password', function () {
        return Inertia::render('Auth/ConfirmPassword');
    })->name('password.confirm');

    Route::get('/two-factor-challenge', function () {
        return Inertia::render('Auth/TwoFactorChallenge');
    })->name('two-factor.login');

    // Admin routes
    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('banners', \App\Http\Controllers\Admin\BannerController::class);
        Route::resource('gallery', \App\Http\Controllers\Admin\GalleryController::class);
        Route::resource('cast-crew', \App\Http\Controllers\Admin\CastCrewController::class)->parameters(['cast-crew' => 'castCrew']);
        Route::resource('page-content', \App\Http\Controllers\Admin\PageContentController::class)->parameters(['page-content' => 'pageContent']);
        Route::get('watch-analytics', [\App\Http\Controllers\Admin\WatchAnalyticsController::class, 'index'])->name('watch-analytics');
        Route::resource('reviews', \App\Http\Controllers\Admin\ReviewController::class);
        Route::patch('reviews/{review}/approve', [\App\Http\Controllers\Admin\ReviewController::class, 'approve'])->name('reviews.approve');

        // File Upload
        Route::post('upload/image', [\App\Http\Controllers\Admin\UploadController::class, 'uploadImage'])->name('upload.image');
        Route::delete('upload/image', [\App\Http\Controllers\Admin\UploadController::class, 'deleteImage'])->name('upload.delete');

        // Referral Code Management
        Route::prefix('referral-codes')->name('referral-codes.')->controller(\App\Http\Controllers\ReferralCodeController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('{code}/stats', 'stats')->name('stats');
            Route::patch('{code}/activate', 'activate')->name('activate');
            Route::patch('{code}/deactivate', 'deactivate')->name('deactivate');
        });

        // SMS & Email routes disabled - automated emails/SMS triggered on payment events instead
        // See BulkSmsService and PaymentSuccessEmail for automation

        // Analytics Dashboard
        Route::get('analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('analytics');

        // Settings Management
        Route::get('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
        Route::post('settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
        Route::post('settings/{key}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateSingle'])->name('settings.update-single');

        // Environment Settings Management (dev password protected)
        Route::get('env-settings', [\App\Http\Controllers\Admin\EnvSettingsController::class, 'index'])->name('env-settings.index');
        Route::post('env-settings', [\App\Http\Controllers\Admin\EnvSettingsController::class, 'update'])->name('env-settings.update');
        Route::post('env-settings/verify-password', [\App\Http\Controllers\Admin\EnvSettingsController::class, 'verifyPassword'])->name('env-settings.verify-password');
        Route::post('env-settings/send-otp', [\App\Http\Controllers\Admin\EnvSettingsController::class, 'sendOtp'])->name('env-settings.send-otp');
        Route::post('env-settings/verify-otp', [\App\Http\Controllers\Admin\EnvSettingsController::class, 'verifyOtp'])->name('env-settings.verify-otp');
        Route::post('env-settings/lock', [\App\Http\Controllers\Admin\EnvSettingsController::class, 'lock'])->name('env-settings.lock');

        // Subscribers
        Route::get('subscribers', [\App\Http\Controllers\Admin\SubscribersController::class, 'index'])->name('subscribers.index');
        Route::get('subscribers/export', [\App\Http\Controllers\Admin\SubscribersController::class, 'export'])->name('subscribers.export');
    });

    // Streamer Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\StreamerDashboardController::class, 'index'])->name('dashboard');

    // Profile Management
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [\App\Http\Controllers\ProfileController::class, 'updatePassword'])->name('profile.password');

    // Two-Factor Authentication Management
    Route::get('/account/two-factor', [\App\Http\Controllers\TwoFactorAuthenticationController::class, 'show'])->name('two-factor.settings');
    Route::post('/user/two-factor-authentication', [\App\Http\Controllers\TwoFactorAuthenticationController::class, 'store'])->name('two-factor.enable');
    Route::post('/user/confirmed-two-factor-authentication', [\App\Http\Controllers\TwoFactorAuthenticationController::class, 'confirm'])->name('two-factor.confirm');
    Route::delete('/user/two-factor-authentication', [\App\Http\Controllers\TwoFactorAuthenticationController::class, 'destroy'])->name('two-factor.disable');
    Route::delete('/profile', [\App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/payments', [\App\Http\Controllers\PaymentHistoryController::class, 'index'])->name('profile.payments');

    // Protected routes will go here
    // Payments: initialize transaction (requires authenticated user)
    Route::post('/payments/init', [PaymentController::class, 'init'])->name('payments.init');
    Route::get('/payments/status/{reference}', [PaymentController::class, 'status'])
        ->name('payments.status');
    // Watch progress tracking (for resume functionality)
    Route::prefix('api/watch-progress')->controller(\App\Http\Controllers\WatchProgressController::class)->group(function () {
        Route::get('/{videoId}', 'show');
        Route::post('/{videoId}', 'update');
        Route::get('/', 'getContinueWatching');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Email verified routes will go here
});

// Protected streaming route requiring successful payment
Route::get('/watch', [\App\Http\Controllers\WatchController::class, 'index'])
    ->middleware(['auth', 'paid'])
    ->name('watch');

// Fallback route for video/banner IDs (UUIDs or numeric IDs) - redirect to watch
Route::get('/{id}', function ($id) {
    // Only match UUID or numeric patterns
    if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\d+$/i', $id)) {
        return redirect('/watch');
    }
    abort(404);
})->where('id', '[0-9a-f\-]+|[0-9]+');

// Paystack callback after payment completion
Route::get('/payment', [PaymentController::class, 'callback'])->name('payments.callback');

// Payment page (accessible to guests and authenticated users)
Route::get('/payment/checkout', [\App\Http\Controllers\PaymentCheckoutController::class, 'index'])->name('payment.checkout');

// Referral Code endpoints (public - can be used by anyone)
Route::prefix('api/referral')->name('referral.')->controller(\App\Http\Controllers\ReferralCodeController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/validate', 'validate')->name('validate');
    Route::post('/calculate-discount', 'calculateDiscount')->name('calculate-discount');
});

// Referral code validation for Inertia/Vue (form or AJAX)
Route::post('/referral/validate-discount', [\App\Http\Controllers\ReferralCodeController::class, 'validateDiscount'])->name('referral.validate-discount');

// Paystack webhook (server-to-server). Prefer a namespaced, plural path.
Route::post('/webhooks/paystack', [PaymentController::class, 'webhook'])->name('payments.webhook');

Route::get('/health', function () {
    try {
        // Check database
        DB::connection()->getPdo();

        // Check Redis
        Cache::store('redis')->get('health_check');

        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'System unhealthy',
        ], 503);
    }
})->withoutMiddleware(\App\Http\Middleware\HandleInertiaRequests::class);
