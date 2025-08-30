<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\ProviderService;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all provider services with their providers
        $providerServices = ProviderService::with('user')->get();
        $clients = User::role('client')->get();
        
        if ($providerServices->isEmpty() || $clients->isEmpty()) {
            $this->command->warn('No provider services or clients found. Please run the necessary seeders first.');
            return;
        }

        $statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'];
        $reasons = [
            'Client requested cancellation',
            'Provider not available',
            'Double booking',
            'Insufficient information',
            'No longer needed',
            'Schedule conflict',
            null,
            null,
            null,
            null,
        ];

        // Create past bookings (30-90 days ago)
        $this->createBookings(
            $providerServices,
            $clients,
            $statuses,
            $reasons,
            now()->subDays(90),
            now()->subDays(30),
            50
        );

        // Create recent bookings (1-30 days ago)
        $this->createBookings(
            $providerServices,
            $clients,
            $statuses,
            $reasons,
            now()->subDays(30),
            now(),
            70
        );

        // Create upcoming bookings (today to 60 days in the future)
        $this->createBookings(
            $providerServices,
            $clients,
            ['pending', 'confirmed'], // Only pending and confirmed for future bookings
            $reasons,
            now(),
            now()->addDays(60),
            80
        );
    }

    /**
     * Create bookings with the given parameters.
     */
    protected function createBookings(
        $providerServices,
        $clients,
        array $statuses,
        array $reasons,
        $startDate,
        $endDate,
        int $count
    ): void {
        for ($i = 0; $i < $count; $i++) {
            $providerService = $providerServices->random();
            $client = $clients->random();
            
            // Ensure client is not the provider
            while ($client->id === $providerService->user_id) {
                $client = $clients->random();
            }

            $start = Carbon::parse($startDate)->addSeconds(rand(0, $endDate->diffInSeconds($startDate)));
            $duration = $providerService->duration ?? rand(30, 240); // 30 min to 4 hours
            
            $status = $statuses[array_rand($statuses)];
            $reason = null;
            
            // Add reason for cancelled/rejected bookings
            if (in_array($status, ['cancelled', 'rejected'])) {
                $reason = $reasons[array_rand($reasons)];
            }

            // Create the booking
            $booking = Booking::create([
                'client_id' => $client->id,
                'provider_id' => $providerService->user_id,
                'provider_service_id' => $providerService->id,
                'scheduled_at' => $start,
                'duration' => $duration,
                'price' => $providerService->price,
                'currency' => $providerService->currency,
                'location' => [
                    'address' => $client->address,
                    'city' => $client->city,
                    'country' => $client->country,
                    'postal_code' => $client->postal_code,
                    'lat' => $client->lat ?? null,
                    'lng' => $client->lng ?? null,
                ],
                'notes' => rand(0, 1) ? "Test booking notes for " . $providerService->title : null,
                'status' => $status,
                'cancellation_reason' => $status === 'cancelled' ? $reason : null,
                'rejection_reason' => $status === 'rejected' ? $reason : null,
                'created_at' => $start->copy()->subDays(rand(1, 10)),
                'updated_at' => $start->copy()->addMinutes(rand(0, 60)),
            ]);

            // If booking is completed, set completed_at
            if ($status === 'completed') {
                $booking->completed_at = $start->copy()->addMinutes($duration);
                $booking->save();
            }
        }
    }
}
