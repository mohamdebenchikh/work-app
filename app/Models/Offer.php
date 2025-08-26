<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'service_request_id',
        'price',
        'message',
        'status',
    ];

    /**
     * Get the user that owns the Offer.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the request that the Offer belongs to.
     */
    public function serviceRequest()
    {
        return $this->belongsTo(ServiceRequest::class);
    }
}