import { Transition } from '@headlessui/react';
import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';
import { toast } from 'sonner';

export default function BasicInfoForm({ user, mustVerifyEmail, status }: { user: User; mustVerifyEmail?: boolean; status?: string }) {
    return (
        <Form
            method="patch"
            action={route('profile.update.basic')}
            options={{
                preserveScroll: true,
            }}
            onSuccess={() => toast.success('Basic information updated')}
            onError={(errors: Record<string, string>) => {
                if (errors && Object.keys(errors).length) {
                    const first = Object.values(errors)[0] as string;
                    toast.error(first);
                }
            }}
            className="space-y-6"
        >
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            defaultValue={user.name}
                            name="name"
                            required
                            autoComplete="name"
                            placeholder="Full name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            defaultValue={user.email}
                            name="email"
                            required
                            autoComplete="username"
                            placeholder="Email address"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="Phone number"
                            defaultValue={user.phone}
                            className="mt-1 block w-full"
                            autoComplete="tel"
                        />
                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="-mt-4 text-sm text-muted-foreground">
                                Your email address is unverified.{' '}
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                >
                                    Click here to resend the verification email.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 text-sm font-medium text-green-600">
                                    A new verification link has been sent to your email address.
                                </div>
                            )}
                        </div>
                    )}

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
