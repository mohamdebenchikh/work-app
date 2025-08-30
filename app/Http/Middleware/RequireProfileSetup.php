<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireProfileSetup
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return $next($request);
        }

        // Get the authenticated user
        $user = auth()->user();

        // Check if profile setup is completed
        if (is_null($user->profile_completed_at)) {
            // Get current route name
            $currentRoute = $request->route()->getName();
            
            // List of allowed routes during profile setup
            $allowedRoutes = [
                'profile-setup.index',
                'profile-setup.personal-info',
                'profile-setup.phone-number',
                'profile-setup.location',
                'profile-setup.avatar',
                'profile-setup.bio',
                'profile-setup.professional-info',
                'profile-setup.skills-categories',
                'profile-setup.complete-setup',
                'profile-setup.skip',
                'profile-setup.progress',
                'logout', // Allow logout during setup
                'verification.notice', // Allow email verification
                'verification.verify',
                'verification.send',
            ];
            
            // Check if current route is allowed during setup
            if (!in_array($currentRoute, $allowedRoutes)) {
                // Redirect to profile setup index if not on an allowed route
                return redirect()->route('profile-setup.index')
                    ->with('info', 'Please complete your profile setup to continue.');
            }
        }

        return $next($request);
    }
}