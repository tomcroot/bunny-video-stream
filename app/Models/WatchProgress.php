<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WatchProgress extends Model
{
    protected $fillable = [
        'user_id',
        'video_id',
        'video_title',
        'current_time',
        'total_duration',
    ];

    protected $casts = [
        'current_time' => 'integer',
        'total_duration' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if video should still be in "Continue Watching"
     * (not watched more than 95% and not older than 30 days)
     */
    public function isWatchable(): bool
    {
        if ($this->total_duration === 0) {
            return false;
        }

        $percentWatched = ($this->current_time / $this->total_duration) * 100;

        // Hide if fully watched (>95%) or older than 30 days
        return $percentWatched < 95 && $this->updated_at->diffInDays() < 30;
    }

    /**
     * Get percentage watched for progress bar
     */
    public function getProgressPercentage(): int
    {
        if ($this->total_duration === 0) {
            return 0;
        }

        return (int) (($this->current_time / $this->total_duration) * 100);
    }
}
