<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            // Add Bunny CDN video URLs (HLS format)
            $table->string('trailer_url')->nullable()->after('video_url')->comment('HLS playlist URL for trailer from Bunny CDN');
            $table->string('main_movie_url')->nullable()->after('trailer_url')->comment('HLS playlist URL for main movie from Bunny CDN');
            $table->string('thumbnail_url')->nullable()->after('main_movie_url')->comment('Thumbnail image URL from Bunny CDN');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn(['trailer_url', 'main_movie_url', 'thumbnail_url']);
        });
    }
};
