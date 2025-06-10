<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\GradeLevelSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
            'password' => bcrypt('password'), // Use bcrypt for password hashing
        ]);
        User::factory()->create([
            'name' => 'Student User',
            'email' => 'student@gmail.com',
            'role' => 'student',
            'password' => bcrypt('password'), // Use bcrypt for password hashing
        ]);
        User::factory()->create([
            'name' => 'Teacher User',
            'email' => 'teacher@gmail.com',
            'role' => 'teacher',
            'password' => bcrypt('password'), // Use bcrypt for password hashing
        ]);
        User::factory()->create([
            'name' => 'ICT User',
            'email' => 'ict@gmail.com',
            'role' => 'ict',
            'password' => bcrypt('password'), // Use bcrypt for password hashing
        ]);
        User::factory()->create([
            'name' => 'Head',
            'email' => 'head@gmail.com',
            'role' => 'head',
            'password' => bcrypt('password'), // Use bcrypt for password hashing
        ]);


    }
}
