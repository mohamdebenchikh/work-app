import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { SharedData, PaginatedResponse, ProviderService } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { List, Grid3X3, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import ServiceCard from '@/components/service-card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

interface ServicesIndexPageProps extends SharedData {
    services: PaginatedResponse<ProviderService>;
    categories: Array<{ id: number; name: string }>;
    filters: {
        search?: string;
        category?: string;
        min_price?: number;
        max_price?: number;
    };
}

export default function ServicesIndex({ services: initialServices, categories, filters }: ServicesIndexPageProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { data, setData, get } = useForm({
        search: filters.search || '',
        category: filters.category || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('services.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            category: '',
            min_price: '',
            max_price: '',
        });
        get(route('services.index'));
    };

    return (
        <AppLayout>
            <Head title="Browse Services" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Browse Services</h1>
                        <p className="text-muted-foreground">Find and book professional services</p>
                    </div>

                    {/* Filters */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search services..."
                                        className="pl-10"
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
                                <Select
                                    value={data.category}
                                    onValueChange={(value) => setData('category', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="number"
                                    placeholder="Min price"
                                    value={data.min_price}
                                    onChange={(e) => setData('min_price', e.target.value)}
                                    min="0"
                                    step="0.01"
                                />

                                <Input
                                    type="number"
                                    placeholder="Max price"
                                    value={data.max_price}
                                    onChange={(e) => setData('max_price', e.target.value)}
                                    min={data.min_price || '0'}
                                    step="0.01"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply Filters
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* View Toggle */}
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Showing {initialServices.from} to {initialServices.to} of {initialServices.total} services
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={viewMode === 'grid' ? 'outline' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'outline' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Services Grid/List */}
                    {initialServices.data.length > 0 ? (
                        <>
                            <div
                                className={cn(
                                    'grid gap-6',
                                    viewMode === 'grid'
                                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                        : 'grid-cols-1'
                                )}
                            >
                                {initialServices.data.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {initialServices.last_page > 1 && (
                                <div className="flex justify-center mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            {initialServices.current_page > 1 && (
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href={initialServices.prev_page_url || '#'}
                                                    />
                                                </PaginationItem>
                                            )}

                                            {initialServices.meta?.links.map((link, index) => {
                                                if (link.label === '...') {
                                                    return (
                                                        <PaginationItem key={index}>
                                                            <span className="px-3 py-1">...</span>
                                                        </PaginationItem>
                                                    );
                                                }
                                                
                                                const page = link.label;
                                                const isCurrent = link.active;
                                                
                                                return (
                                                    <PaginationItem key={index}>
                                                        <PaginationLink
                                                            href={link.url || '#'}
                                                            isActive={isCurrent}
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            {initialServices.current_page < initialServices.last_page && (
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href={initialServices.next_page_url || '#'}
                                                    />
                                                </PaginationItem>
                                            )}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">No services found</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                            <Button variant="outline" onClick={handleReset}>
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
