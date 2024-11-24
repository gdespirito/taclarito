<?php

namespace App\Jobs;

use App\Models\MovementCategoryAssociation;
use App\Models\MovementWrappedCategoryAssociation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class WrappedCategorizeMovementsChunk implements ShouldQueue
{
    use Queueable, Batchable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected User $user,  protected array $movements)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->batch()->cancelled()) {
            return;
        }

        $response = Http::llmApi()->post('categorize-wrapped', [
            'data' => collect($this->movements)->map(function ($movement) {
                return [
                    'id' => $movement['id'],
                    'amount' => $movement['amount'],
                    'description' => $movement['description'],
                    'date' => Carbon::parse($movement['date'])->format('Y-m-d'),
                ];
            }),
        ])->json();

        if (!isset($response['expensed_items'])) {
            throw new \Exception('Error wrap categorizing movements: ' . print_r($response, true));
        }

        foreach($response['expensed_items'] as $item) {
            MovementWrappedCategoryAssociation::updateOrCreate(
                ['movement_id' => $item['id']],
                ['category' => $item['category']],
            );
        }
    }
}
