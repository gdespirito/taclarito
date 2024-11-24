<?php

namespace App\Jobs;

use App\Models\FintocBankLink;
use App\Models\Movement;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class GetFintocMovementsJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected User $user, protected FintocBankLink $fintocBankLink)
    {

    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $linkToken = $this->fintocBankLink->link_token;

        foreach($this->fintocBankLink->accounts as $account) {
            $response = Http::fintoc()->get("accounts/{$account['id']}/movements?link_token={$linkToken}")->json();
            foreach($response as $movement) {
                $date = Carbon::parse($movement['transaction_date'] ?? $movement['post_date']);
                Movement::create([
                    'user_id' => $this->user->id,
                    'fintoc_account_id' => $account['id'],
                    'date' => $date,
                    'description' => $movement['description'],
                    'amount' => $movement['amount'],
                    'currency' => $movement['currency'],
                ]);
            }
        }

        dispatch(new CategorizeMovements($this->user));
    }
}
