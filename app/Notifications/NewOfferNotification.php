<?php

namespace App\Notifications;

use App\Models\Offer;
use App\Models\User;
use App\Models\ServiceRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOfferNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Offer $offer;
    protected User $offerer;
    protected ServiceRequest $serviceRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(Offer $offer, User $offerer, ServiceRequest $serviceRequest)
    {
        $this->offer = $offer;
        $this->offerer = $offerer;
        $this->serviceRequest = $serviceRequest;
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
            ->subject('New Offer on Your Service Request!')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->offerer->name . ' has made a new offer on your service request:')
            ->line('Service Request: ' . $this->serviceRequest->title)
            ->line('Offer Price: $' . $this->offer->price)
            ->action('View Offer', route('service-requests.show', $this->serviceRequest->id, true) . '#offers')
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
            'type' => 'new_offer',
            'offer_id' => $this->offer->id,
            'offerer_id' => $this->offerer->id,
            'offerer_name' => $this->offerer->name,
            'service_request_id' => $this->serviceRequest->id,
            'service_request_title' => $this->serviceRequest->title,
            'price' => $this->offer->price,
            'message' => $this->offer->message,
            'link' => route('service-requests.show', $this->serviceRequest->id, false) . '#offers',
        ];
    }
}
