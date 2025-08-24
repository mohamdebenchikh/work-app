import { Category, Skill, User, type BreadcrumbItem, } from '@/types';
import { Head } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Heading from '@/components/heading';
import UpdateAvatar from '@/components/update-avatar';
import BasicInfoForm from '@/components/profile-forms/basic-info-form';
import ProfessionalInfoForm from '@/components/profile-forms/professional-info-form';
import PersonalDetailsForm from '@/components/profile-forms/personal-details-form';
import AddressInfoForm from '@/components/profile-forms/address-info-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status,categories,skills,user }: { mustVerifyEmail: boolean; status?: string;skills:Skill[];categories:Category[],user:User }) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <Heading title='Profile information' description="Update your account's profile information." />

                <div className='mb-6 flex items-center justify-center'>
                    <UpdateAvatar />
                </div>

                <Accordion type="multiple" defaultValue={['basic-info']} className="space-y-4">
                    {/* Basic Information */}
                    <AccordionItem value='basic-info'>
                        <Card className='p-2'>
                            <CardHeader>
                                <AccordionTrigger>
                                    <CardTitle className='text-lg'>Basic Information</CardTitle>
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent>
                                <CardContent>
                                    <BasicInfoForm user={user} mustVerifyEmail={mustVerifyEmail} status={status} />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>

                    {/* Professional Information */}
                    <AccordionItem value='professional-info'>
                        <Card className='p-2'>
                            <CardHeader>
                                <AccordionTrigger>
                                    <CardTitle className='text-lg'>Professional Information</CardTitle>
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent>
                                <CardContent>
                                    <ProfessionalInfoForm categories={categories} skills={skills} user={user} />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>

                    {/* Personal Details */}
                    <AccordionItem value='personal-details'>
                        <Card className='p-2'>
                            <CardHeader>
                                <AccordionTrigger>
                                    <CardTitle className='text-lg'>Personal Details</CardTitle>
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent>
                                <CardContent>
                                    <PersonalDetailsForm user={user} />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>

                    {/* Address Information */}
                    <AccordionItem value='address-info'>
                        <Card className='p-2'>
                            <CardHeader>
                                <AccordionTrigger>
                                    <CardTitle className='text-lg'>Address Information</CardTitle>
                                </AccordionTrigger>
                            </CardHeader>
                            <AccordionContent>
                                <CardContent>
                                    <AddressInfoForm user={user} />
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}