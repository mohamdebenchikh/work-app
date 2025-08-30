import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { SharedData, ProviderService } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import AddBookingDialog from '@/components/booking/AddBookingDialog';

// Define the required types for the booking dialog
interface BookingProviderService {
  id: number;
  title: string;
  price: number | null;
  currency: string;
  duration: number;
  user: {
    id: number;
    name: string;
  };
  availability: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
}

interface ServiceShowPageProps extends SharedData {
    service: ProviderService;
    relatedServices: ProviderService[];
}

export default function ServiceShow({ service, relatedServices }: ServiceShowPageProps) {
    return (
        <AppLayout>
            <Head title={service.title} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold">{service.title}</h1>
                                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {service.city}, {service.country}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                        ${service.price}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose max-w-none">
                                    <h3 className="text-lg font-semibold mb-2">Service Description</h3>
                                    <p className="text-muted-foreground">
                                        {service.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Provider Information */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">About the Provider</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={service.user?.avatar_url} alt={service.user?.name} />
                                        <AvatarFallback>{service.user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-medium">{service.user?.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Member since {service.user?.created_at ? format(new Date(service.user.created_at), 'MMMM yyyy') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <span className="h-5 w-5 mr-2 text-muted-foreground">$</span>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Price</p>
                                        <p className="font-medium">${service.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="font-medium">{service.city}, {service.country}</p>
                                    </div>
                                </div>
                                {service.is_local_only && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                        <p className="text-yellow-700 text-sm">
                                            This service is only available locally in {service.city}.
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <Button className="w-full" size="lg" variant="outline">
                                        Contact Provider
                                    </Button>
<AddBookingDialog 
                                        providerService={{
                                            id: service.id,
                                            title: service.title,
                                            price: service.price,
                                            currency: 'USD',
                                            duration: 60,
                                            user: {
                                                id: service.user?.id || 0,
                                                name: service.user?.name || 'Unknown'
                                            },
                                            availability: []
                                        }}
                                        triggerText="Book Now"
                                        triggerVariant="default"
                                        triggerSize="lg"
                                        triggerClassName="w-full"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {relatedServices.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Related Services</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {relatedServices.map((relatedService) => (
                                        <Link 
                                            key={relatedService.id} 
                                            href={route('services.show', relatedService.id)}
                                            className="block hover:bg-muted/50 p-3 rounded-lg transition-colors"
                                        >
                                            <h4 className="font-medium">{relatedService.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                ${relatedService.price}
                                            </p>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
