<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailVerificationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->from('no-reply@promiselandfilms.com', 'Promise - A Crazy Day in Accra')
            ->subject('Verify Your Promise Account Email')
            ->greeting("Welcome to Promise, {$notifiable->name}!")
            ->line('Thank you for creating an account with Promise. To get started, please verify your email address by clicking the button below.')
            ->action('Verify Email Address', $verificationUrl)
            ->line('If you did not create an account, no further action is required.')
            ->line('This verification link will expire in 24 hours.')
            ->salutation('Best regards, The Promise Team');
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        return url("/email/verify/{$notifiable->getKey()}/".sha1($notifiable->getEmailForVerification()).'?expires='.$notifiable->getEmailVerificationDueTime()->getTimestamp());
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
