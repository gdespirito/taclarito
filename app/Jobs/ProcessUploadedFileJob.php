<?php

namespace App\Jobs;

use App\Models\Movement;
use App\Models\UploadedFile;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProcessUploadedFileJob implements ShouldQueue
{
    use Queueable;

    public $maxExceptions = 1;

    public $timeout = 500;

    /**
     * Create a new job instance.
     */
    public function __construct(protected UploadedFile $uploadedFile)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $response = Http::llmApi()
            ->asMultipart()
            ->timeout(500)
            ->attach('files',
                file_get_contents(Storage::disk('local')->path($this->uploadedFile->filename)), 'document.pdf')
            ->post('categorize-document')->json();
        logger()->info($response)   ;
        foreach($response['expensed_items'] as $movement) {
            Movement::create([
                'user_id' => $this->uploadedFile->user_id,
                'fintoc_account_id' => null,
                'date' => Carbon::parse($movement['date']),
                'description' => $movement['title'],
                'amount' => $movement['amount'],
                'currency' => 'clp',
            ]);
        }
    }
}
