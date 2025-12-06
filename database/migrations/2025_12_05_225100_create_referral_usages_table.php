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
        Schema::create('referral_usages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('referral_code_id'); // Code that was used
            $table->uuid('user_id'); // User who used the code
            $table->uuid('subscription_id')->nullable(); // Subscription created with this code
            $table->decimal('discount_applied', 10, 2)->default(0); // Amount discounted
            $table->timestamp('used_at')->useCurrent(); // When the code was used

            // Indexes for fast lookups
            $table->index('referral_code_id');
            $table->index('user_id');
            $table->index('subscription_id');

            // Foreign keys
            $table->foreign('referral_code_id')->references('id')->on('referral_codes')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referral_usages');
    }
};
