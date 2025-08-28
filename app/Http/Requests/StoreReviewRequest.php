<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can submit a review
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'provider_id' => ['required', 'exists:users,id', function ($attribute, $value, $fail) {
                // Ensure reviewer is not the same as provider
                if (Auth::id() == $value) {
                    $fail('You cannot review yourself.');
                }
                // Ensure user has not already reviewed this provider
                $reviewer = Auth::user();
                $provider = User::find($value);
                if ($reviewer && $provider && $reviewer->hasReviewed($provider)) {
                    $fail('You have already reviewed this provider.');
                }
            }],
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'provider_id' => $this->route('provider'),
            'reviewer_id' => Auth::id(),
        ]);
    }
}
