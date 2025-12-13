<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $table = 'page_content';

    protected $fillable = [
        'title',
        'poster',
        'backdrop',
        'synopsis',
        'logline',
        'rating',
        'runtime',
        'year',
        'genres',
        'metadata',
        'movie_url',
        'sponsors',
        'is_active',
    ];

    protected $casts = [
        'genres' => 'array',
        'metadata' => 'array',
        'sponsors' => 'array',
        'is_active' => 'boolean',
    ];
}
