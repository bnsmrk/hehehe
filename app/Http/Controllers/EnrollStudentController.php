<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Section;
use App\Models\Student;
use App\Models\GradeLevel;
use Illuminate\Http\Request;

class EnrollStudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $students = User::where('role', 'student')->get(['id', 'name', 'email']);
        $gradeLevels = GradeLevel::all(['id', 'name']);
        // Pass grade_level_id with each section for filtering
        $sections = Section::all(['id', 'name', 'grade_level_id']);

        return Inertia::render('Teacher/Enroll', [
            'students' => $students,
            'gradeLevels' => $gradeLevels,
            'sections' => $sections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        // Optional: Prevent duplicate enrollment
        if (Student::where('user_id', $validated['user_id'])->exists()) {
            return back()->withErrors(['user_id' => 'Student is already enrolled.']);
        }

        Student::create([
            'user_id' => $validated['user_id'],
            'grade_level_id' => $validated['grade_level_id'],
            'section_id' => $validated['section_id'],
        ]);

        return redirect()->back()->with('success', 'Student enrolled successfully!');
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
