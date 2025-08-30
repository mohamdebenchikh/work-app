<?php

namespace Database\Seeders;

use App\Models\ProviderService;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as FakerFactory;

class ProviderServiceSeeder extends Seeder
{
    /**
     * The Faker instance.
     *
     * @var \Faker\Generator
     */
    protected $faker;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->faker = FakerFactory::create();
        // Get all provider users
        $providers = User::where('role', 'provider')->get();
        
        // Get all category IDs
        $categoryIds = \App\Models\Category::pluck('id')->toArray();
        
        if ($providers->isEmpty() || empty($categoryIds)) {
            $this->command->info('No providers or categories found. Please seed users and categories first.');
            return;
        }
        
        $this->command->info('Creating provider services...');
        
        // Create 50-100 services
        $count = rand(50, 100);
        
        for ($i = 0; $i < $count; $i++) {
            $provider = $providers->random();
            
            // Create 1-5 services per provider
            $servicesCount = rand(1, 5);
            
            for ($j = 0; $j < $servicesCount; $j++) {
                $provider->services()->create([
                    'category_id' => $this->faker->randomElement($categoryIds),
                    'title' => $this->faker->sentence(3),
                    'description' => $this->faker->paragraph(3),
                    'price' => $this->faker->randomFloat(2, 10, 1000),
                    'country' => $this->faker->country,
                    'city' => $this->faker->city,
                    'is_local_only' => $this->faker->boolean(70),
                    'latitude' => $this->faker->latitude,
                    'longitude' => $this->faker->longitude,
                    'include_transport' => $this->faker->boolean(30),
                    'status' => $this->faker->randomElement(['draft', 'active', 'inactive']),
                ]);
            }
            
            // Show progress
            if (($i + 1) % 10 === 0) {
                $this->command->info("Created " . (($i + 1) * $servicesCount) . " services...");
            }
        }
        
        $this->command->info('Successfully created provider services!');
    }
}
