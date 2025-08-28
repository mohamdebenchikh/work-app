<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ServiceRequestResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'budget' => $this->budget,
            'deadline_date' => $this->deadline_date,
            'status' => $this->status,
            'country' => $this->country,
            'address' => $this->address,
            'city' => $this->city,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => UserResource::make($this->whenLoaded('user')),
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'offers_count' => $this->when(isset($this->offers_count), $this->offers_count),
            'top_offers' => OfferResource::collection($this->whenLoaded('topOffers')),
            'is_mine' => Auth::check() && Auth::id() === $this->user_id,
        ];
    }
}
