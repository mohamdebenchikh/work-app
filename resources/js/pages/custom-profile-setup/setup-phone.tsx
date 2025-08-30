import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomProfileSetUpLayout from '@/layouts/custom-profile-setup-layout';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Loader2, Phone } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function PhoneSetupPage({ canSkip, nextStepUrl }: { canSkip?: boolean; nextStepUrl?: string }) {
    // Single state for the complete phone number
    const [phoneNumber, setPhoneNumber] = useState('');

    // Form data only contains the phone field that backend expects
    const { setData, post, processing, errors, data } = useForm({
        phone: '',
    });

    console.log("error here")

    // Phone validation
    const isValidPhone = useMemo(() => {
        if (phoneNumber.trim() === '') return false;

        // Check if it starts with + and has at least 8 digits
        const phoneRegex = /^\+[1-9]\d{7,14}$/;
        return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
    }, [phoneNumber]);

    const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow digits, spaces, and + symbol
        const filtered = value.replace(/[^\d\s+]/g, '');
        setPhoneNumber(filtered);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanPhone = phoneNumber.trim();

        // Validate phone number
        if (!isValidPhone) {
            toast.error('Please enter a valid phone number with country code');
            return;
        }

        // Set the phone data (remove spaces for backend)
        const formattedPhone = cleanPhone.replace(/\s/g, '');
        setData('phone', formattedPhone);
        setTimeout(() => post(route('profile-setup.phone-number')), 300);
    };

    return (
        <CustomProfileSetUpLayout
            title="Phone Verification"
            description="Add your phone number for account security and notifications"
            canSkip={canSkip}
            nextStepUrl={nextStepUrl}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Display errors using Alert component */}
                {errors.phone && (
                    <Alert variant="destructive" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.phone}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="phone-number" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        Phone Number
                    </Label>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Phone className="h-4 w-4 text-slate-400" />
                        </div>
                        <Input
                            id="phone-number"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className={cn(
                                'border-slate-200 pl-10 focus:ring-blue-600 dark:border-slate-700',
                                errors.phone ? 'border-red-500 dark:border-red-400' : '',
                                !isValidPhone && phoneNumber.trim() !== '' ? 'border-orange-400 dark:border-orange-500' : '',
                            )}
                            aria-invalid={errors.phone ? 'true' : 'false'}
                        />
                    </div>

                    {errors.phone && <InputError message={errors.phone} />}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={processing || (phoneNumber.trim() !== '' && !isValidPhone)}
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Phone Number'
                    )}
                </Button>
            </form>
        </CustomProfileSetUpLayout>
    );
}
