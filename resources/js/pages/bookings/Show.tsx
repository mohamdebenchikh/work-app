import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookingDetails from '@/Components/booking/BookingDetails';
import { toast } from 'sonner';

interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  scheduled_at: string;
  duration: number;
  price: number | null;
  currency: string;
  notes: string | null;
  provider_notes: string | null;
  cancellation_reason: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  provider_service: {
    id: number;
    title: string;
    description: string | null;
    price: number | null;
    duration: number;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string | null;
      avatar_url: string | null;
    };
  };
  provider: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  };
  client: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  };
  location: {
    address: string;
    city: string;
    state: string | null;
    country: string;
    postal_code: string | null;
    lat: number | null;
    lng: number | null;
  } | null;
  can_update: boolean;
  can_cancel: boolean;
  can_delete: boolean;
  can_confirm: boolean;
  can_complete: boolean;
  can_review: boolean;
}

interface BookingShowPageProps extends PageProps {
  booking: Booking;
  success?: string;
  error?: string;
}

export default function BookingShowPage({ auth, booking, success, error }: BookingShowPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Show success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error]);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setIsProcessing(true);
      router.post(`/bookings/${booking.id}/cancel`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Booking has been cancelled');
          setIsProcessing(false);
        },
        onError: () => {
          toast.error('Failed to cancel booking');
          setIsProcessing(false);
        },
      });
    }
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    router.post(`/bookings/${booking.id}/confirm`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Booking has been confirmed');
        setIsProcessing(false);
      },
      onError: () => {
        toast.error('Failed to confirm booking');
        setIsProcessing(false);
      },
    });
  };

  const handleComplete = () => {
    setIsProcessing(true);
    router.post(`/bookings/${booking.id}/complete`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Booking has been marked as completed');
        setIsProcessing(false);
      },
      onError: () => {
        toast.error('Failed to complete booking');
        setIsProcessing(false);
      },
    });
  };

  const handleReview = () => {
    // Navigate to review page
    router.visit(`/bookings/${booking.id}/review`);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">
            Booking #{booking.id}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/bookings">
                Back to Bookings
              </Link>
            </Button>
            {booking.can_update && (
              <Button size="sm" asChild>
                <Link href={`/bookings/${booking.id}/edit`}>
                  Edit Booking
                </Link>
              </Button>
            )}
          </div>
        </div>
      }
    >
      <Head title={`Booking #${booking.id}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <BookingDetails 
            booking={booking}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            onComplete={handleComplete}
            onReview={handleReview}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Add the missing imports
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
