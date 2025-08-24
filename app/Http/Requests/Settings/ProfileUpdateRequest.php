<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'in:female,male'],
            'birthdate' => ['nullable', 'date'],
            "phone" => ['nullable', 'string', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            "country" => ["nullable", "string", "max:255"],
            "state" => ["nullable", "string", "max:255"],
            "city" => ["nullable", "string", "max:255"],
            "address" => ["nullable", "string", "max:255"],
            "latitude" => ["nullable", "numeric"],
            "longitude" => ["nullable", "numeric"],
            "role" => ["nullable", "string", "in:client,provider"],
            'profession' => ['nullable', 'string', 'max:255'],
        ];
    }
}
