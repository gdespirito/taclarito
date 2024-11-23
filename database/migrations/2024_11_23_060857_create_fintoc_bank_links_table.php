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
        Schema::create('fintoc_bank_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('fintoc_id');
            $table->string('holder_id');
            $table->string('username');
            $table->string('institution');
            $table->string('country');
            $table->string('holder_type');
            $table->string('link_token');
            $table->json('accounts');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fintoc_bank_links');
    }
};
