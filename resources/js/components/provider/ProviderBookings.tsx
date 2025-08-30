import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';

interface ProviderBookingsProps {
  bookings: {
    upcoming: Array<{
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
    }>;
    pending: Array<{
      id: number;
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
    }>;
    today: Array<{
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
    }>;
    recent: Array<{
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
    }>;
  };
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    revenue: number;
    currency: string;
  };
}

const statusVariant = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-gray-100 text-gray-800',
};

const statusIcon = {
  pending: <ClockIcon className="h-4 w-4" />,
  confirmed: <CheckCircle className="h-4 w-4" />,
  in_progress: <ClockIcon className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
};

const statusLabel = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export default function ProviderBookings({ bookings, stats }: ProviderBookingsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    }
    
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const getTimeRemaining = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = date.getTime() - now.getTime();
    
    if (diffInMs <= 0) return 'Ongoing';
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffInDays > 0) {
      return `in ${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `in ${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
    } else {
      return `in ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">Requires your action</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <p className="text-xs text-gray-500 mt-1">Confirmed bookings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.revenue)} {stats.currency}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Schedule */}
      {bookings.today.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.today.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {booking.client.avatar_url ? (
                            <img 
                              src={booking.client.avatar_url} 
                              alt={booking.client.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{booking.client.name}</h3>
                          <Badge className={statusVariant[booking.status]}>
                            {statusLabel[booking.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{booking.provider_service.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(booking.scheduled_at)}</span>
                          <span>•</span>
                          <span>{booking.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/messages?user_id=${booking.client.id}`}>
                          Message
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Pending Approvals */}
      {bookings.pending.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pending Approval</CardTitle>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {bookings.pending.length} requests
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.pending.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {booking.client.avatar_url ? (
                            <img 
                              src={booking.client.avatar_url} 
                              alt={booking.client.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">{booking.client.name}</h3>
                        <p className="text-sm text-gray-600">{booking.provider_service.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.scheduled_at)}</span>
                          <span>•</span>
                          <span>{booking.duration} minutes</span>
                        </div>
                        {booking.price !== null && (
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(booking.price)} {booking.currency}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Upcoming Bookings */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" asChild>
            <Link href="/bookings">
              View All Bookings
            </Link>
          </Button>
        </div>
        
        <TabsContent value="upcoming" className="space-y-4">
          {bookings.upcoming.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bookings.upcoming.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {booking.client.avatar_url ? (
                              <img 
                                src={booking.client.avatar_url} 
                                alt={booking.client.name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.client.name}</h3>
                            <Badge className={statusVariant[booking.status]}>
                              {statusLabel[booking.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{booking.provider_service.title}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(booking.scheduled_at)}</span>
                            <span>•</span>
                            <span>{getTimeRemaining(booking.scheduled_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/messages?user_id=${booking.client.id}`}>
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming bookings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any upcoming bookings scheduled.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/services">
                      View Available Services
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          {bookings.recent.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bookings.recent.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {booking.client.avatar_url ? (
                              <img 
                                src={booking.client.avatar_url} 
                                alt={booking.client.name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.client.name}</h3>
                            <Badge className={statusVariant[booking.status]}>
                              {statusLabel[booking.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{booking.provider_service.title}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(booking.scheduled_at)}</span>
                            <span>•</span>
                            <span>{booking.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/bookings/${booking.id}/review`}>
                            Add Review
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No recent bookings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any recent bookings.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
