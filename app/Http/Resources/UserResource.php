<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserResource extends JsonResource
{

    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'phone' => $this->phone,
            'profession' => $this->profession,
            'gender' => $this->gender,
            'role' => $this->role,
            'birthdate' => $this->birthdate,
            'country' => $this->country,
            'state' => $this->state,
            'city' => $this->city,
            'address' => $this->address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'email_verified_at' => $this->email_verified_at,
            'skills' => SkillResource::collection($this->whenLoaded('skills')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'is_mine' => Auth::check() && Auth::id() === $this->id,
            'rating_average' => $this->whenNotNull($this->rating_average),
            'reviews_count' => $this->whenNotNull($this->reviews_count),
            'reviews_given_count' => $this->whenCounted('reviewsGiven'),
            'reviews_received_count' => $this->whenCounted('reviewsReceived'),
            'reviews_received' => ReviewResource::collection($this->whenLoaded('reviewsReceived')),
        ];
    }
}
