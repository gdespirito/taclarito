<?php

namespace App\Jobs;

use App\Models\Movement;
use App\Models\User;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CategorizeMovements implements ShouldQueue
{
    use Queueable, Batchable;

    const CHUNK_SIZE = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(protected User $user)
    {
        //
    }

    /**
     * Execute the job.e
     */
    public function handle(): void
    {
        if ($this->batch()->cancelled()) {
            return;
        }

        $jobs = [];
        Movement::where('user_id', $this->user->id)->whereDoesntHave('category')->chunk(static::CHUNK_SIZE, function ($movements) use (&$jobs) {
            $jobs[] = new CategorizeMovementsChunk($this->user, $movements->toArray());
        });

        $this->batch()->add($jobs);


    }
}
