<?php

namespace App\Policies;

use App\Models\ProviderService;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProviderServicePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Any authenticated user can view services
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ProviderService $providerService): bool
    {
        // Only the owner, admin, or if the service is active can view
        return $user->id === $providerService->user_id || 
               $providerService->status === 'active';
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only users with provider role can create services
        return $user->role === 'provider';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProviderService $providerService): bool
    {
        // Only the owner or admin can update
        return $user->id === $providerService->user_id || 
               $user->hasRole('admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProviderService $providerService): bool
    {
        // Only the owner or admin can delete
        return $user->id === $providerService->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ProviderService $providerService): bool
    {
        // Only admin can restore
        return $user->id === $providerService->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ProviderService $providerService): bool
    {
        // Only admin can force delete
        return $user->id === $providerService->user_id;
    }
    
    /**
     * Determine whether the user can toggle the status of the model.
     */
    public function toggleStatus(User $user, ProviderService $providerService): bool
    {
        // Only the owner or admin can toggle status
        return $user->id === $providerService->user_id;
    }
}
