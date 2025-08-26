<?php

namespace App\Http\Requests\SetupProfile;

use Illuminate\Foundation\Http\FormRequest;

class SetProfessionalInfoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->user();
        
        // Make professional info required only for providers
        if ($user && $user->role === 'provider') {
            return [
                'profession' => 'required|string|max:100',
                'years_of_experience' => 'required|string|max:3',
            ];
        }
        
        // For clients, these fields are optional
        return [
            'profession' => 'nullable|string|max:100',
            'years_of_experience' => 'nullable|string|max:3',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'profession.required' => 'Profession is required.',
            'years_of_experience.required' => 'Years of experience is required.',
            'years_of_experience.integer' => 'Years of experience must be a number.',
            'years_of_experience.min' => 'Years of experience cannot be negative.',
            'years_of_experience.max' => 'Years of experience cannot exceed 100.',
        ];
    }
}