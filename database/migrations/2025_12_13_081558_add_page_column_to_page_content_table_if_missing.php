<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('page_content', function (Blueprint $table) {
            // Check if column doesn't exist before adding
            if (!Schema::hasColumn('page_content', 'page')) {
                $table->string('page')->nullable()->after('id');
                $table->index('page');
            }
        });

        // If data exists without page values, set default
        DB::table('page_content')
            ->whereNull('page')
            ->orWhere('page', '')
            ->update(['page' => 'home']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('page_content', function (Blueprint $table) {
            if (Schema::hasColumn('page_content', 'page')) {
                $table->dropIndex(['page']);
                $table->dropColumn('page');
            }
        });
    }
};
