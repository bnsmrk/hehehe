<?php

namespace App\Models;

use App\Models\Section;
use App\Models\GradeLevel;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
     protected $fillable = ['grade_level_id', 'name'];

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }
    public function section()
{
    return $this->belongsTo(Section::class);
}
}
