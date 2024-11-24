<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date' => 'datetime'
    ];

    public function category()
    {
        return $this->hasOne(MovementCategoryAssociation::class, 'movement_id');
    }
}
