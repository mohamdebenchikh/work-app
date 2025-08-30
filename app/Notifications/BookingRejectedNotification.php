<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    public $booking;

    /**
     * The previous status of the booking.
     *
     * @var string
     */
    public $previousStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking, string $previousStatus)
    {
        $this->booking = $booking;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $serviceName = $this->booking->providerService->title;
        $providerName = $this->booking->provider->name;
        $scheduledAt = $this->booking->scheduled_at->format('l, F j, Y \a\t g:i A');
        
        $mail = (new MailMessage)
            ->subject("Booking Rejected: {$serviceName}")
            ->line("We regret to inform you that your booking for '{$serviceName}' with {$providerName} has been rejected.")
            ->line("**Scheduled for:** {$scheduledAt}");

        if ($this->booking->rejection_reason) {
            $mail->line("**Reason for rejection:** {$this->booking->rejection_reason}")
                 ->line('You may want to contact the provider for more information or consider booking with another provider.');
        } else {
            $mail->line('The provider did not provide a specific reason for rejecting this booking.');
        }

        return $mail->action('Find Another Service', route('services.index'))
                   ->line('We apologize for any inconvenience this may have caused.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_rejected',
            'booking_id' => $this->booking->id,
            'service_name' => $this->booking->providerService->title,
            'provider_name' => $this->booking->provider->name,
            'previous_status' => $this->previousStatus,
            'scheduled_at' => $this->booking->scheduled_at->toDateTimeString(),
            'rejected_at' => now()->toDateTimeString(),
            'rejection_reason' => $this->booking->rejection_reason,
        ];
    }
}
