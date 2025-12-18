<?php

namespace App\Jobs;

use App\Mail\PaymentSuccessEmail;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPaymentSuccessEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // ...existing code...

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying.
     */
    public int $backoff = 30;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $paymentId,
        public int $subscriptionId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $payment = Payment::with('user')->findOrFail($this->paymentId);
        $subscription = Subscription::findOrFail($this->subscriptionId);

        Mail::send(new PaymentSuccessEmail($payment, $subscription));

        Log::info('Payment success email job completed', [
            'payment_id' => $this->paymentId,
            'subscription_id' => $this->subscriptionId,
            'email' => $payment->user->email,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Payment success email job failed permanently', [
            'payment_id' => $this->paymentId,
            'subscription_id' => $this->subscriptionId,
            'error' => $exception->getMessage(),
        ]);
    }
}
