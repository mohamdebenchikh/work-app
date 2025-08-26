<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\SetupProfile\SetRoleRequest;
use App\Http\Requests\SetupProfile\SetLocationRequest;
use App\Http\Requests\SetupProfile\SetPhoneRequest;
use App\Http\Requests\SetupProfile\SetPersonalInfoRequest;
use App\Http\Requests\SetupProfile\SetAvatarRequest;
use App\Http\Requests\SetupProfile\SetProfessionalInfoRequest;
use App\Http\Requests\SetupProfile\SetBioRequest;
use App\Http\Requests\SetupProfile\SetSkillsCategoriesRequest;
use App\Models\Category;
use App\Models\Skill;
use Illuminate\Support\Facades\Storage;

class SetupProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $categories = Category::all();
        $skills = Skill::all();
        return Inertia::render('setup-profile', [
            'user' => $user,
            'categories' => $categories,
            'skills' => $skills
        ]);
    }

    /**
     * Set user role
     */
    public function setRole(SetRoleRequest $request)
    {
        $user = Auth::user();


        $validated = $request->validated();

        $user->role = $validated['role'];
        $user->save();

        // Calculate profile completion percentage
        $this->calculateProfileCompletion($user);

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    /**
     * Calculate profile completion percentage
     * 
     * New calculation based on essential fields only:
     * - Required: location (country, state, city) and role
     * - Optional: all other fields
     * - 40% completion is considered sufficient for platform functionality
     */
    private function calculateProfileCompletion($user)
    {
        // Define essential fields (required for minimum 40% completion)
        $essentialFields = ['role', 'country', 'state', 'city'];

        // Count filled essential fields
        $filledEssentialFields = 0;
        foreach ($essentialFields as $field) {
            if (!empty($user->$field)) {
                $filledEssentialFields++;
            }
        }

        // Calculate completion percentage based on essential fields only
        $totalEssentialFields = count($essentialFields);
        $completionPercentage = ($filledEssentialFields / $totalEssentialFields) * 100;

        // Round to nearest 10
        $completionPercentage = floor($completionPercentage / 10) * 10;

        // Ensure minimum 40% when all essential fields are filled
        if ($filledEssentialFields === $totalEssentialFields) {
            $completionPercentage = max($completionPercentage, 40);
        }

        // Cap at 100%
        $completionPercentage = min($completionPercentage, 100);

        $user->profile_completion = $completionPercentage;
        $user->save();

        return $user->profile_completion;
    }

    /**
     * Set user location
     */
    public function setLocation(SetLocationRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        $user->fill($validated);
        $user->save();

        // Calculate profile completion percentage
        $this->calculateProfileCompletion($user);

        return redirect()->back();
    }

    /**
     * Set user phone
     */
    public function setPhone(SetPhoneRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        $user->phone = $validated['phone'];
        $user->save();

        // Calculate profile completion percentage
        $this->calculateProfileCompletion($user);

        return redirect()->back();
    }

    /**
     * Set personal information
     */
    public function setPersonalInfo(SetPersonalInfoRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        $user->fill($validated);
        $user->save();

        // Calculate profile completion percentage
        $this->calculateProfileCompletion($user);

        return redirect()->back();
    }

    /**
     * Set user avatar
     */
    public function setAvatar(SetAvatarRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        $path = Storage::disk('public')->put('/images',$validated['avatar']);
        $url = Storage::url($path);

        $user->avatar = $url;
        $user->save();

        // Calculate profile completion percentage
        $this->calculateProfileCompletion($user);

        return redirect()->back();
    }

    /**
     * Set professional information
     */
    public function setProfessionalInfo(SetProfessionalInfoRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        $user->fill($validated);
        $user->save();

        // Calculate profile completion percentage
        $this->calculateProfileCompletion($user);

        return redirect()->back();
    }

    /**
     * Set user bio
     */
    public function setBio(SetBioRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        $user->bio = $validated['bio'];
        $user->save();

        // Calculate profile completion percentage
        $this->calculateProfileCompletion($user);

        return redirect()->back();
    }

    /**
     * Set user skills and categories
     * Skills and categories are optional and don't affect completion percentage
     */
    public function setSkillsCategories(SetSkillsCategoriesRequest $request)
    {
        $user = Auth::user();

        $validated = $request->validated();

        $user->skills()->sync($validated['skills']);
        $user->categories()->sync($validated['categories']);

        // Calculate profile completion percentage
        // No longer automatically marking as 100% complete
        $this->calculateProfileCompletion($user);

        return redirect()->back();
    }

    /**
     * Complete profile setup
     * Allows completion with minimum required fields (40% threshold)
     */
    public function complete(Request $request)
    {
        $user = Auth::user();

        // Check if essential fields are filled (role and location)
        $essentialFields = ['role', 'country', 'state', 'city'];
        $missingFields = [];

        foreach ($essentialFields as $field) {
            if (empty($user->$field)) {
                $missingFields[] = $field;
            }
        }

        // If any essential fields are missing, redirect back with error
        if (!empty($missingFields)) {
            return back()->with('error', 'Please complete the required fields: ' . implode(', ', $missingFields));
        }

        // Ensure profile completion is at least 40%
        if ($user->profile_completion < 40) {
            $user->profile_completion = 40;
        }

        $user->profile_completed_at = now();
        $user->save();

        // Redirect to dashboard
        return redirect()->route('dashboard');
    }

    /**
     * Update profile completion progress
     */
    public function updateProgress(Request $request)
    {
        $user = Auth::user();
        $this->calculateProfileCompletion($user);

        return response()->json([
            'profile_completion' => $user->profile_completion
        ]);
    }
}
