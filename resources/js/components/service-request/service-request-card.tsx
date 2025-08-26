import { ServiceRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Folder } from 'lucide-react';

interface ServiceRequestCardProps {
    serviceRequest: ServiceRequest;
}

export default function ServiceRequestCard({ serviceRequest }: ServiceRequestCardProps) {
    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={serviceRequest.user.avatar} alt={serviceRequest.user.name} />
                            <AvatarFallback className="text-sm">
                                {serviceRequest.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <Link 
                                href={route('profile.index', serviceRequest.user.id)} 
                                className="text-sm font-medium hover:underline"
                            >
                                {serviceRequest.user.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                                {serviceRequest.user.profession}
                            </p>
                        </div>
                    </div>
                    <Badge variant={serviceRequest.status === 'open' ? 'default' : 'secondary'}>
                        {serviceRequest.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <Link href={route('service-requests.show', serviceRequest.id)} className="hover:underline">
                    <CardTitle className="text-base">{serviceRequest.title}</CardTitle>
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {serviceRequest.description}
                </p>

                    <Badge variant={'default'}>
                        <Folder className="mr-2 h-4 w-4" />
                        {serviceRequest.category.name}
                    </Badge>
                    
                    

                {serviceRequest.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {serviceRequest.skills.map(skill => (
                            <Badge key={skill.id} variant="outline" className="text-xs">
                                {skill.name}
                            </Badge>
                        ))}
                    </div>
                )}

                <Button variant="outline" className="w-full" asChild>
                    <Link href={route('service-requests.show', serviceRequest.id)}>
                        View Details
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}