<?php

namespace App\Http\Requests\SetupProfile;

use Illuminate\Foundation\Http\FormRequest;

class SetSkillsCategoriesRequest extends FormRequest
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
        
        // Make skills and categories required only for providers
        if ($user && $user->role === 'provider') {
            return [
                'skills' => 'required|array|min:1',
                'skills.*' => 'integer|exists:skills,id',
                'categories' => 'required|array|min:1',
                'categories.*' => 'integer|exists:categories,id',
            ];
        }
        
        // For clients, these fields are optional
        return [
            'skills' => 'nullable|array',
            'skills.*' => 'integer|exists:skills,id',
            'categories' => 'nullable|array',
            'categories.*' => 'integer|exists:categories,id',
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
            'skills.required' => 'Please select at least one skill.',
            'skills.min' => 'Please select at least one skill.',
            'skills.*.exists' => 'One or more selected skills are invalid.',
            'categories.required' => 'Please select at least one category.',
            'categories.min' => 'Please select at least one category.',
            'categories.*.exists' => 'One or more selected categories are invalid.',
        ];
    }
}