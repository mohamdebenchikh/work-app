import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ProviderService, ProviderServiceStatus } from '@/types/provider-service';
import { Edit, Trash2, MapPin, Tag, DollarSign, Calendar, Clock } from 'lucide-react';

interface ProviderServiceCardProps {
    service: ProviderService;
    onDelete?: (id: string | number) => void;
    showActions?: boolean;
    className?: string;
}

export default function ProviderServiceCard({ 
    service, 
    onDelete, 
    showActions = true,
    className = '' 
}: ProviderServiceCardProps) {
    const getStatusBadge = (status: ProviderServiceStatus) => {
        const statusMap = {
            [ProviderServiceStatus.DRAFT]: { 
                variant: 'secondary' as const, 
                label: 'Draft' 
            },
            [ProviderServiceStatus.ACTIVE]: { 
                variant: 'default' as const, 
                label: 'Active' 
            },
            [ProviderServiceStatus.INACTIVE]: { 
                variant: 'destructive' as const, 
                label: 'Inactive' 
            },
        } as const;

        const statusInfo = statusMap[status] || statusMap[ProviderServiceStatus.DRAFT];
        return <Badge variant={statusInfo.variant} className="text-xs">{statusInfo.label}</Badge>;
    };

    return (
        <Card className={`h-full flex flex-col transition-all hover:shadow-md ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-semibold leading-tight">
                        <Link 
                            href={route('provider-services.show', service.id)} 
                            className="hover:underline hover:text-primary"
                        >
                            {service.title}
                        </Link>
                    </CardTitle>
                    <div className="flex-shrink-0">
                        {getStatusBadge(service.status)}
                    </div>
                </div>
                
                {service.category && (
                    <div className="mt-1 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.category.name}</span>
                    </div>
                )}
                
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(service.price)}
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3 w-3" />
                        {service.city}, {service.country}
                    </Badge>
                    
                    {service.is_local_only && (
                        <Badge variant="secondary" className="text-xs">
                            Local Only
                        </Badge>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="flex-grow pt-0">
                {service.description && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {service.description}
                    </p>
                )}
            </CardContent>
            
            {showActions && (
                <CardFooter className="flex justify-end gap-2 border-t p-4 pt-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1.5 text-xs" 
                        asChild
                    >
                        <Link href={route('provider-services.edit', service.id)}>
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this service?')) {
                                onDelete?.(service.id);
                            }
                        }}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
