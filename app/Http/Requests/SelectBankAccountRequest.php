<?php

namespace App\Http\Requests;

use App\Models\FintocBankLink;
use Illuminate\Foundation\Http\FormRequest;

class SelectBankAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $fintocLinkId = $this->route('fintocLinkId');
        return FintocBankLink::where('user_id', auth()->id())->where('id', $fintocLinkId)->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
