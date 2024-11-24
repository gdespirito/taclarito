<?php

namespace App\Http\Controllers;

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

        UploadedFile::create([
            'user_id' => $request->user()->id,
            'filename' => $filename,
        ]);

        return response('', 201);

    }
}
