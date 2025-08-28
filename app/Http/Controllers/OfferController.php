<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferRequest;
use App\Http\Requests\UpdateOfferRequest;
use App\Models\Offer;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\OfferResource;
use App\Http\Resources\ServiceRequestResource;
use App\Notifications\NewOfferNotification;

class OfferController extends Controller
{
    use AuthorizesRequests;

    public function store(StoreOfferRequest $request, ServiceRequest $serviceRequest)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = Auth::id();
        $validatedData['service_request_id'] = $serviceRequest->id;

        $offer = Offer::create($validatedData);

        // Notify the service request owner
        $owner = $serviceRequest->user;
        $offerer = Auth::user();
        if ($owner && $offerer && $owner->id !== $offerer->id) {
            $owner->notify(new NewOfferNotification($offer, $offerer, $serviceRequest));
        }

        return redirect()->route('service-requests.show', $serviceRequest);
    }

    public function show(Offer $offer)
    {
        $offer->load(['user', 'serviceRequest']);
        return Inertia::render('offers/Show', [
            'offer' => OfferResource::make($offer),
        ]);
    }

    public function edit(Offer $offer)
    {
        // Ensure only the offer creator can edit
        $this->authorize('update', $offer);

        $offer->load(['user', 'serviceRequest']);
        return OfferResource::make($offer);
    }

    public function update(UpdateOfferRequest $request, Offer $offer)
    {
        // Ensure only the offer creator can update
        $this->authorize('update', $offer);

        $offer->update($request->validated());

        return redirect()->route('offers.show', $offer);
    }

    public function destroy(Offer $offer)
    {
        // Ensure only the offer creator can delete
        $this->authorize('delete', $offer);

        $offer->delete();

        return redirect()->back()->with('success', 'Offer deleted successfully.');
    }

    public function userOffers()
    {
        $user = User::find(Auth::id());
        $offers = $user->offers()->with(['user', 'serviceRequest.user', 'serviceRequest.category'])->paginate(10);

        return Inertia::render('offers/my-offers', [
            'offers' => OfferResource::collection($offers),
        ]);
    }

    public function serviceRequestOffers(ServiceRequest $serviceRequest)
    {
        $offers = $serviceRequest->offers()->with(['user'])->paginate(10);

        return Inertia::render('offers/all-for-service-request', [
            'serviceRequest' => ServiceRequestResource::make($serviceRequest),
            'offers' => OfferResource::collection($offers),
        ]);
    }
}
