<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth','require.profile.setup')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('settings/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.update.avatar');
    // Split profile updates into separate endpoints per section
    Route::patch('settings/profile/basic', [ProfileController::class, 'updateBasic'])->name('profile.update.basic');
    Route::patch('settings/profile/professional', [ProfileController::class, 'updateProfessional'])->name('profile.update.professional');
    Route::patch('settings/profile/personal', [ProfileController::class, 'updatePersonal'])->name('profile.update.personal');
    Route::patch('settings/profile/address', [ProfileController::class, 'updateAddress'])->name('profile.update.address');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    // Availability management
    Route::get('settings/availability', [\App\Http\Controllers\Settings\AvailabilityController::class, 'index'])->name('settings.availability');
    Route::post('settings/availability', [\App\Http\Controllers\Settings\AvailabilityController::class, 'store'])->name('settings.availability.store');
    Route::patch('settings/availability/{availability}', [\App\Http\Controllers\Settings\AvailabilityController::class, 'update'])->name('settings.availability.update');
    Route::delete('settings/availability/{availability}', [\App\Http\Controllers\Settings\AvailabilityController::class, 'destroy'])->name('settings.availability.destroy');
});
