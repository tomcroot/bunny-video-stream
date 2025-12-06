<?php

namespace App\Facades;

use App\Services\BunnyVideoService;
use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed getLibrary(int $libraryId = null)
 * @method static mixed getVideos(int $libraryId = null)
 * @method static mixed getVideo(string $videoId, int $libraryId = null)
 * @method static mixed uploadVideo(string $filePath, string $title = null, int $libraryId = null)
 * @method static bool deleteVideo(string $videoId, int $libraryId = null)
 * @method static string getPlaybackUrl(string $videoId, int $libraryId = null)
 * @method static string getThumbnailUrl(string $videoId, int $libraryId = null, int $thumbnailTime = 1)
 * @method static string getEmbedCode(string $videoId, array $options = [])
 * @method static mixed getVideoStats(string $videoId, int $libraryId = null)
 *
 * @see BunnyVideoService
 */
class Bunny extends Facade
{
    protected static function getFacadeAccessor()
    {
        return BunnyVideoService::class;
    }
}
