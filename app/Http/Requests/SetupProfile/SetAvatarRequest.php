<?php

namespace App\Http\Requests\SetupProfile;

use Illuminate\Foundation\Http\FormRequest;

class SetAvatarRequest extends FormRequest
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
            'avatar' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048', // 2MB max
                'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
            ],
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
            'avatar.required' => 'Please select an image to upload',
            'avatar.image' => 'The file must be an image',
            'avatar.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif',
            'avatar.max' => 'The image may not be greater than 2MB',
            'avatar.dimensions' => 'The image has invalid dimensions (min: 100x100, max: 2000x2000)',
        ];
    }
}