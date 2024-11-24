<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GetRoastController extends Controller
{
    use ValidatesRequests;
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $movements = Movement::where('user_id', $request->user()->id)->with('wrappedCategory')->get();
        return Http::llmApi()->post('roast', [
            'expensed_items' => $movements->map(function ($item) {
                return [
                    'description' => $item->description,
                    'category' => $item->wrappedCategory->category,
                    'amount' => $item->amount,
                    'date' => $item->date,
                ];
            }),
        ])->json();
    }
}
