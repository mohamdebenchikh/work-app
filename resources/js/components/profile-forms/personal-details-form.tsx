import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import type { User } from '@/types';
import { toast } from 'sonner';

export default function PersonalDetailsForm({ user }: { user: User }) {
    return (
        <Form
            method="patch"
            action={route('profile.update.personal')}
            onSuccess={() => toast.success('Personal details updated')}
            onError={(errors: Record<string, string>) => {
                if (errors && Object.keys(errors).length) {
                    const first = Object.values(errors)[0] as string;
                    toast.error(first);
                }
            }}
            options={{
                preserveScroll: true,

            }}
            className="space-y-6"
        >
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    <div className='grid gap-2'>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={user.gender} name='gender'>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='male'>Male</SelectItem>
                                <SelectItem value='female'>Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError className="mt-2" message={errors.gender} />
                    </div>

                    <div className='grid gap-2'>
                        <Label htmlFor="birthdate">Birthdate</Label>
                        <Input
                            id="birthdate"
                            type="date"
                            name="birthdate"
                            placeholder="Birthdate"
                            defaultValue={user.birthdate && format(user.birthdate, 'yyyy-MM-dd')}
                            className="mt-1 block w-full"
                            autoComplete="bday"
                            max={"2004-12-31"}
                        />
                        <InputError className="mt-2" message={errors.birthdate} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save Changes</Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </>
            )}
        </Form>
    );
}
