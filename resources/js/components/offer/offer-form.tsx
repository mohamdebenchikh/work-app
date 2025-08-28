import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Offer, ServiceRequest } from '@/types';

interface OfferFormProps {
    serviceRequest?: ServiceRequest; // Required for create mode
    offer?: Offer; // Required for edit mode
    onSuccess: () => void;
    onCancel: () => void;
}

export default function OfferForm({ serviceRequest, offer, onSuccess, onCancel }: OfferFormProps) {
    const isEditMode = !!offer;
    const routeName = isEditMode ? 'offers.update' : 'service-requests.offers.store';
    const routeParams = isEditMode ? offer.id : serviceRequest?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        price: isEditMode ? offer.price.toString() : '',
        message: isEditMode ? offer.message : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const handler = isEditMode ? put : post;
        handler(route(routeName, routeParams), {
            onSuccess: () => {
                toast.success(isEditMode ? 'Offer updated successfully!' : 'Offer submitted successfully!');
                reset();
                onSuccess();
            },
            onError: () => {
                toast.error(isEditMode ? 'Failed to update offer.' : 'Failed to submit offer.');
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className='grid gap-2'>
                <Label htmlFor="price">Your Price (USD)</Label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    required
                />
                <InputError message={errors.price} className="mt-2" />
            </div>

            <div className='grid gap-2'>
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    rows={5}
                    placeholder="Tell the client why you're the best fit for this service request..."
                    required
                />
                <InputError message={errors.message} className="mt-2" />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Offer' : 'Submit Offer')}
                </Button>
            </div>
        </form>
    );
}

