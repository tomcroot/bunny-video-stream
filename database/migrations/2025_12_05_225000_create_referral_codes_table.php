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
        Schema::create('referral_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Uppercase coupon/referral code (e.g., "SAVE20")
            $table->text('description')->nullable(); // Purpose/description of the code
            $table->decimal('discount_percentage', 5, 2)->default(0); // 0-100 discount %
            $table->boolean('is_active')->default(true); // Active/inactive toggle
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referral_codes');
    }
};
