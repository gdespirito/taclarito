<?php

namespace App\Jobs;

use App\Models\MovementCategoryAssociation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class CategorizeMovementsChunk implements ShouldQueue
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
        $response = Http::llmApi()->post('categorize', [
            'data' => collect($this->movements)->map(function ($movement) {
                return [
                    'id' => $movement['id'],
                    'amount' => $movement['amount'],
                    'description' => $movement['description'],
                    'date' => Carbon::parse($movement['date'])->format('Y-m-d'),
                ];
            }),
        ]);

        if (!isset($response['expensed_items'])) {
            throw new \Exception('Error wrap categorizing movements: ' . print_r($response, true));
        }

        foreach($response['expensed_items'] as $item) {
            MovementCategoryAssociation::updateOrCreate(
                ['movement_id' => $item['id']],
                ['category' => $item['category']],
            );
        }
    }
}
