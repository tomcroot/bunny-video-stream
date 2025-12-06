<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reference',
        'amount',
        'currency',
        'status',
        'channel',
        'gateway_response',
        'authorization_code',
        'paid_at',
        'meta',
        'verify_attempts',
        'last_verify_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'paid_at' => 'datetime',
        'last_verify_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
