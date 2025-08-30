import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import BookingsList from '@/components/booking/BookingsList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

type Booking = {
    id: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
    scheduled_at: string;
    duration: number;
    price: number | null;
    currency: string;
    provider_service: {
        id: number;
        title: string;
        user: {
            id: number;
            name: string;
            avatar_url?: string;
        };
    };
    can_update: boolean;
    can_cancel: boolean;
    can_delete: boolean;
};

interface BookingsPageProps {
    bookings: {
        data: Booking[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: '/bookings',
    },
];

export default function BookingsPage() {
    const page = usePage();
    const { bookings, filters } = page.props as unknown as BookingsPageProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">My Bookings</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your appointments and service bookings
                        </p>
                    </div>
                    <Button asChild>
                        <a href="/services">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Book a Service
                        </a>
                    </Button>
                </div>

                <div className="bg-card rounded-lg border">
                    <BookingsList bookings={bookings} filters={filters} />
                </div>
            </div>
        </AppLayout>
    );
}
