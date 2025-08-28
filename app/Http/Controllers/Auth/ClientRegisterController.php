<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ClientRegisterController extends BaseRegisterController
{
    /**
     * Show the client registration form.
     */
    public function create(): Response
    {
        return Inertia::render('custome-auth/client/register');
    }

    /**
     * Get the validation rules for client registration.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    protected function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'terms' => 'accepted',
        ];
    }

    /**
     * Create a new client user instance after a valid registration.
     */
    protected function createUser(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => 'client',
            'password' => Hash::make($data['password']),
        ]);
    }
}
