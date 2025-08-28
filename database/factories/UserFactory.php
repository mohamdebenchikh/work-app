<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'country' => 'morocco',
            'city' => 'fes',
            'address' => fake()->address(),
            'latitude' => fake()->latitude(30, 31),
            'longitude' => fake()->longitude(30, 31),
            'role' => fake()->randomElement(['provider', 'client']),
            'profession' => fake()->randomElement(['web developer', 'mobile developer', 'system administrator', 'database administrator']),
            'bio' => fake()->paragraph(2),
            'phone' => fake()->phoneNumber(),
            'gender' => fake()->randomElement(['male', 'female']),
            'birthdate' => fake()->date(),
            'years_of_experience' => fake()->numberBetween(1, 10),
            'rating_average' => fake()->numberBetween(1, 5),
            'reviews_count' => fake()->numberBetween(0, 100),
            'profile_completion' => 100,
            'profile_completed_at' => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
