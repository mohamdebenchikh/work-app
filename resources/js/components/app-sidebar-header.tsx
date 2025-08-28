import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ModeToggle } from './theme-toggle';
import NotificationsDropdown from './notifications-dropdown';
import { Button } from '@/components/ui/button';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Briefcase, User as UserIcon, Repeat, Loader2 } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { post, processing } = useForm({});
    const { auth } = usePage().props as any;
    const role: string | undefined = auth?.user?.role;
    const nextRole = role === 'provider' ? 'client' : 'provider';

    const handleToggleRole = () => {
        post(route('profile.toggle-role'), {
            preserveScroll: true,
            onSuccess: () => toast.success(`Role switched to ${nextRole.charAt(0).toUpperCase() + nextRole.slice(1)}`),
            onError: () => toast.error('Failed to switch role. Please try again.'),
        });
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex-1 flex items-center justify-between ">
                <div className='flex items-center gap-2'>
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className='flex items-center gap-2'>
                    {role && (
                        <Badge variant="secondary" className="hidden sm:inline-flex items-center gap-1">
                            {role === 'provider' ? <Briefcase className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Badge>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleRole}
                        disabled={processing}
                        aria-busy={processing}
                        className="inline-flex items-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Switching...</span>
                            </>
                        ) : (
                            <>
                                <Repeat className="h-4 w-4" />
                                <span>Switch to {nextRole.charAt(0).toUpperCase() + nextRole.slice(1)}</span>
                            </>
                        )}
                    </Button>
                    <NotificationsDropdown />
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
