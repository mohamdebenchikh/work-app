import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEvent, useEffect } from 'react';
import { CreateProviderServiceData, UpdateProviderServiceData, ProviderServiceStatus } from '@/types/provider-service';
import { Category, LocationDetails } from '@/types';
import { LocationPicker } from '@/components/location-picker';
import { MapPin } from 'lucide-react';

interface ProviderServiceFormProps {
    service?: {
        id: number;
        title: string;
        description: string | null;
        price: number | null;
        category_id: number | null;
        country: string;
        city: string;
        is_local_only: boolean;
        latitude: number | null;
        longitude: number | null;
        include_transport: boolean;
        status?: 'draft' | 'active' | 'inactive';
    };
    categories: Category[];
    onSubmit: (data: CreateProviderServiceData | UpdateProviderServiceData) => void;
    isProcessing: boolean;
    buttonText: string;
    data: CreateProviderServiceData | UpdateProviderServiceData;
    setData: (data: CreateProviderServiceData | UpdateProviderServiceData) => void;
    errors: Record<string, string>;
}

export default function ProviderServiceForm({
    service,
    categories,
    onSubmit,
    isProcessing,
    buttonText,
    data,
    setData,
    errors,
}: ProviderServiceFormProps) {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Convert values to appropriate types
        const priceValue = data.price;
        const price = typeof priceValue === 'string' || typeof priceValue === 'number' 
            ? Number(priceValue) 
            : null;
            
        const formData: any = {
            ...data,
            price: price,
            category_id: data.category_id ? Number(data.category_id) : null,
            is_local_only: Boolean(data.is_local_only),
            include_transport: Boolean(data.include_transport),
            latitude: data.latitude ? Number(data.latitude) : null,
            longitude: data.longitude ? Number(data.longitude) : null,
        };

        // Remove undefined values
        Object.keys(formData).forEach((key: string) => {
            if (formData[key] === undefined) {
                delete formData[key];
            }
        });

        onSubmit(formData as CreateProviderServiceData);
    };

    // Auto-detect location if not set
    useEffect(() => {
        if (!data.country || !data.city) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setData({
                            ...data,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        
                        // You might want to use a reverse geocoding service here
                        // to get the city and country from coordinates
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            }
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                <div className='grid gap-2'>
                    <Label htmlFor="title">Service Title *</Label>
                    <Input
                        id="title"
                        value={data.title || ''}
                        onChange={e => setData({ ...data, title: e.target.value })}
                        placeholder="Service title"
                        className="w-full"
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div className='grid gap-2'>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={data.description || ''}
                        onChange={e => setData({ ...data, description: e.target.value })}
                        placeholder="Describe your service in detail"
                        className="min-h-[100px]"
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className='grid gap-2'>
                        <Label htmlFor="price">Price (leave empty for 'Price on request')</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.price ?? ''}
                            onChange={e => setData({ ...data, price: e.target.value ? Number(e.target.value) : null })}
                            placeholder="e.g., 99.99"
                        />
                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                    </div>

                    <div className='grid gap-2'>
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            value={data.category_id?.toString()}
                            onValueChange={value => setData({ ...data, category_id: Number(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className='grid gap-2'>
                        <Label>Location *</Label>
                        <div className="mt-2 space-y-3">
                            <LocationPicker 
                                onLocationSelect={(location: LocationDetails) => {
                                    setData({
                                        ...data,
                                        city: location.city || '',
                                        country: location.country || '',
                                        latitude: location.lat,
                                        longitude: location.lng,
                                    });
                                }}
                                initialPosition={data.latitude && data.longitude 
                                    ? { lat: data.latitude, lng: data.longitude } 
                                    : undefined
                                }
                            />
                            
                            {(data.city || data.country) && (
                                <div className="rounded-lg border p-4 bg-accent/50">
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Selected Location</h4>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                                        <div>
                                            {data.city && <span className="font-medium">{data.city}</span>}
                                            {data.city && data.country && ', '}
                                            {data.country && <span>{data.country}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(errors.city || errors.country) && (
                                <p className="text-sm text-red-500">
                                    {errors.city || errors.country}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_local_only"
                            checked={Boolean(data.is_local_only)}
                            onCheckedChange={checked => setData({ ...data, is_local_only: Boolean(checked) })}
                        />
                        <Label htmlFor="is_local_only">Local service only</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="include_transport"
                            checked={Boolean(data.include_transport)}
                            onCheckedChange={checked => setData({ ...data, include_transport: Boolean(checked) })}
                        />
                        <Label htmlFor="include_transport">Include transportation</Label>
                    </div>
                </div>

                {service?.status && (
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value: ProviderServiceStatus) => setData({ ...data, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Saving...' : buttonText}
                </Button>
            </div>
        </form>
    );
}
