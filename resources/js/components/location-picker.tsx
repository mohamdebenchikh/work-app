
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LocationPickerDialog } from '@/components/location-picker-dialog';
import { useState } from 'react';
import { LocationDetails } from '@/types';
import { MapPin } from 'lucide-react';



interface LocationPickerProps {
    onLocationSelect: (location: LocationDetails) => void;
    initialPosition?: { lat: number; lng: number };
}

export function LocationPicker({ onLocationSelect, initialPosition }: LocationPickerProps) {
    const [open, setOpen] = useState(false);

    const handleLocationSelect = (location: LocationDetails) => {
        onLocationSelect(location);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline' className='w-full' size={'lg'}>
                    <MapPin className='mr-1 size-4' />
                    Select Location
                    </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[800px]'>
                <DialogHeader>
                    <DialogTitle>Select Location</DialogTitle>
                </DialogHeader>
                <LocationPickerDialog
                    onLocationSelect={handleLocationSelect}
                    initialPosition={initialPosition}
                />
            </DialogContent>
        </Dialog>
    );
}

