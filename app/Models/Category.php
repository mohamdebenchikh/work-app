<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
     use HasFactory;

     protected $fillable = [
        'name',
        'slug',
        'icon',
     ];

      /**
     * Relations
     */

    // Users that belong to this category
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_categories')
            ->withTimestamps();
    }

    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }
}
