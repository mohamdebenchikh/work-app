<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\ProviderService;
use App\Notifications\BookingCancelledNotification;
use App\Notifications\BookingCompletedNotification;
use App\Notifications\BookingConfirmedNotification;
use App\Notifications\BookingCreatedNotification;
use App\Notifications\BookingRejectedNotification;
use App\Notifications\BookingUpdatedNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = Booking::with(['client', 'provider', 'providerService'])
            ->when($user->hasRole('client'), function ($query) use ($user) {
                return $query->where('client_id', $user->id);
            })
            ->when($user->hasRole('provider'), function ($query) use ($user) {
                return $query->where('provider_id', $user->id);
            })
            ->latest();

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->has(['start_date', 'end_date'])) {
            $query->whereBetween('scheduled_at', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $bookings = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'total' => $bookings->total(),
                'per_page' => $bookings->perPage(),
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $providerService = ProviderService::findOrFail($request->provider_service_id);
        
        // Check if the service is available for booking
        if ($providerService->status !== 'active') {
            return response()->json([
                'message' => 'This service is not available for booking.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $booking = DB::transaction(function () use ($request, $providerService) {
            $booking = new Booking([
                'client_id' => $request->user()->id,
                'provider_id' => $providerService->user_id,
                'provider_service_id' => $providerService->id,
                'scheduled_at' => $request->scheduled_at,
                'duration' => $request->duration ?? $providerService->duration,
                'price' => $providerService->price,
                'currency' => $providerService->currency,
                'location' => $request->location ?? [
                    'address' => $providerService->address,
                    'city' => $providerService->city,
                    'country' => $providerService->country,
                    'postal_code' => $providerService->postal_code,
                    'lat' => $providerService->lat,
                    'lng' => $providerService->lng,
                ],
                'notes' => $request->notes,
                'status' => 'pending',
            ]);

            $booking->save();

            // Notify the provider about the new booking
            $booking->provider->notify(new BookingCreatedNotification($booking));

            return $booking;
        });

        return response()->json([
            'message' => 'Booking created successfully.',
            'data' => new BookingResource($booking->load(['client', 'provider', 'providerService'])),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking): JsonResponse
    {
        Gate::authorize('view', $booking);

        return response()->json([
            'data' => new BookingResource($booking->load(['client', 'provider', 'providerService'])),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking): JsonResponse
    {
        Gate::authorize('update', $booking);

        $booking = DB::transaction(function () use ($request, $booking) {
            $originalStatus = $booking->status;
            $updates = $request->validated();

            // If updating status, use the appropriate method
            if ($request->has('status') && $request->status !== $booking->status) {
                $this->updateBookingStatus($booking, $request->status);
                unset($updates['status']);
            }

            // Update other fields
            $booking->update($updates);
            $booking->refresh();

            // Notify about the update if something changed
            if ($booking->wasChanged() || isset($statusChanged)) {
                $booking->client->notify(new BookingUpdatedNotification($booking, $originalStatus));
                
                // If this was a status update, the status-specific notification was already sent
                if (!isset($statusChanged)) {
                    $booking->provider->notify(new BookingUpdatedNotification($booking, $originalStatus));
                }
            }

            return $booking;
        });

        return response()->json([
            'message' => 'Booking updated successfully.',
            'data' => new BookingResource($booking->load(['client', 'provider', 'providerService'])),
        ]);
    }

    /**
     * Update the booking status and send appropriate notifications.
     */
    protected function updateBookingStatus(Booking $booking, string $newStatus): void
    {
        $originalStatus = $booking->status;
        $booking->status = $newStatus;
        $booking->save();

        // Send appropriate notification based on status change
        switch ($newStatus) {
            case 'confirmed':
                $booking->client->notify(new BookingConfirmedNotification($booking));
                break;
            case 'completed':
                $booking->client->notify(new BookingCompletedNotification($booking));
                break;
            case 'cancelled':
                $booking->provider->notify(new BookingCancelledNotification($booking, $originalStatus));
                break;
            case 'rejected':
                $booking->client->notify(new BookingRejectedNotification($booking, $originalStatus));
                break;
        }
    }

    /**
     * Cancel the specified booking.
     */
    public function cancel(Booking $booking): JsonResponse
    {
        Gate::authorize('cancel', $booking);

        $booking = DB::transaction(function () use ($booking) {
            $originalStatus = $booking->status;
            $booking->status = 'cancelled';
            $booking->save();

            // Notify the other party about the cancellation
            if (Auth::id() === $booking->client_id) {
                $booking->provider->notify(new BookingCancelledNotification($booking, $originalStatus));
            } else {
                $booking->client->notify(new BookingCancelledNotification($booking, $originalStatus));
            }

            return $booking;
        });

        return response()->json([
            'message' => 'Booking cancelled successfully.',
            'data' => new BookingResource($booking->load(['client', 'provider', 'providerService'])),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking): JsonResponse
    {
        Gate::authorize('delete', $booking);

        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted successfully.',
        ]);
    }
}
