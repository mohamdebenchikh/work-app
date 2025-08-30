<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    public $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
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
        $clientName = $this->booking->client->name;
        $scheduledAt = $this->booking->scheduled_at->format('l, F j, Y \a\t g:i A');
        $price = number_format($this->booking->price, 2) . ' ' . strtoupper($this->booking->currency);

        return (new MailMessage)
            ->subject("New Booking: {$serviceName} - {$scheduledAt}")
            ->line("You have a new booking for {$serviceName} from {$clientName}.")
            ->line("**Scheduled for:** {$scheduledAt}")
            ->line("**Duration:** {$this->booking->duration} minutes")
            ->line("**Price:** {$price}")
            ->line("**Notes:** " . ($this->booking->notes ?: 'No additional notes'))
            ->action('View Booking', route('provider.bookings.show', $this->booking->id))
            ->line('Please confirm or reject this booking as soon as possible.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_created',
            'booking_id' => $this->booking->id,
            'service_name' => $this->booking->providerService->title,
            'client_name' => $this->booking->client->name,
            'scheduled_at' => $this->booking->scheduled_at->toDateTimeString(),
            'price' => $this->booking->price,
            'currency' => $this->booking->currency,
        ];
    }
}
