<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FintocBankLink extends Model
{
    protected $guarded = [];
    protected $casts = [
        'accounts' => 'array'
    ];
}
