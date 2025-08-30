<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProviderServiceRequest;
use App\Http\Requests\UpdateProviderServiceRequest;
use App\Http\Resources\ProviderServiceResource;
use App\Models\Category;
use App\Models\ProviderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProviderServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $services = ProviderService::query()
            ->when($request->user()->role === 'provider', function ($query) use ($request) {
                return $query->where('user_id', $request->user()->id);
            })
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->search;
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->has('status'), function ($query) use ($request) {
                return $query->where('status', $request->status);
            })
            ->with(['category', 'user'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ProviderServices/Index', [
            'services' => ProviderServiceResource::collection($services),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        
        $categories = Category::select('id', 'name')->orderBy('name')->get();
        
        return Inertia::render('ProviderServices/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProviderServiceRequest $request)
    {
        $service = $request->user()->services()->create($request->validated());

        return redirect()
            ->route('provider-services.show', $service)
            ->with('success', 'Service created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProviderService $providerService): Response
    {
        Gate::authorize('view', $providerService);
        
        $providerService->load(['category', 'user']);
        
        return Inertia::render('ProviderServices/Show', [
            'service' => new ProviderServiceResource($providerService),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProviderService $providerService): Response
    {
        Gate::authorize('update', $providerService);
        
        $categories = Category::select('id', 'name')->orderBy('name')->get();
        
        return Inertia::render('ProviderServices/Edit', [
            'service' => new ProviderServiceResource($providerService->load('category')),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProviderServiceRequest $request, ProviderService $providerService)
    {
        $providerService->update($request->validated());

        return redirect()
            ->route('provider-services.show', $providerService)
            ->with('success', 'Service updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProviderService $providerService)
    {
        Gate::authorize('delete', $providerService);
        
        $providerService->delete();

        return redirect()
            ->route('provider-services.index')
            ->with('success', 'Service deleted successfully.');
    }
    
    /**
     * Toggle the status of the specified resource.
     */
    public function toggleStatus(ProviderService $providerService)
    {
        Gate::authorize('update', $providerService);
        
        $newStatus = $providerService->status === 'active' ? 'inactive' : 'active';
        $providerService->update(['status' => $newStatus]);
        
        return back();
    }
}
