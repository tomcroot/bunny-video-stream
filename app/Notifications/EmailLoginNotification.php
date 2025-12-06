<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailLoginNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $loginTime;

    protected $ipAddress;

    protected $userAgent;

    /**
     * Create a new notification instance.
     */
    public function __construct(?string $ipAddress = null, ?string $userAgent = null)
    {
        $this->loginTime = now();
        $this->ipAddress = $ipAddress ?? request()->ip();
        $this->userAgent = $userAgent ?? request()->userAgent();
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
        return (new MailMessage)
            ->from('no-reply@promiselandfilms.com', 'Promise - A Crazy Day in Accra')
            ->subject('New Login to Your Promise Account')
            ->greeting("Hi {$notifiable->name},")
            ->line('We detected a new login to your Promise account.')
            ->line('**Login Details:**')
            ->line("📅 Time: {$this->loginTime->format('l, F j, Y \a\t g:i A')}")
            ->line("🌐 IP Address: {$this->ipAddress}")
            ->line('📱 Device: '.$this->getDeviceInfo())
            ->line('If this was you, no action is needed.')
            ->line('If you don\'t recognize this activity, please secure your account immediately by changing your password.')
            ->action('Change Password', url('/forgot-password'))
            ->line('For your security, we recommend enabling two-factor authentication.')
            ->salutation('Best regards, The Promise Team');
    }

    /**
     * Get device info from user agent
     */
    private function getDeviceInfo(): string
    {
        $agent = $this->userAgent;

        if (strpos($agent, 'Mobile') !== false || strpos($agent, 'Android') !== false) {
            return 'Mobile Device';
        } elseif (strpos($agent, 'iPad') !== false || strpos($agent, 'Tablet') !== false) {
            return 'Tablet';
        } else {
            return 'Desktop Computer';
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'login_time' => $this->loginTime,
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent,
        ];
    }
}
