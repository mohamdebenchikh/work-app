import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent,  } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Clock, Edit3, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Availability', href: '/settings/availability' },
];

interface Availability {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export default function AvailabilityPage() {
    const { props } = usePage<{ availabilities: Availability[]; auth: SharedData['auth'] }>();
    
    const availabilities = (props && props.availabilities) || [];
    const [editingDay, setEditingDay] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    const form = useForm({ 
        day_of_week: 1, 
        start_time: '09:00', 
        end_time: '17:00' 
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Group availabilities by day
    const groupedAvailabilities = dayNames.map((dayName, index) => ({
        day: index,
        dayName,
        slots: availabilities.filter((a: Availability) => a.day_of_week === index)
    }));

    function validateForm() {
        setHasErrors(false);
        
        if (form.data.start_time >= form.data.end_time) {
            setHasErrors(true);
            toast.error('End time must be after start time');
            return false;
        }

        // Check for overlapping times on the same day
        const existingSlots = availabilities.filter((a: Availability) => 
            a.day_of_week === form.data.day_of_week
        );

        const hasOverlap = existingSlots.some((slot: Availability) => {
            return (
                (form.data.start_time >= slot.start_time && form.data.start_time < slot.end_time) ||
                (form.data.end_time > slot.start_time && form.data.end_time <= slot.end_time) ||
                (form.data.start_time <= slot.start_time && form.data.end_time >= slot.end_time)
            );
        });

        if (hasOverlap) {
            setHasErrors(true);
            toast.error('Time slot overlaps with existing availability');
            return false;
        }

        return true;
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!validateForm()) return;

        form.post(route('settings.availability.store'), {
            onSuccess: () => {
                toast.success('Availability added successfully');
                form.reset('start_time', 'end_time');
                setIsDialogOpen(false);
                setEditingDay(null);
                setHasErrors(false);
            },
            onError: () => {
                toast.error('Failed to add availability. Please try again.');
                setHasErrors(true);
            },
        });
    }

    function remove(id: number) {
        if (!confirm('Delete this availability?')) return;
        
        router.delete(route('settings.availability.destroy', { availability: id }), {
            onSuccess: () => {
                toast.success('Availability removed successfully');
            },
            onError: () => {
                toast.error('Failed to remove availability. Please try again.');
            },
        });
    }

    async function applyTemplate(name: string) {
        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const slots: { day_of_week: number; start_time: string; end_time: string }[] = [];

        if (name === 'weekdays') {
            for (let d = 1; d <= 5; d++) slots.push({ day_of_week: d, start_time: '09:00', end_time: '17:00' });
        } else if (name === 'weekend') {
            slots.push({ day_of_week: 0, start_time: '10:00', end_time: '14:00' });
            slots.push({ day_of_week: 6, start_time: '10:00', end_time: '14:00' });
        } else if (name === 'mornings') {
            for (let d = 1; d <= 5; d++) slots.push({ day_of_week: d, start_time: '08:00', end_time: '12:00' });
        } else if (name === 'evenings') {
            for (let d = 1; d <= 5; d++) slots.push({ day_of_week: d, start_time: '18:00', end_time: '22:00' });
        }

        if (!slots.length) return;

        try {
            for (const s of slots) {
                const formBody = new URLSearchParams();
                formBody.append('day_of_week', String(s.day_of_week));
                formBody.append('start_time', s.start_time);
                formBody.append('end_time', s.end_time);

                const res = await fetch(route('settings.availability.store'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRF-TOKEN': csrf,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: formBody.toString(),
                });

                if (!res.ok) throw new Error('Failed to apply template');
            }

            toast.success('Template applied — availabilities added');
            location.reload();
        } catch (err) {
            console.error(err);
            toast.error('Failed to apply template. Try again.');
        }
    }

    function openEditDialog(day: number) {
        setEditingDay(day);
        form.setData({
            day_of_week: day,
            start_time: '09:00',
            end_time: '17:00'
        });
        setHasErrors(false);
        setIsDialogOpen(true);
    }

    function formatTime(time: string) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    function getTimeSlotDuration(startTime: string, endTime: string) {
        const start = new Date(`2000-01-01 ${startTime}`);
        const end = new Date(`2000-01-01 ${endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return `${diffHours}h`;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Availability" />

            <SettingsLayout>
                <Heading 
                    title="Availability Schedule" 
                    description="Define the days and time ranges when you're available for appointments." 
                />

                {/* Quick Setup Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Button onClick={() => applyTemplate('weekdays')} variant="outline" size="sm">
                        Weekdays 9:00—17:00
                    </Button>
                    <Button onClick={() => applyTemplate('weekend')} variant="outline" size="sm">
                        Weekends 10:00—14:00
                    </Button>
                    <Button onClick={() => applyTemplate('mornings')} variant="outline" size="sm">
                        Mon—Fri Mornings 8:00—12:00
                    </Button>
                    <Button onClick={() => applyTemplate('evenings')} variant="outline" size="sm">
                        Mon—Fri Evenings 18:00—22:00
                    </Button>
                </div>

                <div className="space-y-4">
                    {groupedAvailabilities.map(({ day, dayName, slots }) => (
                        <Card key={day} className='p-0'>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${slots.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <h3 className="text-lg font-medium">{dayName}</h3>
                                        {slots.length > 0 && (
                                            <Badge variant="outline">
                                                {slots.length} slot{slots.length !== 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => openEditDialog(day)}
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </div>

                                {slots.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {slots.map((slot: Availability) => (
                                            <div key={slot.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Duration: {getTimeSlotDuration(slot.start_time, slot.end_time)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => remove(slot.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {slots.length === 0 && (
                                    <p className="mt-4 text-sm text-muted-foreground italic">No availability set</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Set Availability for {editingDay !== null ? dayNames[editingDay] : ''}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Start Time</Label>
                                    <Input 
                                        id="start_time"
                                        value={form.data.start_time} 
                                        onChange={(e) => form.setData('start_time', e.target.value)} 
                                        type="time" 
                                        className={hasErrors && form.data.start_time >= form.data.end_time ? 'border-destructive' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_time">End Time</Label>
                                    <Input 
                                        id="end_time"
                                        value={form.data.end_time} 
                                        onChange={(e) => form.setData('end_time', e.target.value)} 
                                        type="time" 
                                        className={hasErrors && form.data.start_time >= form.data.end_time ? 'border-destructive' : ''}
                                    />
                                </div>
                            </div>

                            {hasErrors && (
                                <div className="text-sm text-destructive">
                                    Please fix the errors above before continuing.
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={form.processing}
                                    className="flex-1"
                                >
                                    {form.processing ? 'Adding...' : 'Add Availability'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </SettingsLayout>
        </AppLayout>
    );
}