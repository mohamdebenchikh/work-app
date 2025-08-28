<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\SetupProfileController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\Public\PublicProviderController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Response;


// Public provider routes
Route::get('/public-providers', [PublicProviderController::class, 'index'])->name('public-providers.index');
Route::get('/public-providers/{user}', [PublicProviderController::class, 'show'])->name('public-providers.show');

Route::get('/', function (Request $request) {
    $country = $request->cookie('country');

    if (!$country) {
        try {
            $client = new \GuzzleHttp\Client(['timeout' => 2.0]);
            $res = $client->get('https://ipapi.co/json');
            $json = json_decode($res->getBody()->getContents(), true);
            $country = $json['country_name'] ?? null;
        } catch (\Throwable $e) {
            // silently ignore
        }
    }

    $props = [
        'initialCountry' => $country,
        'categories' => Category::select('id', 'name', 'slug')->orderBy('name')->get(),
    ];

    $response = Inertia::render('welcome', $props);

    if ($country) {
        return Response::make($response)->withCookie(cookie()->forever('country', $country));
    }

    return $response;
})->name('home');

Route::middleware(['auth', 'verified', 'require.profile.setup'])->group(function () {
    Route::get('dashboard', function () {
        $user = request()->user();
        $stats = [
            'offersCount' => method_exists($user, 'offers') ? $user->offers()->count() : 0,
            'serviceRequestsCount' => method_exists($user, 'serviceRequests') ? $user->serviceRequests()->count() : 0,
            'reviewsCount' => $user->reviews_count ?? ($user->reviewsReceived()->count() ?? 0),
            'ratingAverage' => $user->rating_average ?? ($user->averageRating() ?? 0),
        ];
        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');

    Route::post('/profile/toggle-role', function () {
        $user = request()->user();
        $user->role = $user->role === 'provider' ? 'client' : 'provider';
        $user->save();
        return back()->with('success', 'Role switched to ' . ucfirst($user->role) . '.');
    })->name('profile.toggle-role');

    Route::resource('service-requests', ServiceRequestController::class);

    // Route for storing an offer for a specific service request
    Route::post('service-requests/{service_request}/offers', [App\Http\Controllers\OfferController::class, 'store'])
        ->name('service-requests.offers.store');

    // Route for creating an offer for a specific service request
    Route::get('service-requests/{service_request}/offers/create', [App\Http\Controllers\OfferController::class, 'create'])
        ->name('service-requests.offers.create');

    // Routes for individual offer management (show, edit, update, delete)
    Route::resource('offers', App\Http\Controllers\OfferController::class)
        ->except(['index', 'create', 'store']);

    // Route for current user's offers
    Route::get('my-offers', [App\Http\Controllers\OfferController::class, 'userOffers'])
        ->name('my-offers.index');

    // Route for all offers of a specific service request (paginated)
    Route::get('service-requests/{service_request}/all-offers', [App\Http\Controllers\OfferController::class, 'serviceRequestOffers'])
        ->name('service-requests.all-offers');

    // Routes for reviews
    Route::post('providers/{provider}/reviews', [App\Http\Controllers\ReviewController::class, 'store'])
        ->name('providers.reviews.store');
    Route::get('providers/{provider}/reviews', [App\Http\Controllers\ReviewController::class, 'index'])
        ->name('providers.reviews.index');
    Route::put('reviews/{review}', [App\Http\Controllers\ReviewController::class, 'update'])
        ->name('reviews.update');
    Route::delete('reviews/{review}', [App\Http\Controllers\ReviewController::class, 'destroy'])
        ->name('reviews.destroy');

    // Notifications
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/mark-all-as-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
});

Route::middleware(['auth'])->group(function () {
    // Profile setup routes
    Route::get('/setup-profile', [SetupProfileController::class, 'index'])->name('setup-profile.index');

    // Individual step routes
    Route::post('/setup-profile/set-role', [SetupProfileController::class, 'setRole'])->name('setup-profile.set-role');
    Route::post('/setup-profile/set-location', [SetupProfileController::class, 'setLocation'])->name('setup-profile.set-location');
    Route::post('/setup-profile/set-phone', [SetupProfileController::class, 'setPhone'])->name('setup-profile.set-phone');
    Route::post('/setup-profile/set-personal-info', [SetupProfileController::class, 'setPersonalInfo'])->name('setup-profile.set-personal-info');
    Route::post('/setup-profile/set-avatar', [SetupProfileController::class, 'setAvatar'])->name('setup-profile.set-avatar');
    Route::post('/setup-profile/set-professional-info', [SetupProfileController::class, 'setProfessionalInfo'])->name('setup-profile.set-professional-info');
    Route::post('/setup-profile/set-bio', [SetupProfileController::class, 'setBio'])->name('setup-profile.set-bio');
    Route::post('/setup-profile/set-skills-categories', [SetupProfileController::class, 'setSkillsCategories'])->name('setup-profile.set-skills-categories');

    // Complete profile setup
    Route::post('/setup-profile/complete', [SetupProfileController::class, 'complete'])->name('setup-profile.complete');

    // Update profile completion progress
    Route::post('/setup-profile/update-progress', [SetupProfileController::class, 'updateProgress'])->name('setup-profile.update-progress');
});

// Provider routes
Route::get('/providers', [App\Http\Controllers\ProviderController::class, 'index'])
    ->name('providers.index');

Route::get('/providers/{provider}', [App\Http\Controllers\ProviderController::class, 'show'])
    ->name('providers.show');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
