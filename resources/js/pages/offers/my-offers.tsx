import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Offer, PaginatedOffers, SharedData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OfferDialog from '@/components/offer/offer-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import InfinityScroll from '@/components/infinity-scroll';

interface MyOffersPageProps extends SharedData {
    offers: PaginatedOffers;
}

export default function MyOffers({ offers: initialOffers }: MyOffersPageProps) {
    const { delete: destroy } = useForm({});

    const handleDelete = (offerId: number) => {
        destroy(route('offers.destroy', offerId), {
            onSuccess: () => {
                toast.success('Offer deleted successfully!');
            },
            onError: () => {
                toast.error('Failed to delete offer.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="My Offers" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h2 className="mb-6 text-2xl font-bold">My Offers</h2>

                    {initialOffers.data.length > 0 ? (
                        <div className="space-y-6">
                            <InfinityScroll
                                initialData={initialOffers}
                                resourceName="offers"
                                renderItem={(offer: Offer) => (
                                    <Card key={offer.id}>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                            <CardTitle className="text-lg">
                                                <Link href={route('service-requests.show', offer.service_request.id)} className="hover:underline">
                                                    Offer for "{offer.service_request.title}"
                                                </Link>
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
                                                    <p className="font-medium">Offered by {offer.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Price: {formatCurrency(offer.price)} - {new Date(offer.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="line-clamp-3 text-sm text-muted-foreground">{offer.message}</p>
                                            <div className="mt-4 flex gap-2">
                                                {offer.is_mine && (
                                                    <OfferDialog
                                                        offer={offer}
                                                        onSuccess={() => window.location.reload()}
                                                        trigger={
                                                            <Button variant="outline" size="sm">Edit</Button>
                                                        }
                                                    />
                                                )}
                                                {offer.is_mine && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">Delete</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete your offer.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(offer.id)}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            />
                        </div>
                    ) : (
                        <p className="text-muted-foreground">You haven't made any offers yet.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
