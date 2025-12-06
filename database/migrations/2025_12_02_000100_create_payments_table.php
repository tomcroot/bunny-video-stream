<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reference')->unique();
            $table->unsignedBigInteger('amount'); // minor units (kobo/pesewas)
            $table->string('currency', 3)->default('GHS');
            $table->string('status', 32)->index(); // initialized, pending_callback, success, failed, abandoned
            $table->string('channel', 64)->nullable();
            $table->string('gateway_response', 255)->nullable();
            $table->string('authorization_code', 128)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('meta')->nullable();
            $table->tinyInteger('verify_attempts')->default(0);
            $table->timestamp('last_verify_at')->nullable();
            $table->timestamps();
            $table->index(['user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
