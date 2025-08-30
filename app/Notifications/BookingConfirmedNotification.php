<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmedNotification extends Notification implements ShouldQueue
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
        $providerName = $this->booking->provider->name;
        $scheduledAt = $this->booking->scheduled_at->format('l, F j, Y \a\t g:i A');
        $price = number_format($this->booking->price, 2) . ' ' . strtoupper($this->booking->currency);

        return (new MailMessage)
            ->subject("Booking Confirmed: {$serviceName} - {$scheduledAt}")
            ->line("Great news! Your booking for {$serviceName} with {$providerName} has been confirmed.")
            ->line("**Scheduled for:** {$scheduledAt}")
            ->line("**Duration:** {$this->booking->duration} minutes")
            ->line("**Price:** {$price}")
            ->line("**Provider Notes:** " . ($this->booking->provider_notes ?: 'No additional notes'))
            ->action('View Booking Details', route('bookings.show', $this->booking->id))
            ->line('We recommend adding this to your calendar. You can also contact the provider if you have any questions.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_confirmed',
            'booking_id' => $this->booking->id,
            'service_name' => $this->booking->providerService->title,
            'provider_name' => $this->booking->provider->name,
            'scheduled_at' => $this->booking->scheduled_at->toDateTimeString(),
            'price' => $this->booking->price,
            'currency' => $this->booking->currency,
        ];
    }
}
