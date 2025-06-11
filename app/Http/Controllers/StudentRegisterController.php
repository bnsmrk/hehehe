<?php

namespace App\Http\Controllers;

use Hash;
use App\Models\User;
use Inertia\Inertia;
use App\Models\GradeLevel;
use Illuminate\Http\Request;

class StudentRegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $gradeLevels = GradeLevel::all();
    return Inertia::render('Student/Index', [
        'gradeLevels' => $gradeLevels,
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
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|confirmed|min:6',
        // 'year_level' => 'required|exists:grade_levels,id', // Removed year_level validation
    ]);

    User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role' => 'student',
        // 'year_level' => $validated['year_level'], // Removed year_level assignment
    ]);

    return redirect()->route('student-register.index')->with('success', 'Registration successful! You may now log in.');
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
