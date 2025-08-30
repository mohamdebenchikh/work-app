import { Link } from '@inertiajs/react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

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

interface BookingsListProps {
    bookings: {
        data: Booking[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

const statusVariant = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

const statusLabel = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
};

export default function BookingsList({ bookings, filters }: BookingsListProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const filteredBookings = bookings.data.filter((booking) => {
        const matchesSearch = search === '' || 
            booking.provider_service.title.toLowerCase().includes(search.toLowerCase()) ||
            booking.provider_service.user.name.toLowerCase().includes(search.toLowerCase());
        
        const isUpcoming = !isPast(new Date(booking.scheduled_at));
        const isPastBooking = isPast(new Date(booking.scheduled_at));
        
        if (status === 'upcoming') return matchesSearch && isUpcoming;
        if (status === 'past') return matchesSearch && isPastBooking;
        return matchesSearch;
    });

    const getStatusBadge = (status: string) => (
        <Badge variant="outline" className={`${statusVariant[status as keyof typeof statusVariant]} text-xs`}>
            {statusLabel[status as keyof typeof statusLabel]}
        </Badge>
    );

    const getScheduledDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM d, yyyy');
    };

    const getTimeRange = (dateString: string, duration: number) => {
        const start = new Date(dateString);
        const end = new Date(start.getTime() + duration * 60 * 1000);
        return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams({
            ...(status !== 'all' && { status }),
            ...(search && { search }),
            page: page.toString(),
        });
        window.location.href = `?${params.toString()}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search bookings..."
                        className="pl-9 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Tabs 
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                    className="w-full sm:w-auto"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No bookings found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">
                                                {booking.provider_service.title}
                                            </h3>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            with {booking.provider_service.user.name}
                                        </p>
                                    </div>
                                    {booking.price !== null && (
                                        <p className="font-medium">
                                            {formatCurrency(booking.price, booking.currency)}
                                        </p>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{getScheduledDate(booking.scheduled_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{getTimeRange(booking.scheduled_at, booking.duration)}</span>
                                        <span className="ml-auto text-muted-foreground">
                                            {booking.duration} min
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/bookings/${booking.id}`}>View Details</Link>
                                    </Button>
                                    {booking.status === 'pending' && booking.can_update && (
                                        <Button size="sm" asChild>
                                            <Link href={`/bookings/${booking.id}/edit`}>Update</Link>
                                        </Button>
                                    )}
                                    {booking.can_cancel && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {bookings.last_page > 1 && (
                <div className="flex items-center justify-between py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing page {bookings.current_page} of {bookings.last_page}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={bookings.current_page === 1}
                            onClick={() => handlePageChange(bookings.current_page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={bookings.current_page === bookings.last_page}
                            onClick={() => handlePageChange(bookings.current_page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
