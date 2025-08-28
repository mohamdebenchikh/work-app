<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Offer;

class StoreOfferRequest extends FormRequest
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
            'price' => ['required', 'numeric', 'min:0'],
            'message' => ['required', 'string', 'max:1000'],
            'service_request_id' => ['required', 'exists:service_requests,id',
                function ($attribute, $value, $fail) {
                    if (Auth::check() && Offer::where('user_id', Auth::id())
                        ->where('service_request_id', $value)
                        ->exists()) {
                        $fail('You have already made an offer for this service request.');
                    }
                },
            ],
        ];
    }
}
