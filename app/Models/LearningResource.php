<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningResource extends Model
{
  protected $fillable = ['title', 'description', 'file_path', 'file_type', 'link'];
}
