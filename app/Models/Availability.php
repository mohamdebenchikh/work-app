<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{

    use HasFactory;

     protected $fillable = [
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    /**
     * Relation: كل فترة تابعة لمستخدم
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
