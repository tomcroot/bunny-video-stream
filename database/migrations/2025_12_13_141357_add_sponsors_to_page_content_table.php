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
        Schema::table('page_content', function (Blueprint $table) {
            $table->json('sponsors')->nullable()->after('metadata')->comment('Array of sponsor objects: [{name, logo_url, website_url}]');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_content', function (Blueprint $table) {
            $table->dropColumn('sponsors');
        });
    }
};
