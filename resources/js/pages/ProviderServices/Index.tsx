import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProviderServiceCard from '@/components/ProviderServiceCard';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedResponse, SharedData } from '@/types';
import { ProviderServiceStatus, type ProviderService } from '@/types/provider-service';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';

// Define the page props type
interface IndexPageProps extends Omit<SharedData, 'categories'> {
    services: PaginatedResponse<ProviderService>;
    filters: {
        search: string;
        category: string;
        status: string;
    };
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

export default function Index({ services }: IndexPageProps) {
    const { data, meta } = services;
    const { total, from, to, links } = meta;

    // Helper function to get pagination URL by label
    const getPaginationUrl = (label: string): string | null => {
        const link = links.find((link) => link.label.toLowerCase().includes(label.toLowerCase()));
        return link?.url || null;
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams();

        if (formData.get('search')) {
            params.set('search', formData.get('search') as string);
        }

        if (formData.get('status')) {
            params.set('status', formData.get('status') as string);
        } else {
            params.delete('status');
        }
        router.get(route('provider-services.index') + '?' + params.toString());
    };

    const handleStatusChange = (status: ProviderServiceStatus | 'all') => {
        const params = new URLSearchParams(window.location.search);
        if (status && status !== 'all') {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        router.get(route('provider-services.index') + '?' + params.toString());
    };

    const handleDelete = (id: string | number) => {
        router.delete(route('provider-services.destroy', id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'My Services', href: route('provider-services.index') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Services" />
            <div className="container mx-auto max-w-6xl p-4 py-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">My Services</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your services and view their status
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('provider-services.create')} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Service
                        </Link>
                    </Button>
                </div>

                <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="space-y-4 sm:flex sm:items-end sm:space-x-4 sm:space-y-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search services..."
                                className="w-full pl-8"
                                defaultValue={new URLSearchParams(window.location.search).get('search') || ''}
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <Select
                                name="status"
                                onValueChange={handleStatusChange}
                                defaultValue={new URLSearchParams(window.location.search).get('status') || 'all'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value={ProviderServiceStatus.DRAFT}>Draft</SelectItem>
                                    <SelectItem value={ProviderServiceStatus.ACTIVE}>Active</SelectItem>
                                    <SelectItem value={ProviderServiceStatus.INACTIVE}>Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </form>
                </div>

                {data.length === 0 ? (
                    <div className="rounded-lg border bg-card p-8 text-center">
                        <div className="mx-auto max-w-md">
                            <h3 className="text-lg font-medium">No services found</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {total === 0 ? 'Get started by creating your first service.' : 'Try adjusting your search or filter criteria.'}
                            </p>
                            <div className="mt-6">
                                <Button asChild>
                                    <Link href={route('provider-services.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Service
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {data.map((service: ProviderService) => (
                                <ProviderServiceCard 
                                    key={service.id} 
                                    service={service}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border bg-card p-4 sm:flex-row">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{from || 0}</span> to{' '}
                                <span className="font-medium">{to || 0}</span> of{' '}
                                <span className="font-medium">{total}</span> results
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {getPaginationUrl('first') && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(getPaginationUrl('first') as string)}
                                        disabled={!getPaginationUrl('previous')}
                                    >
                                        First
                                    </Button>
                                )}
                                {getPaginationUrl('previous') && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => router.get(getPaginationUrl('previous') as string)}
                                    >
                                        Previous
                                    </Button>
                                )}
                                {getPaginationUrl('next') && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => router.get(getPaginationUrl('next') as string)}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
