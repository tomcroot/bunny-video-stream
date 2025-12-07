<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BunnyAnalyticsService
{
    private $apiKey;

    private $baseUrl = 'https://api.bunny.net/statistics';

    public function __construct()
    {
        $this->apiKey = config('services.bunny.api_key');
    }

    /**
     * Get aggregate video statistics from Bunny for a video
     * Returns: views, bandwidth, unique viewers, geographic data
     *
     * @param  string  $videoId  Bunny video GUID
     * @param  string  $dateFrom  YYYY-MM-DD format
     * @param  string  $dateTo  YYYY-MM-DD format
     */
    public function getVideoStatistics(string $videoId, ?string $dateFrom = null, ?string $dateTo = null)
    {
        try {
            $query = [
                'videoId' => $videoId,
            ];

            if ($dateFrom) {
                $query['dateFrom'] = $dateFrom;
            }
            if ($dateTo) {
                $query['dateTo'] = $dateTo;
            }

            $response = Http::withHeaders([
                'AccessKey' => $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl, $query);

            if ($response->failed()) {
                Log::error('Bunny analytics request failed', [
                    'status' => $response->status(),
                    'video_id' => $videoId,
                ]);

                return null;
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Bunny analytics error', [
                'error' => $e->getMessage(),
                'video_id' => $videoId,
            ]);

            return null;
        }
    }

    /**
     * Get statistics for multiple videos
     * Useful for dashboard reporting
     */
    public function getMultipleVideosStatistics(array $videoIds, ?string $dateFrom = null, ?string $dateTo = null)
    {
        $stats = [];

        foreach ($videoIds as $videoId) {
            $stats[$videoId] = $this->getVideoStatistics($videoId, $dateFrom, $dateTo);
        }

        return $stats;
    }

    /**
     * Get your library statistics (all videos)
     */
    public function getLibraryStatistics(?string $dateFrom = null, ?string $dateTo = null)
    {
        try {
            $query = [];

            if ($dateFrom) {
                $query['dateFrom'] = $dateFrom;
            }
            if ($dateTo) {
                $query['dateTo'] = $dateTo;
            }

            $response = Http::withHeaders([
                'AccessKey' => $this->apiKey,
                'Accept' => 'application/json',
            ])->get($this->baseUrl, $query);

            if ($response->failed()) {
                Log::error('Bunny library statistics request failed', [
                    'status' => $response->status(),
                ]);

                return null;
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Bunny library statistics error', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Parse Bunny stats to get useful metrics
     */
    public function parseVideoStats(array $stats): array
    {
        return [
            'total_views' => $stats['totalViews'] ?? 0,
            'unique_viewers' => $stats['uniqueViewers'] ?? 0,
            'bandwidth_used' => $stats['bandwidthUsed'] ?? 0,
            'geographic_data' => $stats['countries'] ?? [],
            'device_breakdown' => $stats['deviceTypes'] ?? [],
            'engagement_rate' => $this->calculateEngagementRate($stats),
        ];
    }

    /**
     * Calculate engagement rate (Bunny doesn't provide this directly)
     * Uses local watch_progress data instead
     */
    private function calculateEngagementRate(array $stats): float
    {
        // This would be calculated from your local database
        // Example: (total_completions / total_views) * 100
        return 0.0;
    }
}
