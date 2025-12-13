<?php

namespace App\Http\Controllers;

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

        // Get watch page content with movie URL (premium content)
        $pageContent = PageContent::where('page', 'watch')
            ->where('is_active', true)
            ->first();

        if (! $pageContent || ! $pageContent->movie_url) {
            abort(503, 'Movie content is currently unavailable. Please try again later.');
        }

        // Get user's active subscription
        $subscription = null;
        if ($user) {
            $subscription = $user->subscriptions()
                ->where('expires_at', '>', now())
                ->latest()
                ->first();
        }

        // Use movie URL from page_content (this is premium content, not trailer)
        $movieUrl = $pageContent->movie_url;
        $videoTitle = $pageContent->title ?? 'A Crazy Day in Accra';

        // Generate signed HLS URL for security
        $fallbackVideoUrl = null;
        try {
            // Extract video ID from Bunny CDN URL
            preg_match('/\/([a-f0-9\-]+)\/playlist\.m3u8/', $movieUrl, $matches);
            $videoId = $matches[1] ?? null;

            if ($videoId) {
                $fallbackVideoUrl = $bunny->getSignedPlaybackUrl($videoId, 7200);
            } else {
                // If not a standard Bunny URL format, use as-is
                $fallbackVideoUrl = $movieUrl;
            }
        } catch (\Throwable $e) {
            // Fallback to direct URL if signing fails
            $fallbackVideoUrl = $movieUrl;
            Log::warning('Bunny signed URL generation failed, using direct URL', [
                'error' => $e->getMessage(),
                'movieUrl' => $movieUrl,
            ]);
        }

        return Inertia::render('Watch', [
            'pageContent' => $pageContent,
            'fallbackVideoUrl' => $fallbackVideoUrl,
            'videoTitle' => $videoTitle,
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
