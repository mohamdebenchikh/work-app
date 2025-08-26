import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { SharedData, ServiceRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
    Calendar, 
    DollarSign, 
    MapPin, 
    Tag, 
    User, 
    Clock,
    Star,
    MessageCircle
} from 'lucide-react';

interface ShowServiceRequestPageProps extends SharedData {
    serviceRequest: ServiceRequest;
}

export default function ShowServiceRequest({ serviceRequest, auth }: ShowServiceRequestPageProps) {
    const isOwner = auth.user?.id === serviceRequest.user.id;
    const formattedDate = new Date(serviceRequest.deadline_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const memberSince = new Date(serviceRequest.user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    return (
        <AppLayout>
            <Head title={serviceRequest.title} />

            <div className='py-8'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    {/* Header Section */}
                    <div className='mb-8'>
                        <div className='bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border'>
                            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
                                <div className='flex-1'>
                                    <h1 className='text-3xl font-bold mb-3'>{serviceRequest.title}</h1>
                                    <div className='flex items-center gap-4 text-muted-foreground mb-4'>
                                        <div className='flex items-center gap-2'>
                                            <Clock className='h-4 w-4' />
                                            <span className='text-sm'>
                                                Posted {new Date(serviceRequest.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Tag className='h-4 w-4' />
                                            <Badge variant="secondary">{serviceRequest.category.name}</Badge>
                                        </div>
                                    </div>
                                    {serviceRequest.skills && serviceRequest.skills.length > 0 && (
                                        <div className='flex flex-wrap gap-2'>
                                            {serviceRequest.skills.map((skill) => (
                                                <Badge key={skill.id} variant="outline">
                                                    {skill.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Action Buttons */}
                                <div className='flex flex-col sm:flex-row gap-3'>
                                    {!isOwner && (
                                        <>
                                            <Button size="lg" className='flex items-center gap-2'>
                                                <MessageCircle className='h-4 w-4' />
                                                Make Offer
                                            </Button>
                                            <Button variant="outline" size="lg" className='flex items-center gap-2'>
                                                <User className='h-4 w-4' />
                                                Contact
                                            </Button>
                                        </>
                                    )}
                                    {isOwner && (
                                        <Link href={route('service-requests.edit', serviceRequest.id)}>
                                            <Button variant="outline" size="lg">
                                                Edit Request
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-8 lg:grid-cols-3'>
                        {/* Main Content */}
                        <div className='lg:col-span-2 space-y-6'>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-2'>
                                        <MessageCircle className='h-5 w-5' />
                                        Project Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='prose max-w-none'>
                                        {serviceRequest.description ? (
                                            <p className='text-foreground leading-relaxed whitespace-pre-wrap'>
                                                {serviceRequest.description}
                                            </p>
                                        ) : (
                                            <p className='text-muted-foreground italic'>
                                                No description provided for this service request.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Project Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='grid gap-6 sm:grid-cols-2'>
                                        <div className='flex items-center gap-3'>
                                            <div className='p-2 bg-primary/10 rounded-lg'>
                                                <DollarSign className='h-5 w-5 text-primary' />
                                            </div>
                                            <div>
                                                <p className='font-semibold'>Budget</p>
                                                <p className='text-2xl font-bold text-primary'>
                                                    ${serviceRequest.budget}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            <div className='p-2 bg-primary/10 rounded-lg'>
                                                <Calendar className='h-5 w-5 text-primary' />
                                            </div>
                                            <div>
                                                <p className='font-semibold'>Deadline</p>
                                                <p className='text-lg font-medium'>
                                                    {formattedDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className='space-y-6'>
                            {/* Location Card */}
                            {(serviceRequest.city || serviceRequest.country) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className='flex items-center gap-2'>
                                            <MapPin className='h-5 w-5' />
                                            Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='space-y-2'>
                                        {serviceRequest.address && (
                                            <p className='font-medium'>{serviceRequest.address}</p>
                                        )}
                                        <p className='text-muted-foreground'>
                                            {[serviceRequest.city, serviceRequest.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Client Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-2'>
                                        <User className='h-5 w-5' />
                                        Client Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex items-center gap-4 mb-4'>
                                        <Avatar className='h-12 w-12'>
                                            <AvatarImage src={serviceRequest.user.avatar} />
                                            <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                                                {serviceRequest.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className='font-semibold text-lg'>{serviceRequest.user.name}</p>
                                            <p className='text-sm text-muted-foreground'>
                                                Member since {memberSince}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <Separator className='my-4' />
                                    
                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-muted-foreground'>Projects Posted</span>
                                            <span className='font-semibold'>12</span>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-muted-foreground'>Success Rate</span>
                                            <div className='flex items-center gap-1'>
                                                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                                                <span className='font-semibold'>4.8</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-muted-foreground'>Response Time</span>
                                            <span className='font-semibold'>2 hours</span>
                                        </div>
                                    </div>

                                    {!isOwner && (
                                        <>
                                            <Separator className='my-4' />
                                            <Button variant="outline" className='w-full'>
                                                View Profile
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Make Offer CTA */}
                            {!isOwner && (
                                <Card className='bg-primary/5 border-primary/20'>
                                    <CardContent className='pt-6'>
                                        <div className='text-center space-y-4'>
                                            <div>
                                                <h3 className='font-bold text-lg mb-2'>Ready to help?</h3>
                                                <p className='text-muted-foreground text-sm'>
                                                    Submit your proposal and start working on this project
                                                </p>
                                            </div>
                                            <Button size="lg" className='w-full'>
                                                <MessageCircle className='h-4 w-4 mr-2' />
                                                Make an Offer
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}