<?php

namespace App\Http\Controllers;

use App\Models\FintocBankLink;
use App\Models\Movement;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class GetMovementsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $movements = Movement::where('user_id', $request->user()->id)->with('category', 'wrappedCategory')->orderBy('date', 'DESC')->get();
        return Inertia::render('Movements/Index', [
           'movements' => $movements,
        ]);
    }
}
