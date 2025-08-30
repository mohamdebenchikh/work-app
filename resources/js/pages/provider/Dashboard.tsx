import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProviderBookings from '@/Components/provider/ProviderBookings';

interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  scheduled_at: string;
  duration: number;
  price: number | null;
  currency: string;
  client: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  provider_service: {
    id: number;
    title: string;
  };
  can_update: boolean;
  can_cancel: boolean;
}

interface DashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  revenue: number;
  currency: string;
}

interface ProviderDashboardProps extends PageProps {
  bookings: {
    upcoming: Booking[];
    pending: Omit<Booking, 'status' | 'can_update' | 'can_cancel'>[];
    today: Booking[];
    recent: Booking[];
  };
  stats: DashboardStats;
}

export default function ProviderDashboard({ auth, bookings, stats }: ProviderDashboardProps) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Welcome back, {auth.user.name}! Here's what's happening with your business.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/provider/services">
                My Services
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/provider/availability">
                Set Availability
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <Head title="Provider Dashboard" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <ProviderBookings bookings={bookings} stats={stats} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Add missing imports
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
