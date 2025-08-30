import ProviderServiceForm from '@/components/ProviderServiceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category, SharedData } from '@/types';
import { CreateProviderServiceData, ProviderServiceStatus } from '@/types/provider-service';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePageProps extends SharedData {
    categories: Category[];
}

export default function Create({ categories }: CreatePageProps) {
    const { data, setData, post, processing, errors } = useForm<CreateProviderServiceData>({
        title: '',
        description: '',
        price: null,
        category_id: categories[0]?.id || 0,
        country: '',
        city: '',
        is_local_only: false,
        include_transport: false,
        status: ProviderServiceStatus.DRAFT,
    });

    const handleSubmit = () => {
        post(route('provider-services.store'), {
            onSuccess: () => {
                toast.success('Service created successfully!');
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'My Services', href: route('provider-services.index') },
        { title: 'Create Service', href: route('provider-services.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Service" />
            <div className="container max-w-6xl p-4 py-12">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create New Service</h1>
                    <Button asChild variant="outline">
                        <a href={route('provider-services.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Services
                        </a>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProviderServiceForm
                            categories={categories}
                            onSubmit={handleSubmit}
                            isProcessing={processing}
                            buttonText="Create Service"
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
