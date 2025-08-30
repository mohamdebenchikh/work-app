<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\CustomProfileSetupController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\ProviderServiceController;
use App\Http\Controllers\Public\PublicProviderController;
use App\Http\Controllers\ReviewController;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Response;


// Public provider routes
Route::get('/public-providers', [PublicProviderController::class, 'index'])->name('public-providers.index');
Route::get('/public-providers/{user}', [PublicProviderController::class, 'show'])->name('public-providers.show');

// Public service routes
Route::get('/services', [\App\Http\Controllers\ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{service}', [\App\Http\Controllers\ServiceController::class, 'show'])->name('services.show');

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
    Route::post('service-requests/{service_request}/offers', [OfferController::class, 'store'])
        ->name('service-requests.offers.store');

    // Route for creating an offer for a specific service request
    Route::get('service-requests/{service_request}/offers/create', [OfferController::class, 'create'])
        ->name('service-requests.offers.create');

    // Routes for individual offer management (show, edit, update, delete)
    Route::resource('offers', OfferController::class)
        ->except(['index', 'create', 'store']);

    // Route for current user's offers
    Route::get('my-offers', [OfferController::class, 'userOffers'])
        ->name('my-offers.index');

    // Route for all offers of a specific service request (paginated)
    Route::get('service-requests/{service_request}/all-offers', [OfferController::class, 'serviceRequestOffers'])
        ->name('service-requests.all-offers');

    Route::get('/providers', [ProviderController::class, 'index'])->name('providers.index');
    Route::get('/providers/{user}', [ProviderController::class, 'show'])->name('providers.show');

    // Routes for reviews
    Route::post('providers/{provider}/reviews', [ReviewController::class, 'store'])
        ->name('providers.reviews.store');
    Route::get('providers/{provider}/reviews', [ReviewController::class, 'index'])
        ->name('providers.reviews.index');
    Route::put('reviews/{review}', [ReviewController::class, 'update'])
        ->name('reviews.update');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])
        ->name('reviews.destroy');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');


    Route::resource('provider-services', ProviderServiceController::class);
    Route::patch('provider-services/{providerService}/toggle-status', [ProviderServiceController::class, 'toggleStatus'])
        ->name('provider-services.toggle-status');
});


Route::middleware(['auth'])->group(function () {
    // Custom Profile Setup Routes
    Route::prefix('profile-setup')->name('profile-setup.')->group(function () {
        Route::get('/', [CustomProfileSetupController::class, 'index'])->name('index');
        Route::match(['GET', 'POST'], '/personal-info', [CustomProfileSetupController::class, 'personalInfo'])->name('personal-info');
        Route::match(['GET', 'POST'], '/phone-number', [CustomProfileSetupController::class, 'phoneNumber'])->name('phone-number');
        Route::match(['GET', 'POST'], '/location', [CustomProfileSetupController::class, 'location'])->name('location');
        Route::match(['GET', 'POST'], '/avatar', [CustomProfileSetupController::class, 'avatar'])->name('avatar');
        Route::match(['GET', 'POST'], '/bio', [CustomProfileSetupController::class, 'bio'])->name('bio');
        Route::match(['GET', 'POST'], '/professional-info', [CustomProfileSetupController::class, 'professionalInfo'])->name('professional-info');
        Route::match(['GET', 'POST'], '/skills-categories', [CustomProfileSetupController::class, 'skillsCategories'])->name('skills-categories');
        Route::match(['GET', 'POST'], '/complete-setup', [CustomProfileSetupController::class, 'completeSetup'])->name('complete-setup');

        // Skip step route
        Route::post('/skip/{step}', [CustomProfileSetupController::class, 'skipStep'])->name('skip');

        // Progress API route
        Route::get('/progress', [CustomProfileSetupController::class, 'getProgress'])->name('progress');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
