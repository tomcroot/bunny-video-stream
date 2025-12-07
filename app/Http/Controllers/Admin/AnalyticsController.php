<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\WatchProgress;
use App\Services\BunnyAnalyticsService;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    protected $bunnyAnalytics;

    public function __construct(BunnyAnalyticsService $bunnyAnalytics)
    {
        $this->bunnyAnalytics = $bunnyAnalytics;
    }

    /**
     * Show analytics dashboard combining Bunny + Local stats
     */
    public function index()
    {
        // Get all active videos
        $videos = Banner::where('is_active', true)
            ->whereNotNull('video_url')
            ->get();

        $analytics = $videos->map(function ($video) {
            // Local stats from your database
            $localStats = $this->getLocalVideoStats($video->video_url);

            // Bunny stats (read-only, from their API)
            $bunnyStats = $this->bunnyAnalytics->getVideoStatistics($video->video_url);

            return [
                'id' => $video->id,
                'title' => $video->title,
                'video_id' => $video->video_url,
                'local' => [
                    'total_sessions' => $localStats['total_sessions'],
                    'total_watch_time' => $localStats['total_watch_time'],
                    'completion_rate' => $localStats['completion_rate'],
                    'avg_session_duration' => $localStats['avg_session_duration'],
                ],
                'bunny' => $bunnyStats ? $this->bunnyAnalytics->parseVideoStats($bunnyStats) : null,
            ];
        });

        return Inertia::render('Admin/Analytics', [
            'videos' => $analytics,
            'summary' => $this->getSummaryStats(),
        ]);
    }

    /**
     * Get local watch statistics from your database
     */
    private function getLocalVideoStats(string $videoId): array
    {
        $progress = WatchProgress::where('video_id', $videoId)->get();

        $totalSessions = $progress->count();
        $completedSessions = $progress->filter(fn ($p) => $p->getProgressPercentage() >= 95)->count();
        $totalWatchTime = $progress->sum('current_time');
        $avgDuration = $totalSessions > 0 ? $totalWatchTime / $totalSessions : 0;

        return [
            'total_sessions' => $totalSessions,
            'completed_sessions' => $completedSessions,
            'completion_rate' => $totalSessions > 0 ? ($completedSessions / $totalSessions) * 100 : 0,
            'total_watch_time' => $totalWatchTime,
            'avg_session_duration' => $avgDuration,
        ];
    }

    /**
     * Get summary statistics across all videos
     */
    private function getSummaryStats(): array
    {
        $allProgress = WatchProgress::all();

        return [
            'total_watch_sessions' => $allProgress->count(),
            'unique_viewers' => WatchProgress::distinct('user_id')->count(),
            'total_watch_time' => $allProgress->sum('current_time'),
            'avg_watch_time_per_session' => $allProgress->count() > 0
                ? $allProgress->sum('current_time') / $allProgress->count()
                : 0,
            'completion_rate' => $this->calculateOverallCompletionRate(),
        ];
    }

    /**
     * Calculate overall completion rate
     */
    private function calculateOverallCompletionRate(): float
    {
        $all = WatchProgress::all();
        $completed = $all->filter(fn ($p) => $p->getProgressPercentage() >= 95)->count();

        return $all->count() > 0 ? ($completed / $all->count()) * 100 : 0;
    }
}
