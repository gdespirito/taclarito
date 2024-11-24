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

    const CHUNK_SIZE = 4;

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
        Movement::where('user_id', $this->user->id)->whereDoesntHave('category')->chunk(static::CHUNK_SIZE, function ($movements) {
            dispatch(new CategorizeMovementsChunk($this->user, $movements->toArray()));
        });


    }
}
