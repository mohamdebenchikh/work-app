<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ServiceRequest;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Offer>
 */
class OfferFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->id,
            'service_request_id' => ServiceRequest::all()->random()->id,
            'price' => fake()->randomFloat(2, 10, 500),
            'message' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'accepted', 'rejected']),
        ];
    }
}
