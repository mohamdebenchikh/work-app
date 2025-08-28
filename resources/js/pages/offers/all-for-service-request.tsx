import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { PaginatedOffers, ServiceRequest, SharedData, Offer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InfinityScroll from '@/components/infinity-scroll';

interface AllOffersForServiceRequestPageProps extends SharedData {
    serviceRequest: ServiceRequest;
    offers: PaginatedOffers;
}

export default function AllOffersForServiceRequest({ serviceRequest, offers: initialOffers }: AllOffersForServiceRequestPageProps) {
    return (
        <AppLayout>
            <Head title={`All Offers for ${serviceRequest.title}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-6">
                        All Offers for "
                        <Link href={route('service-requests.show', serviceRequest.id)} className="hover:underline">
                            {serviceRequest.title}
                        </Link>"
                    </h2>

                    {initialOffers.data.length > 0 ? (
                        <div className="space-y-6">
                            <InfinityScroll
                                initialData={initialOffers}
                                resourceName="offers"
                                renderItem={(offer: Offer) => (
                                    <Card key={offer.id}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                            <CardTitle className="text-lg">
                                                Offer by {offer.user.name}
                                            </CardTitle>
                                            <Badge variant={offer.status === 'accepted' ? 'default' : 'secondary'}>
                                                {offer.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={offer.user.avatar} />
                                                    <AvatarFallback>{offer.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">Offered price: ${offer.price}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(offer.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                {offer.message}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            />
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No offers have been made for this service request yet.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
