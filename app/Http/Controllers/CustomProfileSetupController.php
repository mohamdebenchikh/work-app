<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Skill;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CustomProfileSetupController extends Controller
{
    public static $setupSteps = [
        'personal-info' => [
            'weight' => 15,
            'fields' => ['gender', 'birthdate'],
            'required' => true
        ],
        'phone-number' => [
            'weight' => 15,
            'fields' => ['phone'],
            'required' => true
        ],
        'location' => [
            'weight' => 20,
            'fields' => ['country', 'state', 'city', 'address'],
            'required' => true
        ],
        'avatar' => [
            'weight' => 10,
            'fields' => ['avatar'],
            'required' => false
        ],
        'bio' => [
            'weight' => 10,
            'fields' => ['bio'],
            'required' => false
        ],
        'professional-info' => [
            'weight' => 15,
            'fields' => ['profession', 'years_of_experience'],
            'required' => false
        ],
        'skills-categories' => [
            'weight' => 20,
            'fields' => ['skills', 'categories'],
            'required' => false
        ],
        'complete-setup' => [
            'weight' => 0,
            'fields' => [],
            'required' => false
        ]
    ];

    // Required steps that cannot be skipped
    private static $requiredSteps = ['personal-info', 'phone-number', 'location'];

    // Minimum completion percentage required to finish setup
    private const MIN_COMPLETION_PERCENTAGE = 80;

    public function index(Request $request)
    {
        $user = Auth::user();

        // Calculate current completion and find next step
        $this->calculateProfileCompletion($user);
        $nextStep = $this->getNextStep($user);

        return redirect()->to($this->getNextStepUrl($nextStep));
    }

    public function personalInfo(Request $request)
    {
        $user = Auth::user();

        if ($request->isMethod('post')) {
            try {
                // Validate the request
                $validated = $request->validate([
                    'gender' => ['nullable', 'string', 'in:male,female,other'],
                    'birthdate' => ['nullable', 'date', 'before:today'],
                ], [
                    'gender.in' => 'Please select a valid gender',
                    'birthdate.before' => 'Birthdate must be in the past',
                ]);

                // Format birthdate if needed
                if (isset($validated['birthdate'])) {
                    $validated['birthdate'] = date('Y-m-d', strtotime($validated['birthdate']));
                }

                $user->fill($validated);
                $user->save();

                $this->calculateProfileCompletion($user);
                return $this->redirectToNextStep('personal-info');
            } catch (\Illuminate\Validation\ValidationException $e) {
                return back()->withErrors($e->errors());
            } catch (\Exception $e) {
                \Log::error('Error saving personal info: ' . $e->getMessage());
                return back()->withErrors(['error' => 'Failed to save personal information. Please try again.']);
            }
        }

        // Check if already completed and redirect if so
        if ($this->isStepCompleted($user, 'personal-info')) {
            return $this->redirectToNextStep('personal-info');
        }

        return Inertia::render('custom-profile-setup/setup-personal-info', [
            'user' => $user,
            'nextStepUrl' => $this->getNextStepUrl('personal-info'),
            'canSkip' => $this->canSkipStep('personal-info')
        ]);
    }

    public function phoneNumber(Request $request)
    {
        $user = Auth::user();

        if ($request->isMethod('post')) {
            try {
                // Validate the request
                $request->validate([
                    'phone' => [
                        'required',
                        'string',
                        'max:20',
                        'regex:/^\+[1-9]\d{7,14}$/', // E.164 format: + and up to 15 digits
                    ],
                ], [
                    'phone.required' => 'Phone number is required',
                    'phone.regex' => 'Please enter a valid phone number with country code (e.g., +1234567890)',
                ]);

                // Format the phone number
                $phone = preg_replace('/[^\d+]/', '', $request->input('phone'));
                if (strpos($phone, '+') !== 0) {
                    $phone = '+' . ltrim($phone, '+');
                }

                // Save the phone number
                $user->phone = $phone;
                $user->save();

                $this->calculateProfileCompletion($user);

                // Redirect to the next step
                return $this->redirectToNextStep('phone-number');
            } catch (\Illuminate\Validation\ValidationException $e) {
                return back()->withErrors($e->errors());
            } catch (\Exception $e) {
                // Log the error
                \Log::error('Error saving phone number: ' . $e->getMessage());
                return back()->withErrors(['phone' => 'Failed to save phone number. Please try again.']);
            }
        }

        // Check if already completed and redirect if so
        if ($this->isStepCompleted($user, 'phone-number')) {
            return $this->redirectToNextStep('phone-number');
        }

        return Inertia::render('custom-profile-setup/setup-phone', [
            'user' => $user,
            'nextStepUrl' => $this->getNextStepUrl('phone-number'),
            'canSkip' => $this->canSkipStep('phone-number')
        ]);
    }

    public function location(Request $request)
    {
        $user = Auth::user();

        if ($request->isMethod('post')) {
            try {
                // Validate the request
                $validated = $request->validate([
                    'country' => 'required|string|max:100',
                    'state' => 'required|string|max:100',
                    'city' => 'required|string|max:100',
                    'address' => 'required|string|max:255',
                    'latitude' => 'required|numeric',
                    'longitude' => 'required|numeric',
                ], [
                    'country.required' => 'Country is required.',
                    'state.required' => 'State is required.',
                    'city.required' => 'City is required.',
                    'address.required' => 'Address is required.',
                    'latitude.required' => 'Latitude is required.',
                    'latitude.numeric' => 'Latitude must be a number.',
                    'longitude.required' => 'Longitude is required.',
                    'longitude.numeric' => 'Longitude must be a number.',
                ]);

                $user->fill($validated);
                $user->save();

                $this->calculateProfileCompletion($user);
                return $this->redirectToNextStep('location');
            } catch (\Illuminate\Validation\ValidationException $e) {
                return back()->withErrors($e->errors());
            } catch (\Exception $e) {
                \Log::error('Error saving location: ' . $e->getMessage());
                return back()->withErrors(['error' => 'Failed to save location information. Please try again.']);
            }
        }

        // Check if already completed and redirect if so
        if ($this->isStepCompleted($user, 'location')) {
            return $this->redirectToNextStep('location');
        }

        return Inertia::render('custom-profile-setup/setup-location', [
            'user' => $user,
            'nextStepUrl' => $this->getNextStepUrl('location'),
            'canSkip' => $this->canSkipStep('location'), // This will be false
            'isRequired' => true
        ]);
    }

    public function avatar(Request $request)
    {
        $user = Auth::user();

        if ($request->isMethod('post')) {
            try {
                // Validate the request
                $validated = $request->validate([
                    'avatar' => [
                        'required',
                        'image',
                        'mimes:jpeg,png,jpg,gif',
                        'max:2048', // 2MB max
                        'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
                    ],
                ], [
                    'avatar.required' => 'Please select an image to upload',
                    'avatar.image' => 'The file must be an image',
                    'avatar.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif',
                    'avatar.max' => 'The image may not be greater than 2MB',
                    'avatar.dimensions' => 'The image has invalid dimensions (min: 100x100, max: 2000x2000)',
                ]);

                // Store the uploaded file
                $path = Storage::disk('public')->put('/images', $validated['avatar']);
                $url = Storage::url($path);

                // Delete old avatar if exists
                if ($user->avatar) {
                    $oldPath = str_replace('/storage', 'public', $user->avatar);
                    if (Storage::exists($oldPath)) {
                        Storage::delete($oldPath);
                    }
                }

                $user->avatar = $url;
                $user->save();

                $this->calculateProfileCompletion($user);
                return $this->redirectToNextStep('avatar');
            } catch (\Illuminate\Validation\ValidationException $e) {
                return back()->withErrors($e->errors());
            } catch (\Exception $e) {
                \Log::error('Error uploading avatar: ' . $e->getMessage());
                return back()->withErrors(['avatar' => 'Failed to upload avatar. Please try again.']);
            }
        }

        // Check if already completed and redirect if so
        if ($this->isStepCompleted($user, 'avatar')) {
            return $this->redirectToNextStep('avatar');
        }

        return Inertia::render('custom-profile-setup/setup-avatar', [
            'user' => $user,
            'nextStepUrl' => $this->getNextStepUrl('avatar'),
            'canSkip' => $this->canSkipStep('avatar')
        ]);
    }

    public function bio(Request $request)
    {
        $user = Auth::user();

        if ($request->isMethod('post')) {
            try {
                // Validate the request
                $validated = $request->validate([
                    'bio' => 'required|string|min:1|max:1000',
                ], [
                    'bio.required' => 'Bio is required.',
                    'bio.min' => 'Bio must be at least 10 characters.',
                    'bio.max' => 'Bio cannot exceed 1000 characters.',
                ]);

                $user->bio = $validated['bio'];
                $user->save();

                $this->calculateProfileCompletion($user);
                return $this->redirectToNextStep('bio');
            } catch (\Illuminate\Validation\ValidationException $e) {
                return back()->withErrors($e->errors());
            } catch (\Exception $e) {
                \Log::error('Error saving bio: ' . $e->getMessage());
                return back()->withErrors(['bio' => 'Failed to save bio. Please try again.']);
            }
        }

        // Check if already completed and redirect if so
        if ($this->isStepCompleted($user, 'bio')) {
            return $this->redirectToNextStep('bio');
        }

        return Inertia::render('custom-profile-setup/setup-bio', [
            'user' => $user,
            'nextStepUrl' => $this->getNextStepUrl('bio'),
            'canSkip' => $this->canSkipStep('bio')
        ]);
    }

    public function skillsCategories(Request $request)
    {
        $user = Auth::user();

        if ($request->isMethod('post')) {
            try {
                // Define validation rules based on user role
                $rules = [
                    'skills' => 'required|array|min:1',
                    'skills.*' => 'integer|exists:skills,id',
                    'categories' => 'required|array|min:1',
                    'categories.*' => 'integer|exists:categories,id',
                ];

                // Make fields optional for non-providers
                if ($user->role !== 'provider') {
                    $rules = [
                        'skills' => 'nullable|array',
                        'skills.*' => 'integer|exists:skills,id',
                        'categories' => 'nullable|array',
                        'categories.*' => 'integer|exists:categories,id',
                    ];
                }

                // Validate the request
                $validated = $request->validate($rules, [
                    'skills.required' => 'Please select at least one skill.',
                    'skills.min' => 'Please select at least one skill.',
                    'skills.*.integer' => 'Invalid skill selected.',
                    'skills.*.exists' => 'One or more selected skills are invalid.',
                    'categories.required' => 'Please select at least one category.',
                    'categories.min' => 'Please select at least one category.',
                    'categories.*.integer' => 'Invalid category selected.',
                    'categories.*.exists' => 'One or more selected categories are invalid.',
                ]);

                // Use database transaction for data consistency
                \DB::transaction(function () use ($user, $validated) {
                    $user->skills()->sync($validated['skills']);
                    $user->categories()->sync($validated['categories']);
                });

                $this->calculateProfileCompletion($user);
                return $this->redirectToNextStep('skillsCategories');
            } catch (\Illuminate\Validation\ValidationException $e) {
                return back()->withErrors($e->errors());
            } catch (\Exception $e) {
                \Log::error('Error saving skills and categories: ' . $e->getMessage());
                return back()->withErrors(['error' => 'Failed to save skills and categories. Please try again.']);
            }
        }

        // Check if already completed and redirect if so
        if ($this->isStepCompleted($user, 'skillsCategories')) {
            return $this->redirectToNextStep('skillsCategories');
        }

        $categories = Category::all();
        $skills = Skill::all();

        return Inertia::render('custom-profile-setup/setup-skills-categories', [
            'user' => $user,
            'categories' => $categories,
            'skills' => $skills,
            'nextStepUrl' => $this->getNextStepUrl('skillsCategories'),
            'canSkip' => $this->canSkipStep('skillsCategories')
        ]);
    }

    public function professionalInfo(Request $request)
    {
        $user = Auth::user();

        if ($request->isMethod('post')) {
            try {
                // Define validation rules based on user role
                $rules = [
                    'profession' => 'required|string|max:100',
                    'years_of_experience' => 'required|string|max:3',
                ];

                // Make fields optional for non-providers
                if ($user->role !== 'provider') {
                    $rules = [
                        'profession' => 'nullable|string|max:100',
                        'years_of_experience' => 'nullable|string|max:3',
                    ];
                }

                // Validate the request
                $validated = $request->validate($rules, [
                    'profession.required' => 'Profession is required.',
                    'years_of_experience.required' => 'Years of experience is required.',
                    'years_of_experience.integer' => 'Years of experience must be a number.',
                    'years_of_experience.min' => 'Years of experience cannot be negative.',
                    'years_of_experience.max' => 'Years of experience cannot exceed 100.',
                ]);

                $user->fill($validated);
                $user->save();

                $this->calculateProfileCompletion($user);
                return $this->redirectToNextStep('professionalInfo');
            } catch (\Illuminate\Validation\ValidationException $e) {
                return back()->withErrors($e->errors());
            } catch (\Exception $e) {
                \Log::error('Error saving professional info: ' . $e->getMessage());
                return back()->withErrors(['error' => 'Failed to save professional information. Please try again.']);
            }
        }

        // Check if already completed and redirect if so
        if ($this->isStepCompleted($user, 'professionalInfo')) {
            return $this->redirectToNextStep('professionalInfo');
        }

        return Inertia::render('custom-profile-setup/setup-professional-info', [
            'user' => $user,
            'nextStepUrl' => $this->getNextStepUrl('professionalInfo'),
            'canSkip' => $this->canSkipStep('professionalInfo')
        ]);
    }

    public function completeSetup(Request $request)
    {
        $user = Auth::user();

        if ($request->method() === 'POST') {
            // Check if required steps are completed
            $missingRequiredSteps = $this->getMissingRequiredSteps($user);

            if (!empty($missingRequiredSteps)) {
                return back()->with('error', 'Please complete the required steps before finishing setup.');
            }

            // Ensure minimum completion percentage is met
            $this->calculateProfileCompletion($user);
            if ($user->profile_completion < self::MIN_COMPLETION_PERCENTAGE) {
                return back()->with('error', 'Please complete more profile information before finishing setup.');
            }

            // Mark profile as completed
            $user->profile_completed_at = now();
            $user->save();

            // Clear session data
            session()->forget('profile_setup_skipped_steps');

            return redirect()->route('dashboard')
                ->with('success', 'Profile setup completed successfully!');
        }

        // Calculate current completion
        $completionPercentage = $this->calculateProfileCompletion($user);

        // Get all steps with their status
        $steps = [];
        $skippedSteps = session('profile_setup_skipped_steps', []);
        $missingRequiredSteps = [];

        foreach (self::$setupSteps as $step => $config) {
            if ($step === 'complete-setup') continue;

            $isCompleted = $this->isStepCompleted($user, $step);
            $isSkipped = in_array($step, $skippedSteps);
            $isRequired = $config['required'] ?? false;

            if ($isRequired && !$isCompleted && !$isSkipped) {
                $missingRequiredSteps[] = $step;
            }

            $steps[] = [
                'id' => $step,
                'name' => ucwords(str_replace('-', ' ', $step)),
                'status' => $isCompleted ? 'completed' : ($isSkipped ? 'skipped' : 'pending'),
                'required' => $isRequired,
                'weight' => $config['weight'],
                'url' => route('profile-setup.' . $step)
            ];
        }

        // Sort steps by required first, then by weight (descending)
        usort($steps, function ($a, $b) {
            if ($a['required'] !== $b['required']) {
                return $a['required'] ? -1 : 1;
            }
            return $b['weight'] - $a['weight'];
        });

        return Inertia::render('custom-profile-setup/complete-setup', [
            'user' => $user,
            'steps' => $steps,
            'completionPercentage' => $completionPercentage,
            'minCompletionPercentage' => self::MIN_COMPLETION_PERCENTAGE,
            'canComplete' => empty($missingRequiredSteps) && $completionPercentage >= self::MIN_COMPLETION_PERCENTAGE,
            'missingRequiredSteps' => $missingRequiredSteps
        ]);
    }

    /**
     * Skip a step (only if it's not required)
     */
    public function skipStep(Request $request, $step)
    {
        if (!$this->canSkipStep($step)) {
            return back()->with('error', 'This step cannot be skipped.');
        }

        // Add to skipped steps in session
        $skippedSteps = session('profile_setup_skipped_steps', []);
        if (!in_array($step, $skippedSteps)) {
            $skippedSteps[] = $step;
            session(['profile_setup_skipped_steps' => $skippedSteps]);
        }

        // If we're skipping the last step, go to complete-setup
        if ($step === last(self::$setupSteps)) {
            return redirect()->route('profile-setup.complete-setup');
        }

        return $this->redirectToNextStep($step);
    }

    /**
     * Calculate profile completion percentage
     */
    /**
     * Calculate profile completion percentage based on completed steps and their weights
     */
    private function calculateProfileCompletion($user)
    {
        $totalWeight = 0;
        $completedWeight = 0;

        // Calculate completion based on step weights
        foreach (self::$setupSteps as $step => $config) {
            // Skip complete-setup step in calculation
            if ($step === 'complete-setup') {
                continue;
            }

            $totalWeight += $config['weight'];

            if ($this->isStepCompleted($user, $step)) {
                $completedWeight += $config['weight'];
            }
        }

        // Calculate completion percentage
        $completionPercentage = $totalWeight > 0
            ? min(round(($completedWeight / $totalWeight) * 100), 100)
            : 0;

        // Ensure minimum completion percentage if required steps are completed
        if ($this->areRequiredStepsCompleted($user)) {
            $completionPercentage = max($completionPercentage, self::MIN_COMPLETION_PERCENTAGE);
        }

        $user->profile_completion = $completionPercentage;
        $user->save();

        return $completionPercentage;
    }

    /**
     * Check if all required steps are completed
     */
    private function areRequiredStepsCompleted($user)
    {
        foreach (self::$setupSteps as $step => $config) {
            if ($config['required'] && !$this->isStepCompleted($user, $step)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if a step is completed
     */
    /**
     * Check if a step is completed based on its fields
     */
    private function isStepCompleted($user, $step)
    {
        if (!isset(self::$setupSteps[$step])) {
            return false;
        }

        $stepConfig = self::$setupSteps[$step];

        // Special case for complete-setup
        if ($step === 'complete-setup') {
            return false;
        }

        // Handle special cases for relationships and fields
        switch ($step) {
            case 'skills-categories':
                return $user->skills()->exists() || $user->categories()->exists();

            case 'location':
                // At least country and city are required
                return !empty($user->country) && !empty($user->city);

            case 'phone-number':
                // Check if phone is set and not empty
                return !empty($user->phone);
        }

        // Check each field in the step
        foreach ($stepConfig['fields'] as $field) {
            // Skip phone field as it's handled in the switch
            if ($field === 'phone') {
                continue;
            }

            // Handle relation fields
            if (in_array($field, ['skills', 'categories'])) {
                if (!$user->$field()->exists()) {
                    return false;
                }
                continue;
            }

            // Handle regular fields
            if (empty($user->$field)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the next step in the setup process
     */
    private function getNextStep($user, $currentStep = null)
{
    $skippedSteps = session('profile_setup_skipped_steps', []);
    $steps = array_keys(self::$setupSteps);

    // find the current step index
    $startIndex = $currentStep ? array_search($currentStep, $steps) : -1;

    // search for the next incomplete step
    for ($i = $startIndex + 1; $i < count($steps); $i++) {
        $step = $steps[$i];
        if ($step === 'complete-setup') continue;

        $config = self::$setupSteps[$step];

        if (in_array($step, $skippedSteps) && !$config['required']) {
            continue;
        }

        if (!$this->isStepCompleted($user, $step)) {
            return $step; // found next step
        }
    }

    // all steps done → go to complete-setup
    return 'complete-setup';
}



    /**
     * Get the URL for the next step
     */
    private function getNextStepUrl($currentStep)
    {
        $user = Auth::user();
        $nextStep = $this->getNextStep($user, $currentStep);

        if ($nextStep === 'complete-setup') {
            return route('profile-setup.complete-setup');
        }

        return route('profile-setup.' . $nextStep);
    }
    /**
     * Redirect to the next step
     */
    private function redirectToNextStep($currentStep)
    {
        $user = Auth::user();
        $nextStep = $this->getNextStep($user, $currentStep);

        if ($nextStep === 'complete-setup') {
            return redirect()->route('profile-setup.complete-setup');
        }

        return redirect()->route('profile-setup.' . $nextStep);
    }

    /**
     * Check if a step can be skipped
     */
    private function canSkipStep($step)
    {
        return !in_array($step, self::$requiredSteps);
    }

    /**
     * Get completed steps
     */
    private function getCompletedSteps($user)
    {
        $completed = [];
        foreach (self::$setupSteps as $step) {
            if ($step !== 'completeSetup' && $this->isStepCompleted($user, $step)) {
                $completed[] = $step;
            }
        }
        return $completed;
    }

    /**
     * Get missing required steps
     */
    /**
     * Get list of required steps that are not completed
     */
    private function getMissingRequiredSteps($user)
    {
        $missing = [];
        foreach (self::$setupSteps as $step => $config) {
            if ($step === 'complete-setup') continue;

            if ($config['required'] && !$this->isStepCompleted($user, $step)) {
                $skippedSteps = session('profile_setup_skipped_steps', []);
                if (!in_array($step, $skippedSteps)) {
                    $missing[] = [
                        'id' => $step,
                        'name' => ucwords(str_replace('-', ' ', $step)),
                        'url' => route('profile-setup.' . $step)
                    ];
                }
            }
        }
        return $missing;
    }

    /**
     * Get setup progress summary
     */
    /**
     * Get setup progress summary
     */
    public function getProgress()
    {
        $user = Auth::user();
        $completion = $this->calculateProfileCompletion($user);
        $nextStep = $this->getNextStep($user);
        $skippedSteps = session('profile_setup_skipped_steps', []);

        // Get detailed step status
        $steps = [];
        foreach (self::$setupSteps as $step => $config) {
            if ($step === 'complete-setup') continue;

            $isCompleted = $this->isStepCompleted($user, $step);
            $isSkipped = in_array($step, $skippedSteps);

            $steps[$step] = [
                'completed' => $isCompleted,
                'skipped' => $isSkipped,
                'required' => $config['required'],
                'weight' => $config['weight'],
                'status' => $isCompleted ? 'completed' : ($isSkipped ? 'skipped' : 'pending')
            ];
        }

        return response()->json([
            'profile_completion' => $completion,
            'next_step' => $nextStep,
            'min_completion_percentage' => self::MIN_COMPLETION_PERCENTAGE,
            'can_complete' => empty($this->getMissingRequiredSteps($user)) &&
                $completion >= self::MIN_COMPLETION_PERCENTAGE,
            'steps' => $steps,
            'missing_required_steps' => $this->getMissingRequiredSteps($user)
        ]);
    }
}