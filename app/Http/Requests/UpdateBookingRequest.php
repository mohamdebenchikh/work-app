<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
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
        $booking = $this->route('booking');
        
        return [
            'scheduled_at' => [
                'sometimes',
                'required',
                'date',
                'after_or_equal:now',
                function ($attribute, $value, $fail) use ($booking) {
                    $minNotice = now()->addHours(2); // Minimum 2 hours notice
                    if (strtotime($value) < $minNotice->timestamp) {
                        $fail('Please schedule the booking at least 2 hours in advance.');
                    }
                    
                    // Check if the new time conflicts with other bookings
                    $conflictingBooking = \App\Models\Booking::where('id', '!=', $booking->id)
                        ->where('provider_id', $booking->provider_id)
                        ->where(function($query) use ($value, $booking) {
                            $endTime = $this->input('duration') 
                                ? now()->parse($value)->addMinutes($this->input('duration') ?? $booking->duration)
                                : now()->parse($value)->addMinutes($booking->duration);
                            
                            $query->whereBetween('scheduled_at', [
                                $value,
                                $endTime
                            ])->orWhereBetween(\DB::raw('DATE_ADD(scheduled_at, INTERVAL duration MINUTE)'), [
                                $value,
                                $endTime
                            ]);
                        })
                        ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                        ->exists();
                    
                    if ($conflictingBooking) {
                        $fail('The selected time conflicts with another booking.');
                    }
                },
            ],
            'duration' => [
                'sometimes',
                'required',
                'integer',
                'min:15',
                'max:480', // 8 hours max
            ],
            'location' => [
                'sometimes',
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
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],
            'status' => [
                'sometimes',
                'required',
                'string',
                'in:pending,confirmed,in_progress,completed,cancelled,rejected',
                function ($attribute, $value, $fail) use ($booking) {
                    // Only allow certain status transitions
                    $allowedTransitions = [
                        'pending' => ['confirmed', 'rejected', 'cancelled'],
                        'confirmed' => ['in_progress', 'cancelled'],
                        'in_progress' => ['completed', 'cancelled'],
                    ];
                    
                    if (isset($allowedTransitions[$booking->status]) && 
                        !in_array($value, $allowedTransitions[$booking->status])) {
                        $fail("Cannot change status from {$booking->status} to {$value}.");
                    }
                },
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
            'scheduled_at.required' => 'Please select a date and time for the booking.',
            'scheduled_at.after_or_equal' => 'The booking date must be in the future.',
            'duration.min' => 'The duration must be at least :min minutes.',
            'duration.max' => 'The duration may not be greater than :max minutes.',
            'status.in' => 'The selected status is invalid.',
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
