<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicProviderController extends Controller
{
    /**
     * Display a listing of providers with filters.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', null);
        $category = $request->input('category', null);
        $min_rating = $request->input('min_rating', null);
        $sort = $request->input('sort', 'reviews_avg_rating');
        $order = $request->input('order', 'desc');

        $query = User::where('role', 'provider')
            ->where('profile_completion', '>=', 80) // Only show profiles that are at least 80% complete
            ->whereNotNull('profile_completed_at') // And have been marked as completed
            ->with(['categories', 'reviewsReceived'])
            ->withAvg('reviewsReceived as reviews_avg_rating', 'rating')
            ->withCount('reviewsReceived as reviews_count');

        // Search by provider name, business name, or category
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('profession', 'like', "%{$search}%")
                    ->orWhereHas('categories', function ($categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by category
        if ($category && $category !== 'all') {
            $query->whereHas('categories', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        // Filter by minimum rating
        if ($min_rating && $min_rating > 0) {
            $query->having('reviews_avg_rating', '>=', (float)$min_rating);
        }

        // Handle sorting
        switch ($sort) {
            case 'reviews_avg_rating':
                $query->orderBy('reviews_avg_rating', $order);
                break;
            case 'name':
                $query->orderBy('name', $order);
                break;
            case 'created_at':
                $query->orderBy('created_at', $order);
                break;
            default:
                $query->orderBy('reviews_avg_rating', 'desc');
                break;
        }

        // Add secondary sort to avoid random ordering for equal values
        if ($sort !== 'name') {
            $query->orderBy('name', 'asc');
        }

        $providers = $query->paginate(12);

        // Get categories for filters with provider count
        $categories = Category::select('categories.*')
            ->join('user_categories', 'categories.id', '=', 'user_categories.category_id')
            ->join('users', 'user_categories.user_id', '=', 'users.id')
            ->where('users.role', 'provider')
            ->where('users.profile_completion', '>=', 80)
            ->whereNotNull('users.profile_completed_at')
            ->whereNull('users.deleted_at')
            ->groupBy('categories.id', 'categories.name', 'categories.slug', 'categories.created_at', 'categories.updated_at')
            ->selectRaw('COUNT(DISTINCT users.id) as providers_count')
            ->orderBy('categories.name')
            ->get();

        return Inertia::render('Public/Providers/Index', [
            'providers' => $providers,
            'filters' => compact(['search', 'category', 'min_rating', 'sort', 'order']),
            'categories' => $categories,
            'minRating' => (float)$request->input('min_rating', 0),
        ]);
    }

    /**
     * Display the specified provider's public profile.
     */
    public function show(User $user)
    {
        // Check if the user meets provider criteria
        // if (
        //     $user->role !== 'provider' ||
        //     $user->profile_completion < 80 ||
        //     is_null($user->profile_completed_at)
        // ) {
        //     abort(404);
        // }

        // Load relationships and aggregates
        $provider = $user->load([
            'categories',
            'reviewsReceived' => function ($q) {
                $q->with('user')->latest()->limit(10);
            },
        ])
            ->loadAvg('reviewsReceived as reviews_avg_rating', 'rating')
            ->loadCount('reviewsReceived as reviews_count');

        // Get related providers (from same categories)
        $relatedProviders = collect();

        if ($provider->categories->isNotEmpty()) {
            $relatedProviders = User::where('role', 'provider')
                ->where('id', '!=', $provider->id)
                ->whereNotNull('profile_completed_at')
                ->whereHas('categories', function ($q) use ($provider) {
                    $q->whereIn('categories.id', $provider->categories->pluck('id'));
                })
                ->with(['categories'])
                ->withAvg('reviewsReceived as reviews_avg_rating', 'rating')
                ->withCount('reviewsReceived as reviews_count')
                ->inRandomOrder()
                ->limit(4)
                ->get();
        }

        return Inertia::render('Public/Providers/Show', [
            'provider' => $provider,
            'relatedProviders' => $relatedProviders,
        ]);
    }

    /**
     * Get provider statistics for admin/analytics
     */
    public function statistics()
    {
        $stats = [
            'total_providers' => User::where('role', 'provider')->count(),
            'active_providers' => User::where('role', 'provider')
                ->where('profile_completion', '>=', 80)
                ->whereNotNull('profile_completed_at')
                ->count(),
            'top_categories' => Category::select('categories.*')
                ->join('user_categories', 'categories.id', '=', 'user_categories.category_id')
                ->join('users', 'user_categories.user_id', '=', 'users.id')
                ->where('users.role', 'provider')
                ->where('users.profile_completion', '>=', 80)
                ->whereNotNull('users.profile_completed_at')
                ->whereNull('users.deleted_at')
                ->groupBy('categories.id', 'categories.name', 'categories.slug', 'categories.created_at', 'categories.updated_at')
                ->selectRaw('COUNT(DISTINCT users.id) as providers_count')
                ->orderByDesc('providers_count')
                ->limit(5)
                ->get(),
            'average_rating' => User::where('role', 'provider')
                ->where('profile_completion', '>=', 80)
                ->whereNotNull('profile_completed_at')
                ->withAvg('reviewsReceived as avg_rating', 'rating')
                ->get()
                ->avg('avg_rating')
        ];

        return response()->json($stats);
    }
}
