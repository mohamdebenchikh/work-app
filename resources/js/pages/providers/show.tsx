import AppLayout from '@/layouts/app-layout';
import { Head,  router } from '@inertiajs/react';
import { User, SharedData, Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Briefcase, Star, Mail, Phone, Calendar as CalendarIcon, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO, isValid } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReviewForm from '@/components/review-form';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ShowProviderPageProps extends SharedData {
    provider: User;
    hasReviewed: boolean;
}

export default function ShowProvider({ provider, auth, hasReviewed }: ShowProviderPageProps) {
    const formattedMemberSince = provider.created_at
        ? (isValid(parseISO(provider.created_at)) ? format(parseISO(provider.created_at), 'PP') : 'N/A')
        : 'N/A';

    const birthdate = provider.birthdate
        ? (isValid(parseISO(provider.birthdate)) ? format(parseISO(provider.birthdate), 'PPP') : 'N/A')
        : 'N/A';

    const displayRole = provider.role ? provider.role.charAt(0).toUpperCase() + provider.role.slice(1) : 'User';

    const handleReviewSuccess = () => {
        router.reload({ only: ['provider', 'hasReviewed'] });
    };

    const handleDeleteReview = (reviewId: number) => {
        router.delete(route('reviews.destroy', reviewId), {
            onSuccess: () => {
                handleReviewSuccess();
            },
        });
    };

    if (!provider) {
        return (
            <AppLayout>
                <Head title="Provider Not Found" />
                <div className='py-8'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center'>
                        <h2 className="text-2xl font-bold">Provider Not Found</h2>
                        <p className="text-muted-foreground mt-2">The requested provider could not be loaded.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={cn(
                    "h-4 w-4",
                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                )}
            />
        ));
    };

    return (
        <AppLayout>
            <Head title={provider.name || 'Provider Profile'} />

            <div className='py-8'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader className="text-center">
                            <Avatar className="h-24 w-24 mx-auto mb-4">
                                <AvatarImage src={provider.avatar || '/images/default-avatar.png'} alt={provider.name || 'Provider'} />
                                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-semibold">
                                    {provider.name?.charAt(0).toUpperCase() || 'P'}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-3xl font-bold mb-2">{provider.name || 'Unknown Provider'}</CardTitle>
                            {provider.profession && (
                                <p className="text-muted-foreground text-lg flex items-center justify-center gap-2 mb-3">
                                    <Briefcase className="h-5 w-5" /> {provider.profession}
                                </p>
                            )}
                            <div className="flex items-center justify-center gap-4 text-muted-foreground">
                                {(provider.city || provider.country) && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" /> {provider.city}, {provider.country}
                                    </div>
                                )}
                                {provider.rating_average !== undefined && provider.rating_average !== null && ( 
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> { (typeof provider.rating_average === 'number' ? provider.rating_average : 0).toFixed(1) } ({provider.reviews_count} reviews)
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {provider.bio && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">About Me</h3>
                                    <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
                                </div>
                            )}

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                                    <ul className="space-y-2 text-muted-foreground">
                                        {provider.email && (
                                            <li className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-primary" />
                                                <span>{provider.email}</span>
                                            </li>
                                        )}
                                        {provider.phone && (
                                            <li className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-primary" />
                                                <span>{provider.phone}</span>
                                            </li>
                                        )}
                                        {provider.address && (
                                            <li className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                <span>{provider.address}</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Details</h3>
                                    <ul className="space-y-2 text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                            <span>Role: {displayRole}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-primary" />
                                            <span>Birthdate: {birthdate}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-primary" />
                                            <span>Member Since: {formattedMemberSince}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <Separator />

                            {provider.categories && provider.categories.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {provider.categories.map(category => (
                                            <Badge key={category.id} variant="secondary">{category.name}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {provider.skills && provider.skills.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {provider.skills.map(skill => (
                                            <Badge key={skill.id} variant="outline">{skill.name}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Leave a Review / Contact Button */} 
                            {auth.user && !provider.is_mine && !hasReviewed && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full flex items-center gap-2">
                                            <MessageCircle className='h-4 w-4' />
                                            Leave a Review
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Leave a Review for {provider.name}</DialogTitle>
                                        </DialogHeader>
                                        <ReviewForm providerId={provider.id} onSuccess={handleReviewSuccess} />
                                    </DialogContent>
                                </Dialog>
                            )}
                            {(!auth.user || provider.is_mine || hasReviewed) && (
                                <Button className="w-full">Contact {provider.name || 'Provider'}</Button>
                            )}

                            <Separator />

                            {/* Reviews Section */} 
                            {provider.reviews_received && provider.reviews_received.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Reviews ({provider.reviews_count})</h3>
                                    <div className="space-y-6">
                                        {provider.reviews_received.map((review: Review) => (
                                            <div key={review.id} className="flex items-start gap-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={review.reviewer.avatar || '/images/default-avatar.png'} />
                                                    <AvatarFallback>{review.reviewer.name?.charAt(0).toUpperCase() || 'R'}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-semibold">{review.reviewer.name}</p>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            {renderStars(review.rating)}
                                                            <span className="ml-1">{format(parseISO(review.created_at), 'PP')}</span>
                                                        </div>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                                                    )}
                                                    {auth.user?.id === review.reviewer_id && (
                                                        <div className="mt-2 flex gap-2">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" size="sm">Edit</Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Edit Your Review</DialogTitle>
                                                                    </DialogHeader>
                                                                    <ReviewForm providerId={provider.id} review={review} onSuccess={handleReviewSuccess} />
                                                                </DialogContent>
                                                            </Dialog>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="destructive" size="sm">Delete</Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently delete your review.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDeleteReview(review.id)}>Continue</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
