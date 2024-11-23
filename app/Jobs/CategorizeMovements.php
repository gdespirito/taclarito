<?php

namespace App\Jobs;

use App\Models\Movement;
use App\Models\MovementCategoryAssociation;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class CategorizeMovements implements ShouldQueue
{
    use Queueable;

    const CHUNK_SIZE = 2;

    /**
     * Create a new job instance.
     */
    public function __construct(protected User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Movement::where('user_id', $this->user->id)->chunk(static::CHUNK_SIZE, function ($movements) {
            $response = Http::llmApi()->post('categorize', [
                'data' => json_encode($movements),
            ])->json();

            foreach($response['expensed_items'] as $item) {
                MovementCategoryAssociation::updateOrCreate(
                    ['movement_id' => $item['id']],
                    ['category' => $item['category']],
                );
            }
        });


    }
}
