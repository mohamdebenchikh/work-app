<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCompletedNotification extends Notification implements ShouldQueue
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
        $scheduledAt = $this->booking->scheduled_at->format('l, F j, Y');
        $price = number_format($this->booking->price, 2) . ' ' . strtoupper($this->booking->currency);

        $mail = (new MailMessage)
            ->subject("Service Completed: {$serviceName} - {$scheduledAt}")
            ->line("Your service '{$serviceName}' with {$providerName} has been marked as completed.")
            ->line("**Service Date:** {$scheduledAt}")
            ->line("**Amount Paid:** {$price}");

        // Add provider notes if available
        if ($this->booking->provider_notes) {
            $mail->line("**Provider Notes:** {$this->booking->provider_notes}");
        }

        // Add call to action for leaving a review
        $mail->action('Leave a Review', route('reviews.create', ['booking' => $this->booking->id]))
             ->line('Thank you for using our platform. We hope you had a great experience!');

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_completed',
            'booking_id' => $this->booking->id,
            'service_name' => $this->booking->providerService->title,
            'provider_name' => $this->booking->provider->name,
            'scheduled_at' => $this->booking->scheduled_at->toDateTimeString(),
            'price' => $this->booking->price,
            'currency' => $this->booking->currency,
            'completed_at' => now()->toDateTimeString(),
        ];
    }
}
