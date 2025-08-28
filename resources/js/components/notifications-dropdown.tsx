import { Bell } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { Notification } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NotificationsDropdown() {
    const props = usePage().props as any;
    const notifications: Notification[] = props.notifications?.data ?? props.notifications ?? [];
    const unreadNotificationsCount: number = props.unreadNotificationsCount ?? 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-white rounded-full text-xs px-1.5 py-0.5">
                            {unreadNotificationsCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="p-3 border-b font-semibold flex items-center justify-between">
                    Notifications
                    <Button variant="link" size="sm" onClick={() => router.visit('/notifications')}>View all</Button>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-muted-foreground text-center text-sm">No notifications</div>
                    ) : (
                        notifications.map((notification: Notification) => (
                            <div key={notification.id} className={cn('p-3 flex flex-col gap-1', !notification.read_at && 'bg-primary/5') }>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {notification.data.type === 'new_review' && 'You received a new review!'}
                                        {notification.data.type === 'new_service_request' && 'New service request in your category!'}
                                        {notification.data.type === 'new_offer' && 'New offer on your service request!'}
                                    </span>
                                    {!notification.read_at && <Badge variant="secondary" className="ml-auto">New</Badge>}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {notification.data.type === 'new_review' && (
                                        <>
                                            <span><b>{notification.data.reviewer_name}</b> rated you {notification.data.rating} stars.</span>
                                            {notification.data.comment && <span> "{notification.data.comment}"</span>}
                                        </>
                                    )}
                                    {notification.data.type === 'new_service_request' && (
                                        <>
                                            <span><b>{notification.data.creator_name}</b> posted: "{notification.data.service_request_title}"</span>
                                        </>
                                    )}
                                    {notification.data.type === 'new_offer' && (
                                        <>
                                            <span><b>{notification.data.offerer_name}</b> offered ${notification.data.price} on "{notification.data.service_request_title}"</span>
                                        </>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })}
                                </div>
                                {notification.data.link && (
                                    <Button asChild variant="link" size="sm" className="px-0 h-auto">
                                        <a href={notification.data.link}>View</a>
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
