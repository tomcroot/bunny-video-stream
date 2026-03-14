<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Schedule::command('sitemap:generate')->daily();

Schedule::command('sitemap:generate')->everyTenMinutes();

// Failsafe reconciliation for payments stuck in initialized state
// (for example if callback/webhook delivery is delayed or interrupted).
Schedule::command('payments:reconcile --age=15')->everyFiveMinutes()->withoutOverlapping();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
