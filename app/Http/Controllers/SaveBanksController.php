<?php

namespace App\Http\Controllers;

use App\Models\FintocBankLink;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SaveBanksController extends Controller
{
    use ValidatesRequests;

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $this->validate($request, [
            'exchangeToken' => 'required'
        ]);

        $exchangeToken = $request->get('exchangeToken');

        $link = (Http::fintoc()->get('links/exchange?exchange_token='.$exchangeToken)->json());

        FintocBankLink::create([
            'user_id' => auth()->id(),
            'fintoc_id' => $link['id'],
            'holder_id' => $link['holder_id'],
            'username' => $link['username'],
            'institution' => $link['institution']['id'],
            'country' => $link['institution']['country'],
            'holder_type' => $link['holder_type'],
            'link_token' => $link['link_token'],
            'accounts' => $link['accounts'],
        ]);

        return response()->json(['message' => 'Bank link saved successfully']);
    }
}
