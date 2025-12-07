<?php

namespace App\Http\Controllers;

use App\Models\WatchProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WatchProgressController extends Controller
{
    /**
     * Get watch progress for a video
     * Returns current_time to resume from, or 0 if new video
     */
    public function show(Request $request, string $videoId)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['current_time' => 0, 'total_duration' => 0], 200);
        }

        $progress = WatchProgress::where('user_id', $user->id)
            ->where('video_id', $videoId)
            ->first();

        return response()->json([
            'current_time' => $progress?->current_time ?? 0,
            'total_duration' => $progress?->total_duration ?? 0,
        ]);
    }

    /**
     * Update watch progress
     * Called every 10-30 seconds while video is playing
     */
    public function update(Request $request, string $videoId)
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'current_time' => 'required|integer|min:0',
            'total_duration' => 'required|integer|min:0',
            'video_title' => 'required|string|max:255',
        ]);

        // Create or update progress record
        WatchProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'video_id' => $videoId,
            ],
            [
                'current_time' => $validated['current_time'],
                'total_duration' => $validated['total_duration'],
                'video_title' => $validated['video_title'],
            ]
        );

        return response()->json(['success' => true]);
    }

    /**
     * Get all continue watching items for user
     */
    public function getContinueWatching()
    {
        $user = Auth::user();

        if (! $user) {
            return response()->json([]);
        }

        return WatchProgress::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($progress) {
                return [
                    'id' => $progress->id,
                    'video_id' => $progress->video_id,
                    'title' => $progress->video_title,
                    'current_time' => $progress->current_time,
                    'total_duration' => $progress->total_duration,
                    'progress' => $progress->getProgressPercentage(),
                    'time_left' => $this->formatTimeLeft($progress),
                    'updated_at' => $progress->updated_at->diffForHumans(),
                ];
            })
            ->filter(function ($item) {
                // Only show items that are <95% watched and <30 days old
                return $item['progress'] < 95;
            })
            ->values();
    }

    /**
     * Format remaining time string (e.g., "1h 02m left")
     */
    private function formatTimeLeft(WatchProgress $progress): string
    {
        $remaining = $progress->total_duration - $progress->current_time;

        if ($remaining <= 0) {
            return 'Finished';
        }

        $hours = intdiv($remaining, 3600);
        $minutes = intdiv($remaining % 3600, 60);

        if ($hours > 0) {
            return "{$hours}h {$minutes}m left";
        }

        return "{$minutes}m left";
    }
}
