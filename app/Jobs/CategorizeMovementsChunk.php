<?php

namespace App\Jobs;

use App\Models\MovementCategoryAssociation;
use App\Models\User;
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
            'data' => json_encode($this->movements),
        ])->json();

        foreach($response['expensed_items'] as $item) {
            MovementCategoryAssociation::updateOrCreate(
                ['movement_id' => $item['id']],
                ['category' => $item['category']],
            );
        }

        dispatch(new CategorizeMovements($this->user));
    }
}
