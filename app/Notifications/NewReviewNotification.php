<?php

namespace App\Notifications;

use App\Models\Review;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Review $review;
    protected User $reviewer;

    /**
     * Create a new notification instance.
     */
    public function __construct(Review $review, User $reviewer)
    {
        $this->review = $review;
        $this->reviewer = $reviewer;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($notifiable->email_notifications_enabled) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('You received a new review!')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->reviewer->name . ' has left a new review on your profile.')
            ->line('Rating: ' . $this->review->rating . ' out of 5 stars.')
            ->action('View Review', route('providers.show', $notifiable->id, true) . '#reviews')
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_review',
            'review_id' => $this->review->id,
            'reviewer_id' => $this->reviewer->id,
            'reviewer_name' => $this->reviewer->name,
            'rating' => $this->review->rating,
            'comment' => $this->review->comment,
            'link' => route('providers.show', $notifiable->id, false) . '#reviews',
        ];
    }
}
