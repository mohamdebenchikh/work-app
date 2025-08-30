<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'];
        $scheduledAt = $this->faker->dateTimeBetween('now', '+30 days');
        
        return [
            'client_id' => \App\Models\User::factory(),
            'provider_id' => \App\Models\User::factory(),
            'provider_service_id' => \App\Models\ProviderService::factory(),
            'scheduled_at' => $scheduledAt,
            'duration' => $this->faker->numberBetween(30, 240), // 30 mins to 4 hours
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'currency' => $this->faker->randomElement(['USD', 'EUR', 'GBP']),
            'location' => [
                'address' => $this->faker->address,
                'city' => $this->faker->city,
                'country' => $this->faker->country,
                'postal_code' => $this->faker->postcode,
                'lat' => $this->faker->latitude,
                'lng' => $this->faker->longitude,
            ],
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence : null,
            'status' => $this->faker->randomElement($statuses),
        ];
    }

    /**
     * Set the booking status to pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Set the booking status to confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    /**
     * Set the booking status to completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'scheduled_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    /**
     * Set the booking status to cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    /**
     * Set the booking to be in the past.
     */
    public function past(): static
    {
        return $this->state(fn (array $attributes) => [
            'scheduled_at' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    /**
     * Set the booking to be in the future.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'scheduled_at' => $this->faker->dateTimeBetween('+1 day', '+30 days'),
        ]);
    }
}
