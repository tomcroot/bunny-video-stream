<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('referral_codes', function (Blueprint $table) {
            $table->foreignId('movie_id')
                ->nullable()
                ->after('created_by')
                ->constrained('banners')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('referral_codes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('movie_id');
        });
    }
};
