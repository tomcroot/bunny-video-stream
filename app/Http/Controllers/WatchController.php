<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\PageContent;
use App\Services\BunnyVideoService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WatchController extends Controller
{
    public function index(BunnyVideoService $bunny)
    {
        // Get the active banner with video URL
        $banner = Banner::where('is_active', true)
            ->whereNotNull('video_url')
            ->orderBy('display_order')
            ->first();

        // Get watch page content
        $pageContent = PageContent::where('page', 'watch')
            ->where('is_active', true)
            ->first();

        // Full movie stream: HLS signed playback only (no iframe)
        $videoId = '41d7b1aa-fca0-49dd-bb64-ad881d0a4ff6';
        $videoTitle = $banner?->title ?? 'A Crazy Day in Accra';

        // Always use HLS signed playback URL
        $embedUrl = null;
        $fallbackVideoUrl = null;
        try {
            $fallbackVideoUrl = $bunny->getSignedPlaybackUrl($videoId, 7200);
        } catch (\Throwable $e) {
            // Last resort: public playlist
            $fallbackVideoUrl = "https://vz-6024b712-a89.b-cdn.net/{$videoId}/playlist.m3u8";
            Log::warning('Bunny signed HLS fallback unavailable', [
                'error' => $e->getMessage(),
            ]);
        }

        return Inertia::render('Watch', [
            'banner' => $banner,
            'pageContent' => $pageContent,
            'embedUrl' => $embedUrl,
            'fallbackVideoUrl' => $fallbackVideoUrl,
            'videoTitle' => $videoTitle,
        ]);
    }
}
