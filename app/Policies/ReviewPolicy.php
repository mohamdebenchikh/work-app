<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReviewPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Anyone can view reviews
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Review $review): bool
    {
        return true; // Anyone can view a specific review
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // A user can create a review if they are authenticated and haven't reviewed the provider yet.
        // The actual logic for not reviewing yourself is handled in the StoreReviewRequest.
        return $user->id !== request()->provider_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Review $review): bool
    {
        // Only the reviewer can update their own review
        return $user->id === $review->reviewer_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Review $review): bool
    {
        // Only the reviewer can delete their own review
        return $user->id === $review->reviewer_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Review $review): bool
    {
        return $user->id === $review->reviewer_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Review $review): bool
    {
        return $user->id === $review->reviewer_id;
    }
}
