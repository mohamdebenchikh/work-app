import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, MessageSquare, User, CreditCard, AlertCircle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface BookingDetailsProps {
  booking: {
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
  };
  onCancel?: () => void;
  onConfirm?: () => void;
  onComplete?: () => void;
  onReview?: () => void;
  isProcessing?: boolean;
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
  pending: <ClockIcon className="h-5 w-5 text-yellow-500" />,
  confirmed: <CheckCircle className="h-5 w-5 text-blue-500" />,
  in_progress: <ClockIcon className="h-5 w-5 text-purple-500" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />,
  cancelled: <XCircle className="h-5 w-5 text-red-500" />,
  rejected: <XCircle className="h-5 w-5 text-gray-500" />,
};

const statusLabel = {
  pending: 'Pending Confirmation',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

export default function BookingDetails({ 
  booking, 
  onCancel, 
  onConfirm, 
  onComplete, 
  onReview, 
  isProcessing = false 
}: BookingDetailsProps) {
  const scheduledDate = new Date(booking.scheduled_at);
  const isPastBooking = isPast(scheduledDate);
  const isCurrentUserClient = booking.client.id === window.auth.user.id;
  const provider = booking.provider_service?.user || booking.provider;
  
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    }
    
    return format(date, 'EEEE, MMMM d, yyyy h:mm a');
  };
  
  const getStatusMessage = () => {
    switch (booking.status) {
      case 'pending':
        return 'Waiting for provider confirmation.';
      case 'confirmed':
        return 'Your booking has been confirmed. See you soon!';
      case 'in_progress':
        return 'Your service is currently in progress.';
      case 'completed':
        return 'This booking has been completed.';
      case 'cancelled':
        return booking.cancellation_reason 
          ? `Cancelled: ${booking.cancellation_reason}`
          : 'This booking has been cancelled.';
      case 'rejected':
        return booking.rejection_reason
          ? `Rejected: ${booking.rejection_reason}`
          : 'This booking has been rejected.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Status Banner */}
      <div className={`p-4 rounded-lg ${statusVariant[booking.status]} flex items-start gap-3`}>
        <div className="flex-shrink-0 mt-0.5">
          {statusIcon[booking.status]}
        </div>
        <div>
          <h3 className="font-medium">{statusLabel[booking.status]}</h3>
          <p className="text-sm">{getStatusMessage()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    {provider.avatar_url ? (
                      <img 
                        src={provider.avatar_url} 
                        alt={provider.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{booking.provider_service.title}</h3>
                  <p className="text-sm text-gray-600">With {provider.name}</p>
                  {booking.price !== null && (
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(booking.price)} {booking.currency}
                    </p>
                  )}
                </div>
              </div>
              
              {booking.provider_service.description && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Service Description</h4>
                  <p className="text-sm text-gray-600">{booking.provider_service.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Date & Time</h4>
                    <p className="text-sm text-gray-600">
                      {format(scheduledDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(scheduledDate, 'h:mm a')} - {format(new Date(scheduledDate.getTime() + booking.duration * 60000), 'h:mm a')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.duration} minutes
                    </p>
                  </div>
                </div>
                
                {booking.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Location</h4>
                      <p className="text-sm text-gray-600">{booking.location.address}</p>
                      <p className="text-sm text-gray-600">
                        {booking.location.city}
                        {booking.location.state ? `, ${booking.location.state}` : ''}
                        {booking.location.postal_code ? `, ${booking.location.postal_code}` : ''}
                      </p>
                      <p className="text-sm text-gray-600">{booking.location.country}</p>
                      
                      {booking.location.lat && booking.location.lng && (
                        <div className="mt-2 h-32 bg-gray-100 rounded-md overflow-hidden">
                          {/* Map would go here */}
                          <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                            Map View
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {(booking.notes || booking.provider_notes) && (
                <div className="pt-2">
                  {booking.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Your Notes
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                        {booking.notes}
                      </div>
                    </div>
                  )}
                  
                  {booking.provider_notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Provider Notes
                      </h4>
                      <div className="p-3 bg-blue-50 rounded-md text-sm text-gray-700">
                        {booking.provider_notes}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {booking.can_confirm && isCurrentUserClient && (
              <Button 
                onClick={onConfirm} 
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? 'Processing...' : 'Confirm Booking'}
              </Button>
            )}
            
            {booking.can_cancel && (
              <Button 
                variant="outline" 
                onClick={onCancel}
                disabled={isProcessing}
                className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
              >
                {isProcessing ? 'Processing...' : 'Cancel Booking'}
              </Button>
            )}
            
            {booking.can_complete && !isCurrentUserClient && (
              <Button 
                onClick={onComplete}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? 'Processing...' : 'Mark as Completed'}
              </Button>
            )}
            
            {booking.can_review && isPastBooking && isCurrentUserClient && (
              <Button 
                variant="outline"
                onClick={onReview}
                className="w-full sm:w-auto"
              >
                Write a Review
              </Button>
            )}
            
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/messages?user_id=${isCurrentUserClient ? provider.id : booking.client.id}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message {isCurrentUserClient ? provider.name.split(' ')[0] : booking.client.name.split(' ')[0]}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {provider.avatar_url ? (
                      <img 
                        src={provider.avatar_url} 
                        alt={provider.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{provider.name}</h3>
                  <p className="text-sm text-gray-600">Service Provider</p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/providers/${provider.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/messages?user_id=${provider.id}`}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {(provider.email || provider.phone) && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Email:</span>
                      <a href={`mailto:${provider.email}`} className="text-blue-600 hover:underline">
                        {provider.email}
                      </a>
                    </li>
                    {provider.phone && (
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Phone:</span>
                        <a href={`tel:${provider.phone}`} className="text-blue-600 hover:underline">
                          {provider.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service Fee</span>
                  <span className="text-sm font-medium">
                    {booking.price ? `${formatCurrency(booking.price)} ${booking.currency}` : 'Price on request'}
                  </span>
                </div>
                
                {booking.price !== null && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      {formatCurrency(booking.price)} {booking.currency}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Booking ID: {booking.id}</p>
                  <p>Created: {format(new Date(booking.created_at), 'MMM d, yyyy')}</p>
                  {booking.updated_at && (
                    <p>Last updated: {format(new Date(booking.updated_at), 'MMM d, yyyy')}</p>
                  )}
                  {booking.completed_at && (
                    <p>Completed: {format(new Date(booking.completed_at), 'MMM d, yyyy')}</p>
                  )}
                  {booking.cancelled_at && (
                    <p>Cancelled: {format(new Date(booking.cancelled_at), 'MMM d, yyyy')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Need Help? */}
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                If you have any questions or need assistance with your booking, please contact our support team.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
