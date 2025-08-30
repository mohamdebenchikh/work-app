<?php

namespace App\Http\Requests\SetupProfile;

use Illuminate\Foundation\Http\FormRequest;

class SetPhoneRequest extends FormRequest
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
            'phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^\+[1-9]\d{7,14}$/', // E.164 format: + and up to 15 digits
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
            'phone.required' => 'Phone number is required',
            'phone.regex' => 'Please enter a valid phone number with country code (e.g., +1234567890)',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        if ($this->has('phone')) {
            // Remove all non-digit characters except +
            $phone = preg_replace('/[^\d+]/', '', $this->phone);
            // Ensure it starts with +
            if (strpos($phone, '+') !== 0) {
                $phone = '+' . ltrim($phone, '+');
            }
            $this->merge(['phone' => $phone]);
        }
    }
}