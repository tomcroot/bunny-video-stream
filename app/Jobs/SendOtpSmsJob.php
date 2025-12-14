<?php

namespace App\Jobs;

use App\Services\MNotifyService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendOtpSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The queue this job should be dispatched to.
     */
    public string $queue = 'otp';

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying.
     */
    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $phone,
        public string $message
    ) {}

    /**
     * Execute the job.
     */
    public function handle(MNotifyService $mNotify): void
    {
        $mNotify->sendSms($this->phone, $this->message);

        Log::info('OTP SMS job completed', [
            'phone' => $this->phone,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('OTP SMS job failed permanently', [
            'phone' => $this->phone,
            'error' => $exception->getMessage(),
        ]);
    }
}
