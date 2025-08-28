<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ProviderRegisterController extends BaseRegisterController
{
    /**
     * Show the provider registration form.
     */
    public function create(): Response
    {
        return Inertia::render('custome-auth/provider/register');
    }

    /**
     * Get the validation rules for provider registration.
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
     * Create a new provider user instance after a valid registration.
     */
    protected function createUser(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'provider',
        ]);

        return $user;
    }
}
