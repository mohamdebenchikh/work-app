<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOfferRequest;
use App\Http\Requests\UpdateOfferRequest;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $offers = Offer::with(['user', 'serviceRequest'])->paginate($request->input('per_page', 15));

        return Inertia::render('Offer/Index', [
            'offers' => $offers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Offer/Create');
    }

    public function store(StoreOfferRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = $request->user()->id;

        $offer = Offer::create($validatedData);

        return redirect()->route('offers.index');
    }

    public function show(Offer $offer)
    {
        $offer->load(['user', 'serviceRequest']);

        return Inertia::render('Offer/Show', [
            'offer' => $offer,
        ]);
    }

    public function edit(Offer $offer)
    {
        return Inertia::render('Offer/Edit', [
            'offer' => $offer,
        ]);
    }

    public function update(UpdateOfferRequest $request, Offer $offer)
    {
        $offer->update($request->validated());

        return redirect()->route('offers.index');
    }

    public function destroy(Offer $offer)
    {
        $offer->delete();

        return redirect()->route('offers.index');
    }
}
