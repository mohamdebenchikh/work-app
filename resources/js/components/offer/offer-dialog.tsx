import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import OfferForm from './offer-form';
import { Offer, ServiceRequest } from '@/types';
import { ReactNode } from 'react';

interface OfferDialogProps {
    trigger: ReactNode;
    serviceRequest?: ServiceRequest; // For create mode
    offer?: Offer; // For edit mode
    onSuccess: () => void;
}

export default function OfferDialog({ trigger, serviceRequest, offer, onSuccess }: OfferDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSuccess = () => {
        setIsOpen(false);
        onSuccess();
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{offer ? 'Edit Your Offer' : `Make an Offer for "${serviceRequest?.title}"`}</DialogTitle>
                </DialogHeader>
                <OfferForm
                    serviceRequest={serviceRequest}
                    offer={offer}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </DialogContent>
        </Dialog>
    );
}

