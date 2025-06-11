<?php

namespace App\Models;

use App\Models\User;

use App\Models\Section;
use App\Models\GradeLevel;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'grade_level_id',
        'section_id',
        'class_name',
        'date_of_birth',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}
