<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RenewalReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $movieTitle;

    protected $daysRemaining;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $movieTitle, int $daysRemaining)
    {
        $this->movieTitle = $movieTitle;
        $this->daysRemaining = $daysRemaining;
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
                ->message("Reminder: Your access to '{$this->movieTitle}' expires in {$this->daysRemaining} days. Renew now to continue watching!");
        }

        return (new MailMessage)
            ->subject('Access Expiring Soon')
            ->line("Your access to '{$this->movieTitle}' will expire in {$this->daysRemaining} days.")
            ->action('Renew Now', url('/renew'));
    }

    /**
     * Get the mail representation of the notification (fallback).
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Access Expiring Soon')
            ->line("Your access to '{$this->movieTitle}' will expire in {$this->daysRemaining} days.")
            ->line('Renew your subscription to continue enjoying unlimited streaming.')
            ->action('Renew Now', url('/renew'))
            ->line('Thank you for being a valued subscriber!');
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
            'days_remaining' => $this->daysRemaining,
        ];
    }
}
