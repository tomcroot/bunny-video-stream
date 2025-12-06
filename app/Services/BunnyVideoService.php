<?php

namespace App\Services;

use BunnyLauncher\BunnySdk;
use Exception;
use StreamApiClient\StreamApiClient;

class BunnyVideoService
{
    private StreamApiClient $streamClient;

    private ?string $libraryId;

    public function __construct()
    {
        $accessKey = config('services.bunny.access_key');
        $this->libraryId = config('services.bunny.library_id', '');

        if (! $accessKey) {
            throw new Exception('Bunny CDN access key not configured');
        }

        $this->streamClient = BunnySdk::createStreamApiClient($accessKey);
    }

    /**
     * Get video library information
     */
    public function getLibrary(?int $libraryId = null): mixed
    {
        $libId = $libraryId ?? $this->libraryId;

        try {
            return $this->streamClient->library()->byLibraryId($libId)->get();
        } catch (Exception $e) {
            throw new Exception('Failed to get library: '.$e->getMessage());
        }
    }

    /**
     * Get all videos in library
     */
    public function getVideos(?int $libraryId = null): mixed
    {
        $libId = $libraryId ?? $this->libraryId;

        try {
            return $this->streamClient->library()->byLibraryId($libId)->videos()->get();
        } catch (Exception $e) {
            throw new Exception('Failed to get videos: '.$e->getMessage());
        }
    }

    /**
     * Get specific video details
     */
    public function getVideo(string $videoId, ?int $libraryId = null): mixed
    {
        $libId = $libraryId ?? $this->libraryId;

        try {
            return $this->streamClient->library()->byLibraryId($libId)->videos()->byVideoId($videoId)->get();
        } catch (Exception $e) {
            throw new Exception('Failed to get video: '.$e->getMessage());
        }
    }

    /**
     * Upload video to library
     */
    public function uploadVideo(string $filePath, ?string $title = null, ?int $libraryId = null): mixed
    {
        $libId = $libraryId ?? $this->libraryId;

        try {
            // First create video entry
            $videoData = [
                'title' => $title ?? basename($filePath),
            ];

            $video = $this->streamClient->library()->byLibraryId($libId)->videos()->post($videoData);

            // Then upload the actual file
            // Note: File upload implementation depends on Bunny's API
            // This would typically involve getting an upload URL and uploading the file

            return $video;
        } catch (Exception $e) {
            throw new Exception('Failed to upload video: '.$e->getMessage());
        }
    }

    /**
     * Delete video from library
     */
    public function deleteVideo(string $videoId, ?int $libraryId = null): bool
    {
        $libId = $libraryId ?? $this->libraryId;

        try {
            $this->streamClient->library()->byLibraryId($libId)->videos()->byVideoId($videoId)->delete();

            return true;
        } catch (Exception $e) {
            throw new Exception('Failed to delete video: '.$e->getMessage());
        }
    }

    /**
     * Get video playback URL
     */
    public function getPlaybackUrl(string $videoId, ?int $libraryId = null): string
    {
        $libId = $libraryId ?? $this->libraryId;
        $pullZone = config('services.bunny.pull_zone', '');

        if (! $pullZone) {
            throw new Exception('Bunny CDN pull zone not configured');
        }

        return "https://{$pullZone}.b-cdn.net/{$videoId}/playlist.m3u8";
    }

    /**
     * Get a signed playback URL that expires after the given seconds.
     * Falls back to unsigned URL if signing key is not configured.
     */
    public function getSignedPlaybackUrl(string $videoId, int $expiresInSeconds = 3600, ?int $libraryId = null): string
    {
        $pullZone = config('services.bunny.pull_zone', '');
        $signingKey = config('services.bunny.signing_key');

        if (! $pullZone) {
            throw new Exception('Bunny CDN pull zone not configured');
        }

        if (! $signingKey) {
            return $this->getPlaybackUrl($videoId, $libraryId);
        }

        $expires = time() + max(60, $expiresInSeconds); // minimum 1 minute window
        $path = "/{$videoId}/playlist.m3u8";

        // Bunny token authentication: HMAC-SHA256 over path + expiry with the signing key
        $rawHash = hash_hmac('sha256', $path.$expires, $signingKey, true);
        $token = rtrim(strtr(base64_encode($rawHash), '+/', '-_'), '=');

        return "https://{$pullZone}.b-cdn.net{$path}?token={$token}&expires={$expires}";
    }

    /**
     * Get a signed embed iframe token with expiry (Embed View Token Authentication).
     * Uses Bunny's embedded view token authentication for secure iframe embeds.
     */
    public function getSignedEmbedUrl(string $videoId, int $expiresInSeconds = 7200, ?int $libraryId = null): string
    {
        $signingKey = config('services.bunny.signing_key');
        $libraryId = $libraryId ?? $this->libraryId;

        if (! $signingKey) {
            // Fallback to public iframe without token if signing key not available
            return "https://iframe.mediadelivery.net/embed/{$libraryId}/{$videoId}";
        }

        $expires = time() + max(60, $expiresInSeconds);
        // SHA256_HEX($signingKey + $videoId + $expires)
        $tokenData = $signingKey.$videoId.$expires;
        $token = hash('sha256', $tokenData);

        return "https://iframe.mediadelivery.net/embed/{$libraryId}/{$videoId}?token={$token}&expires={$expires}";
    }

    /**
     * Get video thumbnail URL
     */
    public function getThumbnailUrl(string $videoId, ?int $libraryId = null, int $thumbnailTime = 1): string
    {
        $libId = $libraryId ?? $this->libraryId;
        $pullZone = config('services.bunny.pull_zone', '');

        if (! $pullZone) {
            throw new Exception('Bunny CDN pull zone not configured');
        }

        return "https://{$pullZone}.b-cdn.net/{$videoId}/{$thumbnailTime}.jpg";
    }

    /**
     * Create video embed code
     */
    public function getEmbedCode(string $videoId, array $options = []): string
    {
        $defaults = [
            'width' => 640,
            'height' => 360,
            'autoplay' => false,
            'muted' => true,
            'controls' => true,
        ];

        $settings = array_merge($defaults, $options);
        $playbackUrl = $this->getPlaybackUrl($videoId);

        return "<video width='{$settings['width']}' height='{$settings['height']}' ".
               ($settings['controls'] ? 'controls ' : '').
               ($settings['autoplay'] ? 'autoplay ' : '').
               ($settings['muted'] ? 'muted ' : '').
               "preload='metadata'>
            <source src='{$playbackUrl}' type='application/x-mpegURL'>
            Your browser does not support HLS video playback.
        </video>";
    }

    /**
     * Get video statistics via Bunny SDK.
     * Returns basic playback stats and video metadata.
     */
    public function getVideoStats(string $videoId, ?int $libraryId = null): mixed
    {
        $libId = $libraryId ?? $this->libraryId;

        try {
            // Fetch video stats/metadata via SDK
            return $this->streamClient->library()->byLibraryId($libId)->videos()->byVideoId($videoId)->get();
        } catch (Exception $e) {
            throw new Exception('Failed to fetch video statistics: '.$e->getMessage());
        }
    }
}
