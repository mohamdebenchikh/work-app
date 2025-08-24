<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SkillsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            'Accounting',
            'Architecture',
            'Baking',
            'Carpentry',
            'Culinary Arts',
            'Dancing',
            'Electrical Engineering',
            'Fashion Design',
            'Film Production',
            'Fine Arts',
            'Graphic Design',
            'Interior Design',
            'Journalism',
            'Landscaping',
            'Law',
            'Mechanical Engineering',
            'Music',
            'Nursing',
            'Painting',
            'Photography',
            'Plumbing',
            'Psychology',
            'Real Estate',
            'Sculpture',
            'Teaching',
            'Translation',
            'Writing',
        ];

        foreach ($skills as $skill) {
            Skill::create(['name' => $skill,'slug' => Str::slug($skill)]);
        }
    }
}

