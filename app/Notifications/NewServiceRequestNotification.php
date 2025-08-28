<?php

namespace App\Notifications;

use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewServiceRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected ServiceRequest $serviceRequest;
    protected User $creator;

    /**
     * Create a new notification instance.
     */
    public function __construct(ServiceRequest $serviceRequest, User $creator)
    {
        $this->serviceRequest = $serviceRequest;
        $this->creator = $creator;
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
            ->subject('New Service Request in your category!')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new service request has been posted that matches your interests:')
            ->line('Title: ' . $this->serviceRequest->title)
            ->line('Budget: $' . $this->serviceRequest->budget)
            ->action('View Service Request', route('service-requests.show', $this->serviceRequest->id, true))
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
            'type' => 'new_service_request',
            'service_request_id' => $this->serviceRequest->id,
            'service_request_title' => $this->serviceRequest->title,
            'creator_id' => $this->creator->id,
            'creator_name' => $this->creator->name,
            'category_id' => $this->serviceRequest->category_id,
            'budget' => $this->serviceRequest->budget,
            'link' => route('service-requests.show', $this->serviceRequest->id, false),
        ];
    }
}
