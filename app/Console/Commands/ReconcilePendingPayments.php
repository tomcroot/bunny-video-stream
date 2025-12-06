<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Services\PaystackService;
use Illuminate\Console\Command;

class ReconcilePendingPayments extends Command
{
    protected $signature = 'payments:reconcile {--age=15 : Minutes since initialization to consider a payment stale}';

    protected $description = 'Verify and update stale / pending Paystack payments (initialized)';

    public function handle(PaystackService $paystack): int
    {
        $ageMinutes = (int) $this->option('age');
        $cutoff = now()->subMinutes($ageMinutes);

        $query = Payment::where('status', 'initialized')
            ->where('created_at', '<=', $cutoff);

        $count = $query->count();
        if ($count === 0) {
            $this->info('No stale payments found.');

            return self::SUCCESS;
        }

        $this->info("Reconciling {$count} stale payments...");

        $query->chunk(50, function ($payments) use ($paystack) {
            foreach ($payments as $payment) {
                $verify = $paystack->verify($payment->reference);
                $payment->increment('verify_attempts');
                $payment->last_verify_at = now();

                if ($verify['ok'] && ($verify['body']['status'] ?? false) === true) {
                    $data = $verify['body']['data'] ?? [];
                    $status = $data['status'] ?? 'failed';
                    $payment->channel = $data['channel'] ?? $payment->channel;
                    $payment->gateway_response = $data['gateway_response'] ?? $payment->gateway_response;
                    if ($status === 'success') {
                        $payment->status = 'success';
                        $payment->authorization_code = $data['authorization']['authorization_code'] ?? $payment->authorization_code;
                        $payment->paid_at = $payment->paid_at ?: now();
                    } elseif ($status === 'failed') {
                        $payment->status = 'failed';
                    } else {
                        // Treat anything else as abandoned after cutoff
                        $payment->status = 'abandoned';
                    }
                    $payment->save();
                } else {
                    // Gateway unreachable or reference not found -> mark abandoned
                    $payment->status = 'abandoned';
                    $payment->save();
                }
            }
        });

        $this->info('Reconciliation complete.');

        return self::SUCCESS;
    }
}
