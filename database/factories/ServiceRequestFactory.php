<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ServiceRequestFactory extends Factory
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
            'category_id' => Category::all()->random()->id,
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'budget' => fake()->randomFloat(2, 50, 1000),
            'deadline_date' => fake()->dateTimeBetween('+1 week', '+1 month'),
            'expected_duration' => fake()->randomElement(['1-3 days', '1 week', '2 weeks', '1 month']),
            'country' => 'morocco',
            'address' => fake()->address(),
            'city' => 'fes',
            'latitude' => fake()->latitude(30, 31),
            'longitude' => fake()->longitude(30, 31),
            'status' => fake()->randomElement(['open', 'in_progress', 'completed', 'canceled']),
        ];
    }
}
