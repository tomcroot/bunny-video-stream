<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CastCrew extends Model
{
    protected $table = 'cast_crew';

    protected $fillable = [
        'stage_name',
        'real_name',
        'role_type',
        'job_title',
        'image_url',
        'bio',
        'referral_code',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
