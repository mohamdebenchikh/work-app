<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    /**
     * Show availability management page
     */
    public function index()
    {
        $user = Auth::user();
        $availabilities = $user->availabilities()->orderBy('day_of_week')->get();

        return Inertia::render('settings/availability', [
            'availabilities' => $availabilities,
        ]);
    }

    /**
     * Store a new availability
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'day_of_week' => 'required|integer|min:0|max:6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $availability = Auth::user()->availabilities()->create($data);

        return redirect()->back()->with('success', 'Availability added')->with('availability', $availability);
    }

    /**
     * Update an availability
     */
    public function update(Request $request, Availability $availability)
    {
        // Ensure the availability belongs to the authenticated user
        if ($availability->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'day_of_week' => 'required|integer|min:0|max:6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $availability->update($data);

        return redirect()->back()->with('success', 'Availability updated');
    }

    /**
     * Delete an availability
     */
    public function destroy(Availability $availability)
    {
        // Ensure the availability belongs to the authenticated user
        if ($availability->user_id !== Auth::id()) {
            abort(403);
        }

        $availability->delete();

        return redirect()->back()->with('success', 'Availability removed');
    }
}
