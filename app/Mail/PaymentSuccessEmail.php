<?php

namespace App\Mail;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentSuccessEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Payment $payment,
        public Subscription $subscription,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment Successful - Your Video Access is Active',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-success',
            with: [
                'user' => $this->payment->user,
                'movie' => $this->subscription->movie,
                'expiresAt' => $this->subscription->expires_at,
                'amount' => $this->payment->amount,
                'transactionRef' => $this->payment->reference,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
