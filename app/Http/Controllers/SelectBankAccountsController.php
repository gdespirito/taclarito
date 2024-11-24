<?php

namespace App\Http\Controllers;

use App\Http\Requests\SelectBankAccountRequest;
use App\Models\FintocAccountsAssociation;
use App\Models\FintocBankLink;
use Inertia\Inertia;

class SelectBankAccountsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(SelectBankAccountRequest $request, string $fintocLinkId)
    {
        $accounts = FintocBankLink::find($fintocLinkId);

        return Inertia::render('SelectBankAccounts', [
            'fintoc_link_id' => $fintocLinkId,
            'fintoc_accounts' => $accounts->accounts,
        ]);

    }
}
