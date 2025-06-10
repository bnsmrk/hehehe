<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SectionsController;
use App\Http\Controllers\SubjectsController;
use App\Http\Controllers\GradeLevelController;
use App\Http\Controllers\StudentRegisterController;
use App\Http\Controllers\TeacherRegisterController;
use App\Http\Controllers\LearningResourcesController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::resource('grade-levels', GradeLevelController::class);
Route::resource('sections', SectionsController::class);
Route::resource('subjects', SubjectsController::class);
Route::resource('learning-resources', LearningResourcesController::class);


Route::resource('student-register', StudentRegisterController::class);
Route::resource('teacher-register', TeacherRegisterController::class);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
