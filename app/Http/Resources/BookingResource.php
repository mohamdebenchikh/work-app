<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client' => [
                'id' => $this->client_id,
                'name' => $this->whenLoaded('client', $this->client->name),
                'email' => $this->when(
                    $request->user() && ($request->user()->id === $this->client_id || $request->user()->id === $this->provider_id),
                    $this->whenLoaded('client', $this->client->email)
                ),
                'phone' => $this->when(
                    $request->user() && ($request->user()->id === $this->client_id || $request->user()->id === $this->provider_id),
                    $this->whenLoaded('client', $this->client->phone)
                ),
            ],
            'provider' => [
                'id' => $this->provider_id,
                'name' => $this->whenLoaded('provider', $this->provider->name),
                'email' => $this->when(
                    $request->user() && ($request->user()->id === $this->client_id || $request->user()->id === $this->provider_id),
                    $this->whenLoaded('provider', $this->provider->email)
                ),
                'phone' => $this->when(
                    $request->user() && ($request->user()->id === $this->client_id || $request->user()->id === $this->provider_id),
                    $this->whenLoaded('provider', $this->provider->phone)
                ),
            ],
            'service' => $this->whenLoaded('providerService', function () {
                return [
                    'id' => $this->providerService->id,
                    'title' => $this->providerService->title,
                    'description' => $this->providerService->description,
                    'price' => $this->providerService->price,
                    'currency' => $this->providerService->currency,
                    'category' => $this->providerService->category->name ?? null,
                ];
            }),
            'scheduled_at' => $this->scheduled_at->toIso8601String(),
            'duration' => $this->duration,
            'ends_at' => $this->scheduled_at->copy()->addMinutes($this->duration)->toIso8601String(),
            'price' => (float) $this->price,
            'currency' => $this->currency,
            'location' => $this->location,
            'notes' => $this->when($this->notes, $this->notes),
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'can_update' => $request->user() ? $request->user()->can('update', $this->resource) : false,
            'can_cancel' => $request->user() ? $request->user()->can('cancel', $this->resource) : false,
            'can_delete' => $request->user() ? $request->user()->can('delete', $this->resource) : false,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }

    /**
     * Get the human-readable status label.
     */
    protected function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'in_progress' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'rejected' => 'Rejected',
            default => ucfirst($this->status),
        };
    }
}
