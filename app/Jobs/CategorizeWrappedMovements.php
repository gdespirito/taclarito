<?php

namespace App\Jobs;

use App\Models\Movement;
use App\Models\MovementCategoryAssociation;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;

class CategorizeWrappedMovements implements ShouldQueue
{
    use Queueable;

    const CHUNK_SIZE = 20;

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
        Movement::where('user_id', $this->user->id)->whereDoesntHave('wrappedCategory')->chunk(static::CHUNK_SIZE, function ($movements) {
            dispatch(new WrappedCategorizeMovementsChunk($this->user, $movements->toArray()));
        });


    }
}
