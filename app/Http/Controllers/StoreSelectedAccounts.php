<?php

namespace App\Http\Controllers;

use App\Events\FinishedFintocImport;
use App\Http\Requests\StoreSelectedAccountsRequest;
use App\Jobs\GetFintocMovementsJob;
use App\Models\FintocAccountsAssociation;
use App\Models\FintocBankLink;
use Illuminate\Bus\Batch;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;

class StoreSelectedAccounts extends Controller
{
    use ValidatesRequests;
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreSelectedAccountsRequest $request, $fintocLinkId)
    {
        $accounts = $request->input('accounts');
        $bankLink = FintocBankLink::find($fintocLinkId);

        foreach ($accounts as $account) {
            FintocAccountsAssociation::create([
                'fintoc_bank_link_id' => $fintocLinkId,
                'fintoc_account_id' => $account,
            ]);
        }

        Bus::batch(new GetFintocMovementsJob(auth()->user(), $bankLink))
            ->finally(function (Batch $batch) {
                event(new FinishedFintocImport($batch->options['user_id']);
            })
            ->withOption('user_id', auth()->user()->id)
            ->allowFailures()
            ->dispatch();

        return response()->json(['message' => 'Accounts associated successfully.']);

    }
}
