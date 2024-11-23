<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AddBankController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $fintocLink = (Http::fintoc()->post('link_intents', [
            'product' => 'movements',
            'country' => 'cl',
            'holder_type' => 'individual'
        ])->json());

        return Inertia::render('AddBank', [
            'widget_token' => $fintocLink['widget_token'],
        ]);
    }
}
