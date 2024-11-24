<?php

namespace App\Jobs;

use App\Models\Movement;
use App\Models\MovementWrappedCategoryAssociation;
use App\Models\UploadedFile;
use Carbon\Carbon;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProcessUploadedFileJob implements ShouldQueue
{
    use Queueable, Batchable;

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
        if ($this->batch()->cancelled()) {
            return;
        }

        $filePath = Storage::disk('local')->path($this->uploadedFile->filename);
        $fileHash = hash_file('sha256', $filePath);
        $response = cache()->remember($fileHash, now()->addDay(10), function () use ($filePath) {
            return Http::llmApi()
                ->asMultipart()
                ->timeout(500)
                ->attach('files',
                    file_get_contents($filePath), 'document.pdf')
                ->post('categorize-document');
        });

        if ($response->failed()) {
            throw new \Exception('Error processing uploaded file: Status '.$response->status().' Body: '.$response->body());
        }

        $response = $response->json();

        foreach ($response['expensed_items'] as $movement) {
            $movementModel = Movement::updateOrCreate([
                'user_id' => $this->uploadedFile->user_id,
                'fintoc_account_id' => null,
                'date' => Carbon::parse($movement['date']),
                'description' => $movement['description'],
                'amount' => $movement['amount'],
                'currency' => 'clp',
            ], []);

            MovementWrappedCategoryAssociation::updateOrCreate([
                'movement_id' => $movementModel->id,
            ], [
                'category' => $movement['category'],
            ]);
        }

        $this->batch()->add(new CategorizeMovements($this->uploadedFile->user));
    }
}
