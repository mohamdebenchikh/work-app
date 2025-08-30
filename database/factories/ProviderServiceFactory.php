<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProviderService>
 */
class ProviderServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy'];
        $cities = [
            'United States' => ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
            'Canada' => ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
            'United Kingdom' => ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
            'Australia' => ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
            'Germany' => ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
            'France' => ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
            'Spain' => ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza'],
            'Italy' => ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'],
        ];

        $country = $this->faker->randomElement($countries);
        $city = $this->faker->randomElement($cities[$country]);

        return [
            'user_id' => null, // Will be set in the seeder
            'category_id' => null, // Will be set in the seeder
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'country' => $country,
            'city' => $city,
            'is_local_only' => $this->faker->boolean(70), // 70% chance of being local only
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'include_transport' => $this->faker->boolean(30), // 30% chance of including transport
            'status' => $this->faker->randomElement(['draft', 'active', 'inactive']),
        ];
    }
    
    /**
     * Set the service as active.
     */
    public function active()
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }
    
    /**
     * Set the service as inactive.
     */
    public function inactive()
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
