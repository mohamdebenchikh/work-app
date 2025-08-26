<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\SetupProfileController;
use App\Http\Controllers\OfferController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'require.profile.setup'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/profile',[ProfileController::class,'index'])->name('profile.index');

    Route::resource('service-requests', ServiceRequestController::class);
    Route::resource('offers', OfferController::class);
});

Route::middleware(['auth'])->group(function () {
    // Profile setup routes
    Route::get('/setup-profile',[SetupProfileController::class,'index'])->name('setup-profile.index');
    
    // Individual step routes
    Route::post('/setup-profile/set-role',[SetupProfileController::class,'setRole'])->name('setup-profile.set-role');
    Route::post('/setup-profile/set-location',[SetupProfileController::class,'setLocation'])->name('setup-profile.set-location');
    Route::post('/setup-profile/set-phone',[SetupProfileController::class,'setPhone'])->name('setup-profile.set-phone');
    Route::post('/setup-profile/set-personal-info',[SetupProfileController::class,'setPersonalInfo'])->name('setup-profile.set-personal-info');
    Route::post('/setup-profile/set-avatar',[SetupProfileController::class,'setAvatar'])->name('setup-profile.set-avatar');
    Route::post('/setup-profile/set-professional-info',[SetupProfileController::class,'setProfessionalInfo'])->name('setup-profile.set-professional-info');
    Route::post('/setup-profile/set-bio',[SetupProfileController::class,'setBio'])->name('setup-profile.set-bio');
    Route::post('/setup-profile/set-skills-categories',[SetupProfileController::class,'setSkillsCategories'])->name('setup-profile.set-skills-categories');
    
    // Complete profile setup
    Route::post('/setup-profile/complete',[SetupProfileController::class,'complete'])->name('setup-profile.complete');

    // Update profile completion progress
    Route::post('/setup-profile/update-progress', [SetupProfileController::class, 'updateProgress'])->name('setup-profile.update-progress');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
