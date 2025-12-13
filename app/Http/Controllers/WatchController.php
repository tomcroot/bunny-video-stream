<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Subscription;
use App\Services\BunnyVideoService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WatchController extends Controller
{
    public function index(BunnyVideoService $bunny)
    {
        $user = auth()->user();

        // Get the active banner with trailer URL
        $banner = Banner::where('is_active', true)
            ->whereNotNull('trailer_url')
            ->orderBy('display_order')
            ->first();

        // Get watch page content (with defensive check for column existence)
        $pageContent = null;
        try {
            $pageContent = PageContent::where('page', 'watch')
                ->where('is_active', true)
                ->first();
        } catch (\Exception $e) {
            // Fallback if 'page' column doesn't exist in production DB
            \Log::warning('PageContent query failed, using fallback', ['error' => $e->getMessage()]);
            $pageContent = PageContent::where('is_active', true)->first();
        }

        // Get user's active subscription
        $subscription = null;
        if ($user) {
            $subscription = $user->subscriptions()
                ->where('expires_at', '>', now())
                ->latest()
                ->first();
        }

        // Check if user wants trailer or full movie
        $type = request()->query('type', 'movie');

        // Set video ID based on type
        if ($type === 'trailer') {
            $videoId = '643d70e3-19ee-4ae9-a2c9-ec20bf5742d9'; // Trailer
            $videoTitle = 'A Crazy Day in Accra - Official Trailer';
        } else {
            $videoId = '41d7b1aa-fca0-49dd-bb64-ad881d0a4ff6'; // Full movie
            $videoTitle = $banner?->title ?? 'A Crazy Day in Accra';
        }

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
                'videoId' => $videoId,
            ]);
        }

        return Inertia::render('Watch', [
            'banner' => $banner,
            'pageContent' => $pageContent,
            'embedUrl' => $embedUrl,
            'fallbackVideoUrl' => $fallbackVideoUrl,
            'videoTitle' => $videoTitle,
            'videoType' => $type,
            'user' => $user,
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'movie_id' => $subscription->movie_id,
                'expires_at' => $subscription->expires_at,
                'days_left' => now()->diffInDays($subscription->expires_at, false),
            ] : null,
        ]);
    }
}
