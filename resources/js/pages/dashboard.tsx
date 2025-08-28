import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, PlusCircle, Users, MessageSquareText, Briefcase } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { auth, notifications = [], unreadNotificationsCount = 0, stats } = usePage().props as any;
    const user = auth?.user;
    const recent = (notifications?.data ?? notifications ?? []).slice(0, 5);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
                        <p className="text-muted-foreground text-sm">Here is a quick overview of your account.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={unreadNotificationsCount > 0 ? 'default' : 'secondary'}>
                            <Bell className="h-4 w-4 mr-1" /> {unreadNotificationsCount} unread
                        </Badge>
                        <Button asChild variant="outline" size="sm">
                            <Link href={route('notifications.index')}>View notifications</Link>
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">My Offers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.offersCount ?? 0}</div>
                            <p className="text-muted-foreground text-sm">Total offers you made</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">My Service Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.serviceRequestsCount ?? 0}</div>
                            <p className="text-muted-foreground text-sm">Requests you posted</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.reviewsCount ?? 0}</div>
                            <p className="text-muted-foreground text-sm">Total reviews you received</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Rating</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{Number(stats?.ratingAverage ?? 0).toFixed(1)}</div>
                            <p className="text-muted-foreground text-sm">Average rating</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Create Service Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href={route('service-requests.create')}><PlusCircle className="h-4 w-4 mr-2" /> New Request</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Browse Providers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full" variant="secondary">
                                <Link href={route('providers.index')}><Users className="h-4 w-4 mr-2" /> Find Providers</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">My Offers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full" variant="secondary">
                                <Link href={route('my-offers.index')}><MessageSquareText className="h-4 w-4 mr-2" /> View Offers</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Service Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full" variant="secondary">
                                <Link href={route('service-requests.index')}><Briefcase className="h-4 w-4 mr-2" /> All Requests</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Overview grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* User Info */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-base">Your Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <div><span className="font-medium text-foreground">Name:</span> {user?.name ?? '-'}</div>
                            <div><span className="font-medium text-foreground">Role:</span> {user?.role ?? '-'}</div>
                            <div><span className="font-medium text-foreground">Profession:</span> {user?.profession ?? '-'}</div>
                            <div><span className="font-medium text-foreground">Location:</span> {[user?.city, user?.country].filter(Boolean).join(', ') || '-'}</div>
                            {typeof user?.profile_completion === 'number' && (
                                <div><span className="font-medium text-foreground">Profile Completion:</span> {user.profile_completion}%</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Notifications */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-base">Recent Notifications</CardTitle>
                            <Button asChild variant="link" size="sm"><Link href={route('notifications.index')}>View all</Link></Button>
                        </CardHeader>
                        <CardContent>
                            {recent.length === 0 ? (
                                <p className="text-sm text-muted-foreground">You have no notifications.</p>
                            ) : (
                                <div className="divide-y">
                                    {recent.map((n: any) => (
                                        <div key={n.id} className="py-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {n.data.type === 'new_review' && 'You received a new review!'}
                                                    {n.data.type === 'new_service_request' && 'New service request in your category!'}
                                                    {n.data.type === 'new_offer' && 'New offer on your service request!'}
                                                </span>
                                                {!n.read_at && <Badge variant="secondary" className="ml-auto">New</Badge>}
                                            </div>
                                            <div className="text-muted-foreground">
                                                {n.data.type === 'new_review' && (
                                                    <>
                                                        <span><b>{n.data.reviewer_name}</b> rated you {n.data.rating} stars.</span>
                                                        {n.data.comment && <span> "{n.data.comment}"</span>}
                                                    </>
                                                )}
                                                {n.data.type === 'new_service_request' && (
                                                    <>
                                                        <span><b>{n.data.creator_name}</b> posted: "{n.data.service_request_title}"</span>
                                                    </>
                                                )}
                                                {n.data.type === 'new_offer' && (
                                                    <>
                                                        <span><b>{n.data.offerer_name}</b> offered ${n.data.price} on "{n.data.service_request_title}"</span>
                                                    </>
                                                )}
                                            </div>
                                            {n.data.link && (
                                                <Button asChild variant="link" size="sm" className="px-0 h-auto">
                                                    <a href={n.data.link}>View</a>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
