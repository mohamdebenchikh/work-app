import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData, User } from '@/types';
import { ProviderServiceStatus, type ProviderService } from '@/types/provider-service';
import { Head, Link, router } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Calendar, CheckCircle, Edit, Mail, MapPin, Navigation, Phone, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

// Define the page props type
interface ShowPageProps extends SharedData {
    service: ProviderService;
    auth: {
        user: User;
    };
}

export default function Show({ auth, service }: ShowPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'My Services', href: route('provider-services.index') },
        { title: service.title, href: '#' },
    ];
    const getStatusBadge = (status: ProviderServiceStatus) => {
        const statusMap = {
            [ProviderServiceStatus.DRAFT]: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
            [ProviderServiceStatus.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
            [ProviderServiceStatus.INACTIVE]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
        } as const;

        const statusInfo = statusMap[status] || statusMap[ProviderServiceStatus.DRAFT];

        return <Badge className={`${statusInfo.bg} ${statusInfo.text} text-sm`}>{statusInfo.label}</Badge>;
    };

    const handleStatusToggle = () => {
        router.patch(
            route('provider-services.toggle-status', { providerService: service.id }),
            {},
            {
                onSuccess: () => {
                    toast.success('Service status updated successfully!');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={service.title} />

            <div className="container max-w-6xl p-4 py-12">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href={route('provider-services.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Services
                        </Link>
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{service.title}</h1>
                            <div className="mt-2 flex items-center text-muted-foreground">
                                <MapPin className="mr-1 h-4 w-4" />
                                <span>
                                    {service.city}, {service.country}
                                </span>
                                {service.is_local_only && <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-sm">Local only</span>}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={route('provider-services.edit',service.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>

                            <Button variant={service.status === 'active' ? 'outline' : 'default'} onClick={handleStatusToggle}>
                                {service.status === 'active' ? (
                                    <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Activate
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                        <p className="mt-1 whitespace-pre-line">{service.description || 'No description provided.'}</p>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                                            <p className="mt-1 font-medium">{formatCurrency(service.price)}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                                            <p className="mt-1">{service.category?.name || 'Uncategorized'}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Transport Included</h3>
                                            <p className="mt-1">{service.include_transport ? 'Yes' : 'No'}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                            <div className="mt-1">{getStatusBadge(service.status)}</div>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Provider Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                                            {service.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="font-medium">{service.user?.name || 'Unknown User'}</h3>
                                            <p className="text-sm text-muted-foreground">Service Provider</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>{service.user?.email || 'No email provided'}</span>
                                        </div>

                                        {service.user?.phone && (
                                            <div className="flex items-center text-sm">
                                                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>{service.user.phone}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center text-sm">
                                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {service.city}, {service.country}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-sm">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>Member since {new Date(service.user?.created_at || '').toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/providers/${service.user?.id}`}>
                                                <Navigation className="mr-2 h-4 w-4" />
                                                View Provider Profile
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Service Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full" onClick={handleStatusToggle}>
                                    {service.status === ProviderServiceStatus.ACTIVE ? (
                                        <>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Deactivate Service
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Activate Service
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full text-destructive hover:text-destructive"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
                                            router.delete(route('provider-services.destroy', { id: service.id }));
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Service
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
