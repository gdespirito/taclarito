<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date' => 'datetime'
    ];
}
