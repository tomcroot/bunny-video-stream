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
        // Banners table
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message')->nullable();
            $table->string('cta_text')->nullable();
            $table->string('cta_url')->nullable();
            $table->dateTime('target_date');
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Gallery table
        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_url');
            $table->string('category')->default('behind-the-scenes');
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Cast/Crew table
        Schema::create('cast_crew', function (Blueprint $table) {
            $table->id();
            $table->string('stage_name');
            $table->string('real_name');
            $table->string('role_type'); // 'cast' or 'crew'
            $table->string('job_title')->nullable();
            $table->string('image_url')->nullable();
            $table->text('bio')->nullable();
            $table->string('referral_code')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Page content table for movie details
        Schema::create('page_content', function (Blueprint $table) {
            $table->id();
            $table->string('page')->unique(); // 'home', 'about', etc.
            $table->string('title')->nullable();
            $table->string('poster')->nullable();
            $table->string('backdrop')->nullable();
            $table->text('synopsis')->nullable();
            $table->text('logline')->nullable();
            $table->string('rating')->nullable(); // '16+', 'PG-13', etc.
            $table->string('runtime')->nullable(); // '1h 45m'
            $table->string('year')->nullable(); // '2025'
            $table->json('genres')->nullable(); // ['Thriller', 'Drama', 'Comedy']
            $table->json('metadata')->nullable(); // additional data
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Reviews table
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->text('content');
            $table->integer('rating')->default(5);
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('page_content');
        Schema::dropIfExists('cast_crew');
        Schema::dropIfExists('gallery');
        Schema::dropIfExists('banners');
    }
};
