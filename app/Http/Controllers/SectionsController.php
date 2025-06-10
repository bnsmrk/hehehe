<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Section;
use App\Models\GradeLevel;
use Illuminate\Http\Request;

class SectionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $gradeLevels = GradeLevel::all();
    $sections = Section::with('gradeLevel')->get();
    return Inertia::render('Sections/Index', [
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
        'grade_level_id' => 'required|exists:grade_levels,id',
        'name' => 'required|string|max:255|unique:sections,name,NULL,id,grade_level_id,' . $request->grade_level_id,
    ]);

    Section::create($validated);

    return redirect()->route('sections.index');
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
