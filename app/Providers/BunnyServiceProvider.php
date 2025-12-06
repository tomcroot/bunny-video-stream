<?php

namespace App\Providers;

use App\Services\BunnyVideoService;
use Illuminate\Support\ServiceProvider;

class BunnyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(BunnyVideoService::class, function ($app) {
            return new BunnyVideoService;
        });

        $this->app->alias(BunnyVideoService::class, 'bunny');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
