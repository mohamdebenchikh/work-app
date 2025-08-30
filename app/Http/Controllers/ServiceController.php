<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProviderServiceResource;
use App\Models\Category;
use App\Models\ProviderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of services for public access.
     */
    public function index(Request $request): Response
    {
        $query = ProviderService::query()
            ->with([
                'user:id,name,avatar_url',
                'category:id,name,slug'
            ]);

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply category filter
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        // Apply price range filter
        if ($request->has('min_price') && is_numeric($request->min_price)) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && is_numeric($request->max_price)) {
            $query->where('price', '<=', $request->max_price);
        }

        // Get categories for filter dropdown
        $categories = Category::query()
            ->whereHas('providerServices')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        // Paginate results
        $services = $query->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('services/index', [
            'services' => ProviderServiceResource::collection($services),
            'categories' => $categories,
            'filters' => $request->only([
                'search',
                'category',
                'min_price',
                'max_price',
            ]),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProviderService $service)
    {
        $service->load([
            'user:id,name,avatar_url,email,phone',
            'category:id,name,slug'
        ]);

        // Get related services
        $relatedServices = ProviderService::query()
            ->where('id', '!=', $service->id)
            ->where('category_id', $service->category_id)
            ->with('user:id,name')
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return Inertia::render('services/show', [
            'service' => new ProviderServiceResource($service),
            'relatedServices' => ProviderServiceResource::collection($relatedServices),
        ]);
    }
}
