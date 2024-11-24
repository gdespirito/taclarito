<?php

namespace App\Http\Controllers;

use App\Events\FinishedFileProcess;
use App\Events\FinishedFintocImport;
use App\Jobs\ProcessUploadedFileJob;
use App\Models\UploadedFile;
use Illuminate\Bus\Batch;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;

class StoreFileController extends Controller
{
    use ValidatesRequests;
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $this->validate($request, [
            'file' => 'required|file',
        ]);

        $filename = $request->file('file')->store('local');

        $uploadedFile = UploadedFile::create([
            'user_id' => $request->user()->id,
            'filename' => $filename,
        ]);

        Bus::batch(new ProcessUploadedFileJob($uploadedFile))
            ->then(function (Batch $batch) {
                event(new FinishedFileProcess(auth()->user()->id));
            })
            ->allowFailures()->dispatch();

        return response('', 201);

    }
}
