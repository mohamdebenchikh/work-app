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
            // Redirect to setup profile page if not complete
            if ($request->route()->getName() !== 'setup-profile.index') {
                return redirect()->route('setup-profile.index');
            }
        }

        return $next($request);
    }
}