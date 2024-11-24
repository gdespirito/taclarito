<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessUploadedFileJob;
use App\Models\UploadedFile;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;

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

        dispatch(new ProcessUploadedFileJob($uploadedFile));

        return response('', 201);

    }
}
