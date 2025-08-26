<?php

namespace App\Http\Requests\SetupProfile;

use Illuminate\Foundation\Http\FormRequest;

class SetBioRequest extends FormRequest
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
        return [
            'bio' => 'required|string|min:1|max:1000',
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
            'bio.required' => 'Bio is required.',
            'bio.min' => 'Bio must be at least 10 characters.',
            'bio.max' => 'Bio cannot exceed 1000 characters.',
        ];
    }
}