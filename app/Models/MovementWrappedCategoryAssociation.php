<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovementWrappedCategoryAssociation extends Model
{
    protected $guarded = [];

    public function movement()
    {
        return $this->belongsTo(Movement::class);
    }
}
