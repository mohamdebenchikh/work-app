import UpdateAvatar from '@/components/update-avatar';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData, User } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Settings, Mail, Calendar, MapPin, Phone, Briefcase, User as UserIcon, Heart, Globe } from 'lucide-react';

interface ContactInfoItemProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: string;
    iconColorClass: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/profile'
    }
];

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({
    icon: Icon,
    label,
    value,
    iconColorClass
}) => (
    <div className='flex items-center gap-3'>
        <div className={`p-2 rounded-lg ${iconColorClass}`}>
            <Icon size={20} className='text-current' />
        </div>
        <div className='flex-1'>
            <p className='text-sm font-medium text-muted-foreground'>{label}</p>
            <p className='text-foreground'>{value || 'Not provided'}</p>
        </div>
    </div>
);

export default function Profile() {
    const { user } = usePage<SharedData>().props.auth as { user: User };

    const formatJoinDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const formatFullDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatBirthdate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };



    function getFullAddress(): string {
        const addressParts: string[] = [];
        if (user.address) addressParts.push(user.address);
        if (user.city) addressParts.push(user.city);
        if (user.state) addressParts.push(user.state);
        if (user.country) addressParts.push(user.country);
        return addressParts.join(', ');
    }

    function capitalizeFirst(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Profile' />

            <div className='container max-w-6xl mx-auto px-4 py-12'>
                <div className='max-w-4xl mx-auto'>
                    {/* Header Section */}
                    <div className='bg-card rounded-2xl shadow-sm border border-border p-8 mb-8'>
                        <div className='flex flex-col lg:flex-row items-center lg:items-start gap-8'>
                            {/* Avatar Section */}
                            <div className='flex flex-col items-center space-y-4'>
                                <UpdateAvatar />
                                <div className='text-center lg:text-left'>
                                    <h1 className='text-2xl font-bold text-foreground'>{user.name}</h1>
                                    {user.profession && (
                                        <p className='text-primary font-medium'>{user.profession}</p>
                                    )}
                                    {user.role && (
                                        <span className='inline-block mt-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium'>
                                            {capitalizeFirst(user.role)}
                                        </span>
                                    )}
                                    <p className='text-muted-foreground text-sm mt-2'>
                                        Member since {formatJoinDate(user.created_at)}
                                    </p>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className='flex-1 w-full'>
                                <div className='flex justify-between items-start mb-4'>
                                    <h2 className='text-lg font-semibold text-foreground'>About</h2>
                                    <Link
                                        href='/settings/profile'
                                        className='inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
                                    >
                                        <Settings size={16} />
                                        Edit Profile
                                    </Link>
                                </div>

                                <p className='text-muted-foreground leading-relaxed'>
                                    {user.bio || 'No bio added yet. Visit settings to add some information about yourself.'}
                                </p>

                                {/* Skills Display */}
                                {user.skills && user.skills.length > 0 && (
                                    <div className='mt-6'>
                                        <h3 className='text-sm font-semibold text-foreground mb-3'>Skills</h3>
                                        <div className='flex flex-wrap gap-2'>
                                            {user.skills.map((skill, index) => (
                                                <span 
                                                    key={index}
                                                    className='px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium'
                                                >
                                                    {typeof skill === 'string' ? skill : skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Categories Display */}
                                {user.categories && user.categories.length > 0 && (
                                    <div className='mt-4'>
                                        <h3 className='text-sm font-semibold text-foreground mb-3'>Categories</h3>
                                        <div className='flex flex-wrap gap-2'>
                                            {user.categories.map((category, index) => (
                                                <span 
                                                    key={index}
                                                    className='px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium'
                                                >
                                                    {typeof category === 'string' ? category : category.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className='bg-card rounded-2xl shadow-sm border border-border p-8 mb-8'>
                        <h2 className='text-lg font-semibold text-foreground mb-6'>Contact Information</h2>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <ContactInfoItem
                                icon={Mail}
                                label='Email'
                                value={user.email}
                                iconColorClass='bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            />

                            <ContactInfoItem
                                icon={Phone}
                                label='Phone'
                                value={user.phone || ''}
                                iconColorClass='bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            />

                            <ContactInfoItem
                                icon={MapPin}
                                label='Location'
                                value={getFullAddress()}
                                iconColorClass='bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                            />

                            <ContactInfoItem
                                icon={Calendar}
                                label='Joined'
                                value={formatFullDate(user.created_at)}
                                iconColorClass='bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                            />
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className='bg-card rounded-2xl shadow-sm border border-border p-8'>
                        <h2 className='text-lg font-semibold text-foreground mb-6'>Personal Information</h2>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {user.birthdate && (
                                <ContactInfoItem
                                    icon={Heart}
                                    label='Date of Birth'
                                    value={formatBirthdate(user.birthdate)}
                                    iconColorClass='bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
                                />
                            )}

                            {user.gender && (
                                <ContactInfoItem
                                    icon={UserIcon}
                                    label='Gender'
                                    value={capitalizeFirst(user.gender)}
                                    iconColorClass='bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                />
                            )}

                            {user.profession && (
                                <ContactInfoItem
                                    icon={Briefcase}
                                    label='Profession'
                                    value={user.profession}
                                    iconColorClass='bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                                />
                            )}

                            {user.country && (
                                <ContactInfoItem
                                    icon={Globe}
                                    label='Country'
                                    value={user.country}
                                    iconColorClass='bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
                                />
                            )}
                        </div>

                        {/* Email Verification Status */}
                        <div className='mt-6 pt-6 border-t border-border'>
                            <div className='flex items-center gap-3'>
                                <div className={`p-2 rounded-lg ${user.email_verified_at 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                                    : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                                }`}>
                                    <Mail size={20} className='text-current' />
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Email Status</p>
                                    <p className={`text-sm font-medium ${user.email_verified_at 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                        {user.email_verified_at ? 'Verified' : 'Not Verified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );

    
}