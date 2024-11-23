<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Http::macro('fintoc', function () {
            return Http::withHeader(
                'Authorization',
                config('services.fintoc.secret_key')
            )->baseUrl('https://api.fintoc.com/v1/');
        });

        Http::macro('llmApi', function () {
//            return Http::baseUrl('https://api.taclarito.cl/api/v1/');
            return Http::baseUrl('http://localhost:8000/api/v1/');
        });
    }
}
