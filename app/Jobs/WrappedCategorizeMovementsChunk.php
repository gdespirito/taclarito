<?php

namespace App\Jobs;

use App\Models\MovementCategoryAssociation;
use App\Models\MovementWrappedCategoryAssociation;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class WrappedCategorizeMovementsChunk implements ShouldQueue
{
    use Queueable;

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
        $response = Http::llmApi()->post('categorize-wrapped', [
            'data' => collect($this->movements)->map(function ($movement) {
                return [
                    'id' => $movement['id'],
                    'amount' => $movement['amount'],
                    'description' => $movement['description'],
                    'date' => $movement['date'],
                ];
            }),
        ])->json();

        foreach($response['expensed_items'] as $item) {
            MovementWrappedCategoryAssociation::updateOrCreate(
                ['movement_id' => $item['id']],
                ['category' => $item['category']],
            );
        }
    }
}
