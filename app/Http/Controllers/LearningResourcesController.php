<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LearningResource;

class LearningResourcesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $learningResources = LearningResource::latest()->get();
        return inertia('LearningModules/Index', [
            'learningResources' => $learningResources,
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
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'file' => 'required|file|mimes:pdf,doc,docx,mp4,avi,mov,jpg,jpeg,png,gif|max:20480',
    ]);

    $filePath = null;
    $fileType = null;
    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $filePath = $file->store('learning_resources', 'public');
        $fileType = $file->getClientOriginalExtension();
    }

    LearningResource::create([
        'title' => $validated['title'],
        'description' => $validated['description'],
        'file_path' => $filePath,
        'file_type' => $fileType,
    ]);

    return redirect()->route('learning-resources.index');
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
