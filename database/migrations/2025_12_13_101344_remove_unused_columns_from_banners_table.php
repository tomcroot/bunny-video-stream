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
            // Drop unused columns - we only need trailer_url and thumbnail_url
            if (Schema::hasColumn('banners', 'image_url')) {
                $table->dropColumn('image_url');
            }
            if (Schema::hasColumn('banners', 'video_url')) {
                $table->dropColumn('video_url');
            }
            if (Schema::hasColumn('banners', 'main_movie_url')) {
                $table->dropColumn('main_movie_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            // Restore columns if needed for rollback
            $table->string('image_url')->nullable()->after('cta_url');
            $table->string('video_url')->nullable()->after('image_url');
            $table->string('main_movie_url')->nullable()->after('trailer_url');
        });
    }
};
