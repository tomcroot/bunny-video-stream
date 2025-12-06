<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'message',
        'cta_text',
        'cta_url',
        'image_url',
        'video_url',
        'trailer_url',
        'main_movie_url',
        'thumbnail_url',
        'target_date',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'target_date' => 'datetime',
        'is_active' => 'boolean',
    ];
}
