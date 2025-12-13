<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Find the home page content (source of truth for sponsors)
        $homeContent = DB::table('page_content')
            ->where('page', 'home')
            ->first();

        if (! $homeContent || ! $homeContent->sponsors) {
            return;
        }

        // Update the watch page content with these sponsors
        DB::table('page_content')
            ->where('page', 'watch')
            ->update([
                'sponsors' => $homeContent->sponsors,
                'updated_at' => now(),
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to revert this data sync
    }
};
