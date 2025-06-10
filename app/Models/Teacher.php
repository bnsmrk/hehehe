<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
   protected $fillable = ['user_id', 'department', 'qualification'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
