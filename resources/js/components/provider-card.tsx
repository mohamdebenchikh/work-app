import React from 'react';
import { Link } from '@inertiajs/react';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Star } from 'lucide-react';

interface ProviderCardProps {
    provider: User;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
    const memberSince = new Date(provider.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });

    return (
        <Card className="w-full flex flex-col">
            <CardContent className="p-4 flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={provider.avatar || '/images/default-avatar.png'} alt={provider.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                            {provider.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Link href={route('providers.show', provider.id)} className="font-bold text-lg hover:underline">
                            {provider.name}
                        </Link>
                        {provider.profession && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-3 w-3" /> {provider.profession}
                            </p>
                        )}
                    </div>
                </div>

                {provider.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {provider.bio}
                    </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                    {provider.categories && provider.categories.length > 0 && provider.categories.map(category => (
                        <Badge key={category.id} variant="secondary">{category.name}</Badge>
                    ))}
                    {provider.skills && provider.skills.length > 0 && provider.skills.map(skill => (
                        <Badge key={skill.id} variant="outline">{skill.name}</Badge>
                    ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {provider.city && provider.country && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {provider.city}, {provider.country}
                        </div>
                    )}
                    {provider.rating_average && (
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {provider.rating_average} ({provider.reviews_count})
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
