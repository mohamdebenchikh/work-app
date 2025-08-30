<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Any authenticated user can view their own bookings
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Booking $booking): bool
    {
        // The client or provider can view the booking
        return $user->id === $booking->client_id || 
               $user->id === $booking->provider_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only clients can create bookings
        return $user->hasRole('client');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Booking $booking): bool
    {
        // Only the client can update their own booking if it's not completed/cancelled/rejected
        if ($user->id === $booking->client_id) {
            return in_array($booking->status, ['pending', 'confirmed']);
        }
        
        // Provider can only update status to confirmed/in_progress/completed/rejected
        if ($user->id === $booking->provider_id) {
            return in_array($booking->status, ['pending', 'confirmed', 'in_progress']);
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Booking $booking): bool
    {
        // Only the client can delete their own booking if it's not completed
        return $user->id === $booking->client_id && 
               !in_array($booking->status, ['completed', 'cancelled', 'rejected']);
    }

    /**
     * Determine if the user can update the booking status.
     */
    public function updateStatus(User $user, Booking $booking, string $status): bool
    {
        // Only the provider can update the status
        if ($user->id !== $booking->provider_id) {
            return false;
        }

        // Define allowed status transitions
        $allowedTransitions = [
            'pending' => ['confirmed', 'rejected'],
            'confirmed' => ['in_progress', 'cancelled'],
            'in_progress' => ['completed', 'cancelled'],
        ];

        // Check if the status transition is allowed
        return isset($allowedTransitions[$booking->status]) && 
               in_array($status, $allowedTransitions[$booking->status]);
    }

    /**
     * Determine if the user can cancel the booking.
     */
    public function cancel(User $user, Booking $booking): bool
    {
        // Only the client can cancel their own booking
        if ($user->id !== $booking->client_id) {
            return false;
        }

        // Can only cancel if booking is pending or confirmed
        return in_array($booking->status, ['pending', 'confirmed']);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Booking $booking): bool
    {
        // Only admins can restore soft-deleted bookings
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Booking $booking): bool
    {
        // Only admins can force delete bookings
        return $user->hasRole('admin');
    }
}
