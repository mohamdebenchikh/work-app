<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCancelledNotification extends Notification implements ShouldQueue
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
        $scheduledAt = $this->booking->scheduled_at->format('l, F j, Y \a\t g:i A');
        $cancellerName = $notifiable->id === $this->booking->client_id 
            ? 'You' 
            : $this->booking->provider->name;
        $otherPartyName = $notifiable->id === $this->booking->client_id
            ? $this->booking->provider->name
            : 'you';

        $mail = (new MailMessage)
            ->subject("Booking Cancelled: {$serviceName}")
            ->line("The following booking has been cancelled by {$cancellerName}:")
            ->line("**Service:** {$serviceName}")
            ->line("**Scheduled for:** {$scheduledAt}");

        if ($this->booking->cancellation_reason) {
            $mail->line("**Reason for cancellation:** {$this->booking->cancellation_reason}");
        }

        if ($notifiable->id === $this->booking->client_id) {
            $mail->line('We\'re sorry to see this booking cancelled. You can book another appointment with this or another provider at any time.');
        } else {
            $mail->line('The client has been notified of this cancellation. If this was a mistake, please contact the client directly.');
        }

        return $mail->action('View Booking Details', route('bookings.show', $this->booking->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $isClient = $notifiable->id === $this->booking->client_id;
        
        return [
            'type' => 'booking_cancelled',
            'booking_id' => $this->booking->id,
            'service_name' => $this->booking->providerService->title,
            'cancelled_by' => $isClient ? 'client' : 'provider',
            'cancelled_by_name' => $isClient 
                ? $this->booking->client->name 
                : $this->booking->provider->name,
            'previous_status' => $this->previousStatus,
            'scheduled_at' => $this->booking->scheduled_at->toDateTimeString(),
            'cancelled_at' => now()->toDateTimeString(),
            'cancellation_reason' => $this->booking->cancellation_reason,
        ];
    }
}
