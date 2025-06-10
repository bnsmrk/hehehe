<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }


    public function showStudentForm() {
    $gradeLevels = GradeLevel::all();
    return view('register.student', compact('gradeLevels'));
}

public function showTeacherForm() {
    return view('register.teacher');
}

public function showIctForm() {
    return view('register.ict');
}

public function showHeadForm() {
    return view('register.head');
}

// Handle registrations
public function registerStudent(Request $request) {
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed',
        'grade_level_id' => 'required|exists:grade_levels,id',
        'class_name' => 'nullable|string',
        'date_of_birth' => 'nullable|date',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'student',
    ]);

    Student::create([
        'user_id' => $user->id,
        'grade_level_id' => $request->grade_level_id,
        'class_name' => $request->class_name,
        'date_of_birth' => $request->date_of_birth,
    ]);

    return redirect('/login')->with('success', 'Student registered successfully.');
}

public function registerTeacher(Request $request) {
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed',
        'department' => 'nullable|string',
        'qualification' => 'nullable|string',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'teacher',
    ]);

    Teacher::create([
        'user_id' => $user->id,
        'department' => $request->department,
        'qualification' => $request->qualification,
    ]);

    return redirect('/login')->with('success', 'Teacher registered successfully.');
}

public function registerIct(Request $request) {
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed',
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'ict',
    ]);

    return redirect('/login')->with('success', 'ICT registered successfully.');
}

public function registerHead(Request $request) {
    $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed',
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'head',
    ]);

    return redirect('/login')->with('success', 'Head registered successfully.');
}
}
