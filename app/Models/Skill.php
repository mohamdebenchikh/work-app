<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug'
    ];

    // Users that have this skill
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_skills')
            ->withTimestamps();
    }
}
