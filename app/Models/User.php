<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'avatar',
        'bio',
        'gender',
        'birthdate',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'country',
        'state',
        'city',
        'address',
        'latitude',
        'longitude',
        'profession',
        'years_of_experience',
        'rating_average',
        'reviews_count',
        'profile_completion',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'avatar_verified_at' => 'datetime',
            'birthdate' => 'date',
            'latitude' => 'decimal:6',
            'longitude' => 'decimal:6',
            'rating_average' => 'decimal:2',
            'profile_completion' => 'integer',
            'password' => 'hashed',
        ];
    }

    /**
     * Relations
     */

    // Availability (work schedule)
    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }

    // Skills
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skills')
            ->withTimestamps();
    }

    // Categories
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'user_categories')
            ->withTimestamps();
    }

    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    // Reviews given by this user (as reviewer)
    public function reviewsGiven(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    // Reviews received by this user (as provider)
    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'provider_id');
    }

    // Calculate average rating for providers
    public function averageRating(): float
    {
        return $this->reviewsReceived()->avg('rating') ?? 0.0;
    }

    // Count total reviews for providers
    public function totalReviews(): int
    {
        return $this->reviewsReceived()->count();
    }

    public function hasReviewed(User $provider): bool
    {
        return $this->reviewsGiven()->where('provider_id', $provider->id)->exists();
    }
}
