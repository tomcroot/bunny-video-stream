<?php

namespace App\Console\Commands;

use App\Services\BunnyVideoService;
use Illuminate\Console\Command;

class TestBunnyService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bunny:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the Bunny Video Service integration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Bunny Video Service...');

        try {
            $bunnyService = app(BunnyVideoService::class);

            $this->info('✅ Bunny service instantiated successfully');

            // Test configuration
            $accessKey = config('services.bunny.access_key');
            $libraryId = config('services.bunny.library_id');

            if (! $accessKey) {
                $this->warn('⚠️  BUNNY_ACCESS_KEY not configured');
            } else {
                $this->info('✅ BUNNY_ACCESS_KEY is configured');
            }

            if (! $libraryId) {
                $this->warn('⚠️  BUNNY_LIBRARY_ID not configured');
            } else {
                $this->info('✅ BUNNY_LIBRARY_ID is configured');
            }

            // Test URL generation methods (these don't require API calls)
            $testVideoId = 'test-video-123';

            try {
                $playbackUrl = $bunnyService->getPlaybackUrl($testVideoId);
                $this->info("✅ Playback URL generation works: {$playbackUrl}");
            } catch (\Exception $e) {
                $this->error("❌ Playback URL generation failed: {$e->getMessage()}");
            }

            try {
                $thumbnailUrl = $bunnyService->getThumbnailUrl($testVideoId);
                $this->info("✅ Thumbnail URL generation works: {$thumbnailUrl}");
            } catch (\Exception $e) {
                $this->error("❌ Thumbnail URL generation failed: {$e->getMessage()}");
            }

            try {
                $embedCode = $bunnyService->getEmbedCode($testVideoId);
                $this->info('✅ Embed code generation works');
            } catch (\Exception $e) {
                $this->error("❌ Embed code generation failed: {$e->getMessage()}");
            }

            $this->info('🎉 Bunny service test completed!');

        } catch (\Exception $e) {
            $this->error("❌ Bunny service test failed: {$e->getMessage()}");

            return 1;
        }

        return 0;
    }
}
