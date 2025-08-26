<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequestRequest;
use App\Http\Requests\UpdateServiceRequestRequest;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Skill;

class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $serviceRequests = ServiceRequest::with(['user', 'category', 'skills'])
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Adjust the number per page as needed

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($serviceRequests);
        }

        return Inertia::render('service-request/index', [
            'serviceRequests' => $serviceRequests,
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

        return redirect()->route('service-requests.index');
    }

    public function show(ServiceRequest $serviceRequest)
    {
        $serviceRequest->load(['user', 'category', 'skills']);

        return Inertia::render('service-request/show', [
            'serviceRequest' => $serviceRequest,
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
