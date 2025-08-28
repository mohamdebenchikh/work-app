<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Category;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'provider')
            ->with(['skills', 'categories'])
            ->orderBy('created_at', 'desc');

        // Search filter by name or profession
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('profession', 'like', '%' . $search . '%');
            });
        }

        // Category filter
        if ($category = $request->input('category')) {
            $query->whereHas('categories', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        // City filter
        if ($city = $request->input('city')) {
            $query->where('city', 'like', '%' . $city . '%');
        }

        $providers = $query->paginate(10);

        return Inertia::render('providers/index', [
            'providers' => UserResource::collection($providers),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category', 'city'])
        ]);
    }

    public function show(User $provider)
    {
        $provider->load(['skills', 'categories', 'reviewsReceived.reviewer']);

        // Calculate rating average and reviews count
        $provider->rating_average = $provider->averageRating();
        $provider->reviews_count = $provider->totalReviews();

        // Check if the authenticated user has reviewed this provider
        $hasReviewed = auth()->check() && auth()->user()->hasReviewed($provider);

        return Inertia::render('providers/show', [
            'provider' => UserResource::make($provider),
            'hasReviewed' => $hasReviewed,
        ]);
    }
}
