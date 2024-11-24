<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use App\Models\MovementWrappedCategoryAssociation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WrappedController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $minDate = Movement::where('user_id', auth()->id())->min('date');
        $maxDate = Movement::where('user_id', auth()->id())->max('date');
        $categories = Movement::where('user_id', auth()->id())
            ->with('wrappedCategory')
            ->get()
            ->groupBy('wrappedCategory.category')
            ->map(function ($movements, $category) {
                return [
                    'category' => $category,
                    'sum' => $movements->sum('amount'),
                ];
            })
            ->values();

        return Inertia::render('Wrapped', ([
            'categories' => $categories,
            'minDate' => $minDate,
            'maxDate' => $maxDate,
        ]));
    }
}
