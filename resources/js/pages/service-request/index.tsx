import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { SharedData, PaginatedResponse, ServiceRequest, Category } from '@/types';
import { Button } from '@/components/ui/button';
import ServiceRequestCard from '@/components/service-request/service-request-card';
import InfinityScroll from '@/components/infinity-scroll';
import { useState } from 'react';
import { List, Grid3X3 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import ExtraFiltersPopover from '@/components/service-request/extra-filters-popover';

interface ServiceRequestsPageProps extends SharedData {
    serviceRequests: PaginatedResponse<ServiceRequest>;
    categories: Category[];
    filters: {
        search: string | null;
        category: string | null;
        city: string | null;
        created_at: string | null;
        status: string | null;
        min_price: string | null;
        max_price: string | null;
    }
}

export default function ServiceRequestIndex({ serviceRequests: initialServiceRequests, categories, filters }: ServiceRequestsPageProps) {
    const { data, setData, get } = useForm({
        search: filters.search,
        category: filters.category,
        city: filters.city,
        created_at: filters.created_at,
        status: filters.status,
        min_price: filters.min_price,
        max_price: filters.max_price,
    });

    const [view, setView] = useState<'list' | 'grid'>('list'); // State for view mode

    const handleFilter = () => {
        get(route('service-requests.index'), {
            ...data,
            preserveScroll: true,
            preserveState: true,
            only: ['serviceRequests', 'filters'],
        });
    };

    return (
        <AppLayout>
            <Head title='Service Requests' />

            <div className='py-12'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                        <h1 className="text-2xl font-bold">All Service Requests</h1>
                        <div className="flex gap-3">
                            <Button
                                variant={view === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setView('list')}
                            >
                                <List className="h-4 w-4 mr-2" /> List View
                            </Button>
                            <Button
                                variant={view === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setView('grid')}
                            >
                                <Grid3X3 className="h-4 w-4 mr-2" /> Grid View
                            </Button>
                            <ExtraFiltersPopover
                                data={data}
                                categories={categories}
                                setData={setData}
                                handleFilter={handleFilter}
                            />
                            <Button asChild size="sm">
                                <Link href={route('service-requests.create')}>
                                    Create Service Request
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Main Filters (Search and City) */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Input
                            placeholder="Search by title or description..."
                            value={data.search || ''}
                            onChange={(e) => setData('search', e.target.value)}
                            className="md:flex-1"
                        />

                        <Input
                            placeholder="Filter by City..."
                            value={data.city || ''}
                            onChange={(e) => setData('city', e.target.value)}
                            className="md:w-[180px]"
                        />
                        
                        <Button onClick={handleFilter}>Apply Filters</Button>
                    </div>

                    {initialServiceRequests.data.length > 0 ? (
                        view === 'list' ? (
                            <div className="space-y-4">
                                <InfinityScroll
                                    initialData={initialServiceRequests}
                                    resourceName="serviceRequests"
                                    renderItem={(serviceRequest: ServiceRequest) => (
                                        <ServiceRequestCard key={serviceRequest.id} serviceRequest={serviceRequest} />
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {initialServiceRequests.data.map((serviceRequest) => (
                                    <ServiceRequestCard key={serviceRequest.id} serviceRequest={serviceRequest} />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className='text-center h-24 flex items-center justify-center'>
                            <p className="text-muted-foreground">No service requests found.</p>
                        </div>
                    )}
                    
                    {/* Traditional Pagination for Grid View */}
                    {view === 'grid' && initialServiceRequests.meta.last_page > 1 && (
                        <div className="mt-6">
                            <Pagination>
                                <PaginationContent>
                                    {initialServiceRequests.meta.links.map((link, index) => {
                                        // Render previous button
                                        if (link.label.includes('Previous')) {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationPrevious href={link.url || '#'} isActive={link.active} />
                                                </PaginationItem>
                                            );
                                        }
                                        // Render next button
                                        if (link.label.includes('Next')) {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationNext href={link.url || '#'} isActive={link.active} />
                                                </PaginationItem>
                                            );
                                        }
                                        // Render ellipsis
                                        if (link.url === null && link.label.includes('...')) {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        // Render page numbers
                                        if (link.url !== null && !isNaN(Number(link.label))) {
                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        href={link.url}
                                                        isActive={link.active}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}