import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BookingForm from './BookingForm';

export interface AddBookingDialogProps {
  providerService: {
    id: number;
    title: string;
    price: number | null;
    currency: string;
    duration: number;
    user: {
      id: number;
      name: string;
    };
    availability: Array<{
      day_of_week: number;
      start_time: string;
      end_time: string;
    }>;
  };
  triggerText?: string;
  triggerVariant?: 'default' | 'outline' | 'ghost' | 'link';
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
  triggerClassName?: string;
}

export default function AddBookingDialog({
  providerService,
  triggerText = 'Book Now',
  triggerVariant = 'default',
  triggerSize = 'default',
  triggerClassName = '',
}: AddBookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log('Booking data:', data);
    // Handle form submission here
    // You can pass this up to the parent component if needed
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={triggerVariant} 
          size={triggerSize}
          className={triggerClassName}
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book {providerService.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <BookingForm 
            providerService={{
              ...providerService,
              duration: providerService.duration || 60, // Default to 60 minutes if not set
              availability: providerService.availability || []
            }}
            onSubmit={handleSubmit}
            isProcessing={false}
            errors={{}}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
