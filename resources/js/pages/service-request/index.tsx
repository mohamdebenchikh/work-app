import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { SharedData, PaginatedResponse, ServiceRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceRequestCard from '@/components/service-request/service-request-card';
import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface ServiceRequestsPageProps extends SharedData {
    serviceRequests: PaginatedResponse<ServiceRequest>;
}

export default function ServiceRequestIndex({ serviceRequests: initialServiceRequests }: ServiceRequestsPageProps) {
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(initialServiceRequests.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialServiceRequests.next_page_url);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    // Function to load more service requests
    const loadMoreServiceRequests = useCallback(async () => {
        if (loading || !nextPageUrl) return;
        
        setLoading(true);
        try {
            const response = await fetch(nextPageUrl);
            const data = await response.json();
            
            setServiceRequests(prev => [...prev, ...data.data]);
            setNextPageUrl(data.next_page_url);
        } catch (error) {
            console.error('Error loading more service requests:', error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [loading, nextPageUrl]);

    // Set up scroll event listener
    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
        }

        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop 
                !== document.documentElement.offsetHeight || loading) {
                return;
            }
            loadMoreServiceRequests();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreServiceRequests, loading, initialLoad]);

    return (
        <AppLayout>
            <Head title='Service Requests' />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <Card>
                        <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                            <CardTitle className="text-2xl">All Service Requests</CardTitle>
                            <Button asChild size="sm">
                                <Link href={route('service-requests.create')}>
                                    Create Service Request
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {serviceRequests.length > 0 ? (
                                    serviceRequests.map((serviceRequest) => (
                                        <ServiceRequestCard key={serviceRequest.id} serviceRequest={serviceRequest} />
                                    ))
                                ) : (
                                    <div className='text-center h-24 flex items-center justify-center'>
                                        <p className="text-muted-foreground">No service requests found.</p>
                                    </div>
                                )}
                            </div>
                            
                            {loading && (
                                <div className="flex justify-center mt-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            )}
                            
                            {!nextPageUrl && serviceRequests.length > 0 && (
                                <div className="text-center mt-6">
                                    <p className="text-sm text-muted-foreground">
                                        You've reached the end of the list.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}