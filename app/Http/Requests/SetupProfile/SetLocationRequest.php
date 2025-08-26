<?php

namespace App\Http\Requests\SetupProfile;

use Illuminate\Foundation\Http\FormRequest;

class SetLocationRequest extends FormRequest
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
            'country' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
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
            'country.required' => 'Country is required.',
            'state.required' => 'State/Region is required.',
            'city.required' => 'City is required.',
            'address.required' => 'Address is required.',
            'latitude.required' => 'Location coordinates are required.',
            'longitude.required' => 'Location coordinates are required.',
        ];
    }
}