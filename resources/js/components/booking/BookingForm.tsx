import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface BookingFormProps {
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
  onSubmit: (data: any) => void;
  isProcessing: boolean;
  errors: Record<string, string>;
}

interface BookingFormData {
  provider_service_id: number;
  provider_id: number;
  scheduled_at: string;
  duration: number;
  price: number | null;
  currency: string;
  notes: string;
}

export default function BookingForm({ providerService, onSubmit, isProcessing, errors }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
  
  const form = useForm<BookingFormData>({
    defaultValues: {
      provider_service_id: providerService.id,
      provider_id: providerService.user.id,
      scheduled_at: '',
      duration: providerService.duration,
      price: providerService.price,
      currency: providerService.currency,
      notes: '',
    }
  });

  const { control, handleSubmit, formState } = form;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    if (date) {
      // setData('scheduled_at', '');
    }
  };

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
    if (selectedDate) {
      // const scheduledAt = new Date(selectedDate);
      // scheduledAt.setHours(time.getHours(), time.getMinutes(), 0, 0);
      // setData('scheduled_at', scheduledAt.toISOString());
    }
  };

  const onFormSubmit = (data: BookingFormData) => {
    if (selectedDate && selectedTime) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const formattedTime = format(selectedTime, 'HH:mm:ss');
      const scheduledAt = `${formattedDate} ${formattedTime}`;
      
      onSubmit({
        ...data,
        scheduled_at: scheduledAt,
      });
    }
  };

  // Check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, startOfDay(new Date()))) return true;
    
    // Check provider's availability
    const dayOfWeek = date.getDay();
    return !providerService.availability.some(
      avail => avail.day_of_week === dayOfWeek
    );
  };

  // Get time constraints for the selected date
  const timeConstraints = useMemo(() => {
    if (!selectedDate) return { minTime: undefined, maxTime: undefined };
    
    const dayOfWeek = selectedDate.getDay();
    const availability = providerService.availability.find(a => a.day_of_week === dayOfWeek);
    
    if (!availability) return { minTime: undefined, maxTime: undefined };
    
    const [startHour, startMinute] = availability.start_time.split(':').map(Number);
    const [endHour, endMinute] = availability.end_time.split(':').map(Number);
    
    const minTime = new Date(selectedDate);
    minTime.setHours(startHour, startMinute, 0, 0);
    
    const maxTime = new Date(selectedDate);
    maxTime.setHours(endHour, endMinute, 0, 0);
    
    // Adjust minTime if selected date is today
    const now = new Date();
    if (selectedDate.getDate() === now.getDate() && 
        selectedDate.getMonth() === now.getMonth() && 
        selectedDate.getFullYear() === now.getFullYear()) {
      minTime.setHours(Math.max(startHour, now.getHours() + 1));
    }
    
    return { minTime, maxTime };
  }, [selectedDate, providerService.availability]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Book {providerService.title}</h2>
          <p className="text-muted-foreground">
            {providerService.price ? (
              <span className="text-foreground font-medium">
                ${providerService.price} {providerService.currency}
                {providerService.duration ? ` • ${providerService.duration} min` : ''}
              </span>
            ) : (
              <span className="text-foreground font-medium">
                Custom pricing
                {providerService.duration ? ` • ${providerService.duration} min` : ''}
              </span>
            )}
          </p>
        </div>
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="scheduled_at"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Date</FormLabel>
                <DatePicker
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  placeholder="Select a date"
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 60)}
                  className="w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="scheduled_at"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Time</FormLabel>
                <div className={cn("relative", !selectedDate && "opacity-50 cursor-not-allowed pointer-events-none")}>
                  <TimePicker
                    value={selectedTime}
                    onChange={handleTimeSelect}
                    minTime={timeConstraints.minTime}
                    maxTime={timeConstraints.maxTime}
                    placeholder="Select a time"
                    className="w-full"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Any special requirements or notes for the provider"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={formState.isSubmitting || !selectedDate || !selectedTime}
            >
              {formState.isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
