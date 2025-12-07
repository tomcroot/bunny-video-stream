<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('watch_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('video_id'); // Bunny video GUID
            $table->string('video_title'); // For "Continue Watching" display
            $table->integer('current_time')->default(0); // Seconds watched
            $table->integer('total_duration')->default(0); // Total video length
            $table->timestamps();

            // Unique constraint: one progress record per user per video
            $table->unique(['user_id', 'video_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('watch_progress');
    }
};
