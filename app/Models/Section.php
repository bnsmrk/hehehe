<?php

namespace App\Models;

use App\Models\GradeLevel;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = ['grade_level_id', 'name'];

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }
}
