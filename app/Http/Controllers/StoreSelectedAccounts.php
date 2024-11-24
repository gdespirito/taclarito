<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSelectedAccountsRequest;
use App\Models\FintocAccountsAssociation;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;

class StoreSelectedAccounts extends Controller
{
    use ValidatesRequests;
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreSelectedAccountsRequest $request, $fintocLinkId)
    {
        $accounts = $request->input('accounts');

        foreach ($accounts as $account) {
            FintocAccountsAssociation::create([
                'fintoc_bank_link_id' => $fintocLinkId,
                'fintoc_account_id' => $account,
            ]);
        }

        return response()->json(['message' => 'Accounts associated successfully.']);

    }
}
