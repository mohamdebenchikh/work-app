<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderService extends Model
{
    protected $fillable = [
        'category_id',
        'title',
        'description',
        'price',
        'country',
        'city',
        'is_local_only',
        'latitude',
        'longitude',
        'include_transport',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_local_only' => 'boolean',
        'include_transport' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
