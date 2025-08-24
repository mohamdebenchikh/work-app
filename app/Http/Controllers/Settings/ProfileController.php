<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Http\Requests\Settings\BasicInfoRequest;
use App\Http\Requests\Settings\ProfessionalInfoRequest;
use App\Http\Requests\Settings\PersonalDetailsRequest;
use App\Http\Requests\Settings\AddressInfoRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Category;
use App\Models\Skill;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $categries = Category::all();
        $skills = Skill::all();

        $user = Auth::user()->with('categories','skills')->first();


        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'user' => $user,
            'skills' => $skills,
            'categories' => $categries,
        ]);
    }

    /**
     * Update basic information (name, email, phone).
     */
    public function updateBasic(BasicInfoRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Update professional information (profession, role, bio,skills,categories).
     */
    public function updateProfessional(ProfessionalInfoRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        $request->user()->skills()->sync($request->input('skills'));
        $request->user()->categories()->sync($request->input('categories'));

        return to_route('profile.edit');
    }

    /**
     * Update personal details (gender, birthdate).
     */
    public function updatePersonal(PersonalDetailsRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Update address information.
     */
    public function updateAddress(AddressInfoRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        return to_route('profile.edit');
    }


    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'file', 'image', 'max:5120'] // 5MB
        ]);

        $user = $request->user();
        $oldAvatar = $user->avatar;

        // Store new avatar
        $path = Storage::disk('public')->put('avatars', $request->file('avatar'));
        $avatarUrl = Storage::url($path);

        // Delete old avatar if it exists
        if ($oldAvatar) {
            // Extract file path from URL
            $oldPath = str_replace('/storage/', '', $oldAvatar);
            Storage::disk('public')->delete($oldPath);
        }

        // Update user avatar
        $user->update(['avatar' => $avatarUrl]);

        return redirect()->back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
