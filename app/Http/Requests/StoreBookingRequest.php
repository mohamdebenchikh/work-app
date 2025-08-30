<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled in the controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'provider_service_id' => [
                'required',
                'exists:provider_services,id',
                function ($attribute, $value, $fail) {
                    $providerService = \App\Models\ProviderService::find($value);
                    if (!$providerService || $providerService->status !== 'active') {
                        $fail('The selected service is not available for booking.');
                    }
                },
            ],
            'scheduled_at' => [
                'required',
                'date',
                'after_or_equal:now',
                function ($attribute, $value, $fail) {
                    $minNotice = now()->addHours(2); // Minimum 2 hours notice
                    if (strtotime($value) < $minNotice->timestamp) {
                        $fail('Please schedule the booking at least 2 hours in advance.');
                    }
                },
            ],
            'duration' => [
                'nullable',
                'integer',
                'min:15',
                'max:480', // 8 hours max
            ],
            'location' => [
                'nullable',
                'array',
            ],
            'location.address' => [
                'required_with:location',
                'string',
                'max:255',
            ],
            'location.city' => [
                'required_with:location',
                'string',
                'max:100',
            ],
            'location.country' => [
                'required_with:location',
                'string',
                'max:100',
            ],
            'location.postal_code' => [
                'nullable',
                'string',
                'max:20',
            ],
            'location.lat' => [
                'required_with:location',
                'numeric',
                'between:-90,90',
            ],
            'location.lng' => [
                'required_with:location',
                'numeric',
                'between:-180,180',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'provider_service_id.required' => 'Please select a service to book.',
            'provider_service_id.exists' => 'The selected service does not exist.',
            'scheduled_at.required' => 'Please select a date and time for the booking.',
            'scheduled_at.after_or_equal' => 'The booking date must be in the future.',
            'duration.min' => 'The duration must be at least :min minutes.',
            'duration.max' => 'The duration may not be greater than :max minutes.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Ensure location is properly formatted as an array
        if ($this->has('location') && is_string($this->location)) {
            $this->merge([
                'location' => json_decode($this->location, true) ?? [],
            ]);
        }
    }
}
