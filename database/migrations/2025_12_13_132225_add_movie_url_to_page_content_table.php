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
            $table->string('movie_url')->nullable()->after('backdrop')->comment('Full movie HLS URL from Bunny CDN (premium content)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_content', function (Blueprint $table) {
            $table->dropColumn('movie_url');
        });
    }
};
