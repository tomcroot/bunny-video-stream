<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WatchProgress;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WatchAnalyticsController extends Controller
{
    public function index()
    {
        // Total unique viewers
        $totalViewers = WatchProgress::distinct('user_id')->count();

        // Total watch time in hours
        $totalWatchTimeSeconds = WatchProgress::sum('current_time');
        $totalWatchTimeHours = round($totalWatchTimeSeconds / 3600, 1);

        // Average watch percentage
        $avgWatchPercentage = WatchProgress::whereColumn('total_duration', '>', DB::raw('0'))
            ->selectRaw('AVG((current_time / total_duration) * 100) as avg_percent')
            ->value('avg_percent') ?? 0;

        // Completion rate (viewers who watched 90%+)
        $completedViewers = WatchProgress::whereColumn('total_duration', '>', DB::raw('0'))
            ->whereRaw('(current_time / total_duration) >= 0.90')
            ->distinct('user_id')
            ->count();
        $completionRate = $totalViewers > 0 ? round(($completedViewers / $totalViewers) * 100, 1) : 0;

        // Viewers by day (last 30 days)
        $viewersByDay = WatchProgress::select(
            DB::raw('DATE(updated_at) as date'),
            DB::raw('COUNT(DISTINCT user_id) as viewers')
        )
            ->where('updated_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => Carbon::parse($item->date)->format('M d'),
                'viewers' => $item->viewers,
            ]);

        // Watch time distribution (how far people watch)
        $watchDistribution = $this->getWatchDistribution();

        // Top viewers (by watch time)
        $topViewers = WatchProgress::with('user:id,name,email')
            ->select('user_id', DB::raw('SUM(current_time) as total_time'), DB::raw('MAX(updated_at) as last_watched'))
            ->groupBy('user_id')
            ->orderByDesc('total_time')
            ->limit(10)
            ->get()
            ->map(fn ($item) => [
                'user' => $item->user?->name ?? 'Unknown',
                'email' => $item->user?->email ?? '',
                'total_time' => $this->formatDuration($item->total_time),
                'last_watched' => Carbon::parse($item->last_watched)->diffForHumans(),
            ]);

        // Recent activity
        $recentActivity = WatchProgress::with('user:id,name,email')
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get()
            ->map(fn ($item) => [
                'user' => $item->user?->name ?? 'Unknown',
                'video_title' => $item->video_title,
                'progress' => $item->getProgressPercentage(),
                'current_time' => $this->formatDuration($item->current_time),
                'updated_at' => $item->updated_at->diffForHumans(),
            ]);

        // Hourly viewing pattern
        $hourlyPattern = WatchProgress::select(
            DB::raw('HOUR(updated_at) as hour'),
            DB::raw('COUNT(*) as views')
        )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->hour => $item->views]);

        // Fill in missing hours
        $hourlyData = collect(range(0, 23))->map(fn ($hour) => [
            'hour' => sprintf('%02d:00', $hour),
            'views' => $hourlyPattern[$hour] ?? 0,
        ]);

        return Inertia::render('Admin/WatchAnalytics', [
            'stats' => [
                'totalViewers' => $totalViewers,
                'totalWatchTimeHours' => $totalWatchTimeHours,
                'avgWatchPercentage' => round($avgWatchPercentage, 1),
                'completionRate' => $completionRate,
                'completedViewers' => $completedViewers,
            ],
            'viewersByDay' => $viewersByDay,
            'watchDistribution' => $watchDistribution,
            'topViewers' => $topViewers,
            'recentActivity' => $recentActivity,
            'hourlyPattern' => $hourlyData,
        ]);
    }

    private function getWatchDistribution(): array
    {
        $ranges = [
            '0-10%' => [0, 10],
            '10-25%' => [10, 25],
            '25-50%' => [25, 50],
            '50-75%' => [50, 75],
            '75-90%' => [75, 90],
            '90-100%' => [90, 100],
        ];

        $distribution = [];
        foreach ($ranges as $label => [$min, $max]) {
            $count = WatchProgress::whereColumn('total_duration', '>', DB::raw('0'))
                ->whereRaw('(current_time / total_duration) * 100 >= ?', [$min])
                ->whereRaw('(current_time / total_duration) * 100 < ?', [$max === 100 ? 101 : $max])
                ->count();

            $distribution[] = [
                'range' => $label,
                'count' => $count,
            ];
        }

        return $distribution;
    }

    private function formatDuration(int $seconds): string
    {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);

        if ($hours > 0) {
            return sprintf('%dh %dm', $hours, $minutes);
        }

        return sprintf('%dm', $minutes);
    }
}
