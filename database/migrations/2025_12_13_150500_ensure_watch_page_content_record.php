<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('page_content')) {
            return;
        }

        $movieUrl = env('WATCH_MOVIE_URL', 'https://vz-6024b712-a89.b-cdn.net/41d7b1aa-fca0-49dd-bb64-ad881d0a4ff6/playlist.m3u8');
        $now = now();

        $existing = DB::table('page_content')->where('page', 'watch')->first();

        if (! $existing) {
            DB::table('page_content')->insert([
                'page' => 'watch',
                'title' => 'A Crazy Day in Accra',
                'poster' => '/movie_poster.jpg',
                'backdrop' => '/movie_poster_2.jpg',
                'synopsis' => 'A gripping thriller set in the vibrant streets of Accra.',
                'logline' => 'Jason is framed for murder and must survive one crazy day in Accra.',
                'rating' => '16+',
                'runtime' => '1h 42m',
                'year' => '2025',
                'genres' => json_encode(['Action', 'Comedy', 'Thriller']),
                'metadata' => null,
                'movie_url' => $movieUrl,
                'sponsors' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            return;
        }

        if (! $existing->movie_url && $movieUrl) {
            DB::table('page_content')
                ->where('id', $existing->id)
                ->update([
                    'movie_url' => $movieUrl,
                    'is_active' => true,
                    'updated_at' => $now,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('page_content')) {
            return;
        }

        $movieUrl = env('WATCH_MOVIE_URL');

        if ($movieUrl) {
            DB::table('page_content')
                ->where('page', 'watch')
                ->where('movie_url', $movieUrl)
                ->delete();
        }
    }
};
