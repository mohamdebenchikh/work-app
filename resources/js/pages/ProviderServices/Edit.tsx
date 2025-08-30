import ProviderServiceForm from '@/components/ProviderServiceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, SharedData } from '@/types';
import { ProviderService, ProviderServiceStatus, UpdateProviderServiceData } from '@/types/provider-service';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface EditPageProps extends SharedData {
    service: ProviderService;
    categories: Category[];
}

export default function Edit({ auth, service, categories }: EditPageProps) {
    const { data, setData, put, processing, errors } = useForm<UpdateProviderServiceData>({
        title: service.title,
        description: service.description || '',
        price: service.price,
        category_id: service.category_id || 0,
        country: service.country,
        city: service.city,
        is_local_only: service.is_local_only,
        latitude: service.latitude,
        longitude: service.longitude,
        include_transport: service.include_transport,
        status: service.status || ProviderServiceStatus.DRAFT,
    });

    const handleSubmit = (formData: UpdateProviderServiceData) => {
        put(route('provider-services.update', service.id), {
            onSuccess: () => {
                toast.success('Service updated successfully!');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'My Services', href: route('provider-services.index') },
        { title: `Edit ${service.title}`, href: route('provider-services.edit', service.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${service.title}`} />

            <div className="container mx-auto max-w-6xl p-4 py-12">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Service</h1>
                    <Button asChild variant="outline">
                        <a href={route('provider-services.show', service.id)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Service
                        </a>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProviderServiceForm
                            service={service}
                            categories={categories}
                            onSubmit={handleSubmit}
                            buttonText="Update Service"
                            isProcessing={processing}
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
