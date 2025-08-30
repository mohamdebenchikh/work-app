<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingUpdatedNotification extends Notification implements ShouldQueue
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
        $updaterName = $notifiable->id === $this->booking->client_id 
            ? $this->booking->provider->name 
            : $this->booking->client->name;

        $mail = (new MailMessage)
            ->subject("Booking Updated: {$serviceName} - {$scheduledAt}")
            ->line("Your booking for {$serviceName} has been updated by {$updaterName}.");

        // If status changed, add a line about it
        if ($this->previousStatus !== $this->booking->status) {
            $statusMap = [
                'pending' => 'pending',
                'confirmed' => 'confirmed',
                'in_progress' => 'in progress',
                'completed' => 'completed',
                'cancelled' => 'cancelled',
                'rejected' => 'rejected',
            ];
            
            $oldStatus = $statusMap[$this->previousStatus] ?? $this->previousStatus;
            $newStatus = $statusMap[$this->booking->status] ?? $this->booking->status;
            
            $mail->line("**Status changed from:** " . ucfirst($oldStatus) . ", **to:** " . ucfirst($newStatus));
        }

        // If scheduled time changed, add a line about it
        if ($this->booking->wasChanged('scheduled_at')) {
            $mail->line("**New scheduled time:** {$scheduledAt}");
        }

        // If notes were updated, add them
        if ($this->booking->wasChanged('notes') && $this->booking->notes) {
            $mail->line("**Updated notes:** {$this->booking->notes}");
        }

        return $mail->action('View Booking', route('bookings.show', $this->booking->id))
                   ->line('If you have any questions, please contact the other party directly.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_updated',
            'booking_id' => $this->booking->id,
            'service_name' => $this->booking->providerService->title,
            'updater_id' => $notifiable->id === $this->booking->client_id 
                ? $this->booking->provider_id 
                : $this->booking->client_id,
            'updater_name' => $notifiable->id === $this->booking->client_id 
                ? $this->booking->provider->name 
                : $this->booking->client->name,
            'previous_status' => $this->previousStatus,
            'new_status' => $this->booking->status,
            'scheduled_at' => $this->booking->scheduled_at->toDateTimeString(),
            'changes' => $this->booking->getChanges(),
        ];
    }
}
