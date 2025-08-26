import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Category, LocationDetails, ServiceRequest, SharedData, Skill } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/multi-select';
import InputError from '@/components/input-error';
import { toast } from 'sonner';
import { FormEventHandler } from 'react';
import { LocationPicker } from '@/components/location-picker';

interface CreateServiceRequestPageProps extends SharedData {
    categories: Category[];
    skills: Skill[];
    serviceRequest?: ServiceRequest;
}

export default function CreateServiceRequest({ categories, skills, auth }: CreateServiceRequestPageProps) {
    const { user } = auth;
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category_id: '',
        skills: [] as string[],
        budget: '',
        deadline_date: '',
        country: user?.country || '',
        city: user?.city || '',
        address: user?.address || '',
        latitude: user?.latitude || 0,
        longitude: user?.longitude || 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Remove the console.log and return statements that were blocking submission
        post(route('service-requests.store'), {
            onSuccess: () => {
                reset();
                toast.success('Service request created successfully.');
            },
            onError: () => {
                toast.error('Something went wrong. Please check the form for errors.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title='Create Service Request' />

            <div className='py-8'>
                <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
                    <Card>
                        <CardHeader >
                            <CardTitle className='text-xl font-bold'>
                                Create a New Service Request
                            </CardTitle>
                            <CardDescription className='mt-2'>
                                Tell us what you need help with - just a title and category to get started!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className='space-y-8'>
                                {/* Required Fields Section */}
                                <div className='bg-muted/30 p-6 rounded-lg border'>
                                    <h3 className='text-lg font-semibold text-foreground mb-4'>
                                        Required Information
                                    </h3>
                                    <div className='space-y-6'>
                                        <div>
                                            <Label htmlFor='title' className='text-sm font-medium'>
                                                Service Title *
                                            </Label>
                                            <Input
                                                id='title'
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder='e.g., Need help with website design'
                                                required
                                                className='mt-1'
                                            />
                                            <InputError message={errors.title} />
                                        </div>

                                        <div>
                                            <Label htmlFor='category_id' className='text-sm font-medium'>
                                                Category *
                                            </Label>
                                            <Select
                                                onValueChange={(value) => setData('category_id', value)}
                                                value={data.category_id}
                                                required
                                            >
                                                <SelectTrigger className='mt-1 w-full'>
                                                    <SelectValue placeholder='Choose a category' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={String(category.id)}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category_id} />
                                        </div>
                                    </div>
                                </div>

                                {/* Optional Fields Section */}
                                <div className='bg-muted/20 p-6 rounded-lg border'>
                                    <h3 className='text-lg font-semibold text-foreground mb-4'>
                                        Additional Details (Optional)
                                    </h3>
                                    <div className='space-y-6'>
                                        <div>
                                            <Label htmlFor='description' className='text-sm font-medium'>
                                                Description
                                            </Label>
                                            <Textarea
                                                id='description'
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder='Describe what you need in more detail...'
                                                rows={4}
                                                className='mt-1'
                                            />
                                            <InputError message={errors.description} />
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <div>
                                                <Label htmlFor='budget' className='text-sm font-medium'>
                                                    Budget
                                                </Label>
                                                <Input
                                                    id='budget'
                                                    type='number'
                                                    value={data.budget}
                                                    onChange={(e) => setData('budget', e.target.value)}
                                                    placeholder='Enter your budget'
                                                    className='mt-1'
                                                />
                                                <InputError message={errors.budget} />
                                            </div>

                                            <div>
                                                <Label htmlFor='deadline_date' className='text-sm font-medium'>
                                                    Deadline
                                                </Label>
                                                <Input
                                                    id='deadline_date'
                                                    type='date'
                                                    value={data.deadline_date}
                                                    onChange={(e) => setData('deadline_date', e.target.value)}
                                                    className='mt-1'
                                                />
                                                <InputError message={errors.deadline_date} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor='skills' className='text-sm font-medium'>
                                                Required Skills
                                            </Label>
                                            <MultiSelect
                                                options={skills.map((skill) => ({ 
                                                    value: String(skill.id), 
                                                    label: skill.name 
                                                }))}
                                                onValueChange={(values) => setData('skills', values)}
                                                value={data.skills}
                                                placeholder='Select relevant skills (optional)'
                                                className='mt-1'
                                            />
                                            <InputError message={errors.skills} />
                                        </div>

                                        <div>
                                            <Label className='text-sm font-medium'>
                                                Location (Optional)
                                            </Label>
                                            <div className='mt-2 space-y-3'>
                                                {data.latitude && data.longitude && (
                                                    <div className='text-sm bg-primary/10 text-primary p-3 rounded-md border border-primary/20'>
                                                        📍 {data.address
                                                            ? `${data.address}, ${data.city}, ${data.country}`
                                                            : `${data.city}, ${data.country}`}
                                                    </div>
                                                )}
                                                
                                                <LocationPicker
                                                    onLocationSelect={(location: LocationDetails) => {
                                                        setData('latitude', location.lat as number);
                                                        setData('longitude', location.lng as number);
                                                        setData('country', location.country as string);
                                                        setData('city', location.city as string);
                                                        setData('address', location.street as string);
                                                    }}
                                                    initialPosition={
                                                        data.latitude && data.longitude
                                                            ? { lat: data.latitude, lng: data.longitude }
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className='flex justify-center'>
                                    <Button 
                                        type='submit' 
                                        disabled={processing}
                                        className='w-full'
                                    >
                                        {processing ? 'Creating...' : 'Create Service Request'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}