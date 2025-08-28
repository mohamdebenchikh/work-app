import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { SharedData, PaginatedResponse, User, Category } from '@/types';
import { Button } from '@/components/ui/button';
import InfinityScroll from '@/components/infinity-scroll';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { List, Grid3X3, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProviderCard from '@/components/provider-card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';

interface ProvidersIndexPageProps extends SharedData {
    providers: PaginatedResponse<User>;
    categories: Category[];
    filters: {
        search: string | null;
        category: string | null;
        city: string | null;
    };
}

export default function ProvidersIndex({ providers: initialProviders, categories, filters }: ProvidersIndexPageProps) {
    const { data, setData, get } = useForm({
        search: filters.search,
        category: filters.category,
        city: filters.city,
    });

    const [view, setView] = useState<'list' | 'grid'>('grid'); // Default to grid view

    const handleFilter = () => {
        get(route('providers.index'), {
            ...data,
            preserveScroll: true,
            preserveState: true,
            only: ['providers', 'filters'],
        });
    };

    return (
        <AppLayout>
            <Head title="Browse Providers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold">Browse Providers</h1>
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
                            <Button asChild size="sm">
                                <Link href={route('service-requests.create')}>
                                    Become a Provider
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Main Filters (Search, Category, City) */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Input
                            placeholder="Search by name or profession..."
                            value={data.search || ''}
                            onChange={(e) => setData('search', e.target.value)}
                            className="md:flex-1"
                        />

                        <Select onValueChange={(value) => setData('category', value === 'all' ? null : value)} value={data.category || ''}>
                            <SelectTrigger className="md:w-[180px]">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.slug}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Filter by City..."
                            value={data.city || ''}
                            onChange={(e) => setData('city', e.target.value)}
                            className="md:w-[180px]"
                        />

                        <Button onClick={handleFilter}>Apply Filters</Button>
                    </div>

                    {initialProviders.data.length > 0 ? (
                        view === 'list' ? (
                            <div className="space-y-4">
                                <InfinityScroll
                                    initialData={initialProviders}
                                    resourceName="providers"
                                    renderItem={(provider: User) => (
                                        <ProviderCard key={provider.id} provider={provider} />
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {initialProviders.data.map((provider) => (
                                    <ProviderCard key={provider.id} provider={provider} />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className='text-center h-24 flex items-center justify-center'>
                            <p className="text-muted-foreground">No providers found.</p>
                        </div>
                    )}
                    
                    {/* Traditional Pagination for Grid View */}
                    {view === 'grid' && initialProviders.meta.last_page > 1 && (
                        <div className="mt-6">
                            <Pagination>
                                <PaginationContent>
                                    {initialProviders.meta.links.map((link, index) => {
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
                                                        size="default"
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
