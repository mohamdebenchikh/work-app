<?php

namespace Database\Seeders;

use App\Models\ServiceRequest;
use Illuminate\Database\Seeder;
use App\Models\Skill;

class ServiceRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = Skill::all();

        ServiceRequest::factory()->count(100)->create()->each(function ($serviceRequest) use ($skills) {
            $serviceRequest->skills()->attach(
                $skills->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
    }
}
