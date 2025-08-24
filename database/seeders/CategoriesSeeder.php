<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Web Development', 'slug' => 'web-development'],
            ['name' => 'Mobile Development', 'slug' => 'mobile-development'],
            ['name' => 'System Administration', 'slug' => 'system-administration'],
            ['name' => 'Database Administration', 'slug' => 'database-administration'],
            ['name' => 'Quality Assurance', 'slug' => 'quality-assurance'],
            ['name' => 'DevOps', 'slug' => 'devops'],
            ['name' => 'Artificial Intelligence', 'slug' => 'artificial-intelligence'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'UX/UI Design', 'slug' => 'ux-ui-design'],
            ['name' => 'Frontend Development', 'slug' => 'frontend-development'],
            ['name' => 'Backend Development', 'slug' => 'backend-development'],
            ['name' => 'Fullstack Development', 'slug' => 'fullstack-development'],
            ['name' => 'Accounting', 'slug' => 'accounting'],
            ['name' => 'Agriculture', 'slug' => 'agriculture'],
            ['name' => 'Animal Care', 'slug' => 'animal-care'],
            ['name' => 'Animal Science', 'slug' => 'animal-science'],
            ['name' => 'Anthropology', 'slug' => 'anthropology'],
            ['name' => 'Archaeology', 'slug' => 'archaeology'],
            ['name' => 'Architecture', 'slug' => 'architecture'],
            ['name' => 'Art', 'slug' => 'art'],
            ['name' => 'Art History', 'slug' => 'art-history'],
            ['name' => 'Astronomy', 'slug' => 'astronomy'],
            ['name' => 'Biology', 'slug' => 'biology'],
            ['name' => 'Botany', 'slug' => 'botany'],
            ['name' => 'Business', 'slug' => 'business'],
            ['name' => 'Chemistry', 'slug' => 'chemistry'],
            ['name' => 'Computer Science', 'slug' => 'computer-science'],
            ['name' => 'Counseling', 'slug' => 'counseling'],
            ['name' => 'Criminology', 'slug' => 'criminology'],
            ['name' => 'Dance', 'slug' => 'dance'],
            ['name' => 'Drama', 'slug' => 'drama'],
            ['name' => 'Economics', 'slug' => 'economics'],
            ['name' => 'Education', 'slug' => 'education'],
            ['name' => 'Electrical Engineering', 'slug' => 'electrical-engineering'],
            ['name' => 'Engineering', 'slug' => 'engineering'],
            ['name' => 'English', 'slug' => 'english'],
            ['name' => 'Environmental Science', 'slug' => 'environmental-science'],
            ['name' => 'Ethics', 'slug' => 'ethics'],
            ['name' => 'Finance', 'slug' => 'finance'],
            ['name' => 'Foreign Language', 'slug' => 'foreign-language'],
            ['name' => 'Geography', 'slug' => 'geography'],
            ['name' => 'Geology', 'slug' => 'geology'],
            ['name' => 'History', 'slug' => 'history'],
            ['name' => 'Humanities', 'slug' => 'humanities'],
            ['name' => 'Information Technology', 'slug' => 'information-technology'],
            ['name' => 'International Business', 'slug' => 'international-business'],
            ['name' => 'International Relations', 'slug' => 'international-relations'],
            ['name' => 'Journalism', 'slug' => 'journalism'],
            ['name' => 'Law', 'slug' => 'law'],
            ['name' => 'Management', 'slug' => 'management'],
            ['name' => 'Marketing', 'slug' => 'marketing'],
            ['name' => 'Mathematics', 'slug' => 'mathematics'],
            ['name' => 'Mechanical Engineering', 'slug' => 'mechanical-engineering'],
            ['name' => 'Media Studies', 'slug' => 'media-studies'],
            ['name' => 'Medicine', 'slug' => 'medicine'],
            ['name' => 'Nursing', 'slug' => 'nursing'],
            ['name' => 'Philosophy', 'slug' => 'philosophy'],
            ['name' => 'Physics', 'slug' => 'physics'],
            ['name' => 'Political Science', 'slug' => 'political-science'],
            ['name' => 'Psychology', 'slug' => 'psychology'],
            ['name' => 'Public Health', 'slug' => 'public-health'],
            ['name' => 'Public Relations', 'slug' => 'public-relations'],
            ['name' => 'Religion', 'slug' => 'religion'],
            ['name' => 'Sociology', 'slug' => 'sociology'],
            ['name' => 'Statistics', 'slug' => 'statistics'],
            ['name' => 'Theater', 'slug' => 'theater'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

