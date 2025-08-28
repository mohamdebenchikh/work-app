<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ensure reviewer_id and provider_id are distinct users
        $reviewer = User::inRandomOrder()->first();
        $provider = User::where('id', '!=', $reviewer->id)->inRandomOrder()->first();

        return [
            'reviewer_id' => $reviewer->id,
            'provider_id' => $provider->id,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->paragraph(),
        ];
    }
}
