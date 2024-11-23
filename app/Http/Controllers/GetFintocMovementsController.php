<?php

namespace App\Http\Controllers;

use App\Models\FintocBankLink;
use App\Models\Movement;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GetFintocMovementsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $fintonicLink = FintocBankLink::where('user_id', $request->user()->id)->first();
        $linkToken = $fintonicLink->link_token;

        foreach($fintonicLink->accounts as $account) {
            $response = Http::fintoc()->get("accounts/{$account['id']}/movements?link_token={$linkToken}")->json();
            foreach($response as $movement) {
                $date = Carbon::parse($movement['transaction_date'] ?? $movement['post_date']);
                Movement::create([
                    'user_id' => $request->user()->id,
                    'fintoc_account_id' => $account['id'],
                    'date' => $date,
                    'description' => $movement['description'],
                    'amount' => $movement['amount'],
                    'currency' => $movement['currency'],
                ]);
            }
        }

        dispatch(new \App\Jobs\CategorizeMovements($request->user()));
    }
}
