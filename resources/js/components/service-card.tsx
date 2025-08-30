import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, ArrowRight, Heart, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { ProviderService } from '@/types';

interface ServiceCardProps {
  service: ProviderService & {
    currency?: string;
    duration?: number;
    avg_rating?: number | null;
    reviews_count?: number;
    provider?: {
      id: number;
      name: string;
      avatar_url?: string;
      location?: {
        city?: string;
      };
    };
    category?: {
      id: number;
      name: string;
      slug: string;
    };
  };
  viewMode?: 'grid' | 'list';
}

export default function ServiceCard({ service, viewMode = 'grid' }: ServiceCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const averageRating = service.avg_rating ? parseFloat(service.avg_rating.toString()) : 0;
  const reviewCount = service.reviews_count || 0;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 4.0) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 3.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Contact for price';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: service.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (minutes?: number) => {
    if (minutes === undefined || minutes === null) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${mins} min${mins !== 1 ? 's' : ''}`;
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ 
          x: 4,
          boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20,
        }}
        className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300"
      >
        <Link href={`/services/${service.id}`} className="flex flex-col md:flex-row">
          <div className="relative p-4 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center w-full md:w-48 flex-shrink-0">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">
                {service.title}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/60"
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-foreground/50'}`}
              />
            </Button>
          </div>

          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold leading-tight tracking-tight line-clamp-1">
                  {service.title}
                </h3>
                <div className="mt-1 flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className={`h-4 w-4 ${averageRating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    <span className="ml-1 text-sm font-medium">
                      {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                    </span>
                    {reviewCount > 0 && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  {service.provider?.location?.city && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{service.provider.location.city}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold">{formatPrice(service.price)}</div>
                <div className="flex items-center justify-end text-sm text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDuration(service.duration as number)}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {service.description}
            </p>

            {service.category && (
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs">
                  {service.category.name}
                </Badge>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                {service.provider?.avatar_url ? (
                  <img
                    src={service.provider.avatar_url}
                    alt={service.provider.name}
                    className="h-8 w-8 rounded-full object-cover mr-2"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {service.provider?.name?.charAt(0) || 'P'}
                  </div>
                )}
                <span className="text-sm font-medium">
                  {service.provider?.name || 'Provider'}
                </span>
              </div>
              
              <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                View Details
                <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View (default)
  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
      }}
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href={`/services/${service.id}`} className="block">
        <div className="relative p-4 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">
              {service.title}
            </h3>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/60"
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-foreground/50'}`}
            />
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-lg">{formatPrice(service.price)}</div>
              <div className="text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1 inline-block" />
                <span>{formatDuration(service.duration as number)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className={`h-3.5 w-3.5 ${averageRating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                <span className="ml-1 text-xs font-medium">
                  {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                </span>
                {reviewCount > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({reviewCount})
                  </span>
                )}
              </div>
              
              {service.provider?.location?.city && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{service.provider.location.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {service.description}
        </p>

        {service.category && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {service.category.name}
            </Badge>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              {service.provider?.avatar_url ? (
                <img
                  src={service.provider.avatar_url}
                  alt={service.provider.name}
                  className="h-6 w-6 rounded-full object-cover mr-2"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                  {service.provider?.name?.charAt(0) || 'P'}
                </div>
              )}
              <span className="text-xs font-medium truncate max-w-[120px]">
                {service.provider?.name || 'Provider'}
              </span>
            </div>
            
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              Book Now
              <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
      </Link>
    </motion.div>
  );
}
