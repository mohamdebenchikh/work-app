import AppLayout from '@/layouts/app-layout';
import { usePage, router } from '@inertiajs/react';
import { Notification, PaginatedResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
    const { notifications, unreadNotificationsCount } = usePage().props as {
        notifications: PaginatedResponse<Notification>;
        unreadNotificationsCount: number;
    };

    const handleMarkAsRead = (id: string) => {
        router.post(route('notifications.markAsRead', id), {}, { preserveScroll: true });
    };
    const handleMarkAllAsRead = () => {
        router.post(route('notifications.markAllAsRead'), {}, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    {unreadNotificationsCount > 0 && (
                        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </div>
                <div className="bg-card rounded-lg shadow divide-y">
                    {notifications.data.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">No notifications</div>
                    ) : (
                        notifications.data.map((notification) => (
                            <div key={notification.id} className={cn('p-4 flex flex-col gap-1', !notification.read_at && 'bg-primary/5') }>
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
                                <div className="flex gap-2 mt-2">
                                    {notification.data.link && (
                                        <Button asChild variant="link" size="sm" className="px-0 h-auto">
                                            <a href={notification.data.link}>View</a>
                                        </Button>
                                    )}
                                    {!notification.read_at && (
                                        <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                                            Mark as read
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Pagination controls */}
                {notifications.meta && notifications.meta.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {notifications.meta.links.map((link, idx) => (
                            <Button
                                key={idx}
                                asChild
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                            >
                                <a href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
