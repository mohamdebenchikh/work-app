<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequestRequest;
use App\Http\Requests\UpdateServiceRequestRequest;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Skill;
use App\Http\Resources\ServiceRequestResource;
use App\Http\Resources\OfferResource;
use App\Notifications\NewServiceRequestNotification;
use App\Models\User;

class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequest::with(['user', 'category', 'skills'])
            ->withCount('offers')
            ->orderBy('created_at', 'desc');

        // Search filter
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Category filter
        if ($category = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        // Location filter (by city for now)
        if ($city = $request->input('city')) {
            $query->where('city', 'like', '%' . $city . '%');
        }

        // Date filter (deadline_date after today)
        if ($date = $request->input('date')) {
            if ($date === 'upcoming') {
                $query->where('deadline_date', '>=', now());
            } else if ($date === 'past') {
                $query->where('deadline_date', '<', now());
            }
        }

        // New created_at filter
        if ($createdAt = $request->input('created_at')) {
            switch ($createdAt) {
                case 'last_24_hours':
                    $query->where('created_at', '>=', now()->subDay());
                    break;
                case 'last_7_days':
                    $query->where('created_at', '>=', now()->subDays(7));
                    break;
                case 'last_30_days':
                    $query->where('created_at', '>=', now()->subDays(30));
                    break;
                // Add more cases as needed, e.g., 'last_year', specific date ranges
            }
        }

        // New status filter
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // New price filters
        if ($minPrice = $request->input('min_price')) {
            $query->where('budget', '>=', $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('budget', '<=', $maxPrice);
        }

        $serviceRequests = $query->paginate(10);

        return Inertia::render('service-request/index', [
            'serviceRequests' => ServiceRequestResource::collection($serviceRequests),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category', 'city', 'created_at', 'status', 'min_price', 'max_price'])
        ]);
    }

    public function create()
    {
        return Inertia::render('service-request/create', [
            'categories' => Category::all(),
            'skills' => Skill::all(),
        ]);
    }

    public function store(StoreServiceRequestRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = $request->user()->id;

        $serviceRequest = ServiceRequest::create($validatedData);

        if ($request->has('skills')) {
            $serviceRequest->skills()->attach($request->skills);
        }

        // Notify all providers in the same category
        $categoryId = $serviceRequest->category_id;
        $creator = $request->user();
        $providers = User::where('role', 'provider')
            ->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            })->get();
        foreach ($providers as $provider) {
            if ($provider->id !== $creator->id) {
                $provider->notify(new NewServiceRequestNotification($serviceRequest, $creator));
            }
        }

        return redirect()->route('service-requests.index');
    }

    public function show(ServiceRequest $serviceRequest)
    {
        $serviceRequest->load(['user', 'category', 'skills']);
        $serviceRequest->loadCount('offers');
        $serviceRequest->load(['topOffers' => function ($query) {
            $query->with('user');
        }]);

        return Inertia::render('service-request/show', [
            'serviceRequest' => ServiceRequestResource::make($serviceRequest),
            'offers' => OfferResource::collection($serviceRequest->topOffers),
            'offersCount' => $serviceRequest->offers_count,
        ]);
    }

    public function edit(ServiceRequest $serviceRequest)
    {
        $serviceRequest->load(['skills','category']);
        return Inertia::render('service-request/edit', [
            'serviceRequest' => $serviceRequest,
            'categories' => Category::all(),
            'skills' => Skill::all(),
        ]);
    }

    public function update(UpdateServiceRequestRequest $request, ServiceRequest $serviceRequest)
    {
        $serviceRequest->update($request->validated());

        if ($request->has('skills')) {
            $serviceRequest->skills()->sync($request->skills);
        }

        return redirect()->route('service-requests.index');
    }

    public function destroy(ServiceRequest $serviceRequest)
    {
        $serviceRequest->delete();

        return redirect()->route('service-requests.index');
    }
}
