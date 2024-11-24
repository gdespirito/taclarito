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
                    'count' => $movements->count(),
                ];
            })
            ->values();
        $waitForFile = (bool) cache()->get("user-{$request->user()->id}-process-file");
        $waitForFintoc = (bool) cache()->get("user-{$request->user()->id}-fintoc");
        return Inertia::render('Wrapped', ([
            'waitForFile' => $waitForFile,
            'waitForFintoc' => $waitForFintoc,
            'categories' => $categories,
            'minDate' => $minDate,
            'maxDate' => $maxDate,
        ]));
    }
}
