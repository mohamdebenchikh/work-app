<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\ReviewResource;
use Illuminate\Support\Facades\Gate;
use App\Notifications\NewReviewNotification;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['reviewer_id'] = Auth::id();

        $review = Review::create($validatedData);

        // Notify the provider
        $provider = User::find($validatedData['provider_id']);
        $reviewer = Auth::user();
        if ($provider && $reviewer && $provider->id !== $reviewer->id) {
            $provider->notify(new NewReviewNotification($review, $reviewer));
        }

        return redirect()->back()->with('success', 'Review submitted successfully.');
    }

    public function index(User $provider)
    {
        $reviews = $provider->reviewsReceived()->with('reviewer')->paginate(10);

        return ReviewResource::collection($reviews);
    }

    public function update(UpdateReviewRequest $request, Review $review)
    {
        Gate::authorize('update', $review);

        $review->update($request->validated());

        return redirect()->back()->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review)
    {
        Gate::authorize('delete', $review);

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully.');
    }
}
