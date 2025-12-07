<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentSuccessfulNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $movieTitle;

    protected $amount;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $movieTitle, float $amount)
    {
        $this->movieTitle = $movieTitle;
        $this->amount = $amount;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mnotify'];
    }

    /**
     * Get the mNotify SMS representation of the notification.
     */
    public function toMNotify(object $notifiable)
    {
        if (class_exists('\\Arhinful\\LaravelMNotify\\MNotifyMessage')) {
            return (new \Arhinful\LaravelMNotify\MNotifyMessage)
                ->message("Payment successful! Your access to '{$this->movieTitle}' has been activated. Amount: ₵{$this->amount}");
        }

        return (new MailMessage)
            ->subject('Payment Successful!')
            ->line("Your payment of ₵{$this->amount} for '{$this->movieTitle}' has been processed successfully.")
            ->action('Watch Now', url('/watch'));
    }

    /**
     * Get the mail representation of the notification (fallback).
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Successful!')
            ->line("Your payment of ₵{$this->amount} for '{$this->movieTitle}' has been processed successfully.")
            ->line('Your access has been activated.')
            ->action('Watch Now', url('/watch'))
            ->line('Thank you for your purchase!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'movie_title' => $this->movieTitle,
            'amount' => $this->amount,
        ];
    }
}
