import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, CheckCircle, Clock, Award, Heart, ArrowRight, Phone, Mail } from 'lucide-react';
import { User } from '@/types';
import { useState } from 'react';

interface ProviderCardProps {
  provider: User
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
    if (rating >= 4.0) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
    if (rating >= 3.0) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
    return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30';
  };

  const formatRating = (rating: number | string) => {
    if (typeof rating === 'number') {
      return rating.toFixed(1);
    }
    return parseFloat(rating || '0').toFixed(1);
  };

  const averageRating = provider.reviews_avg_rating ? parseFloat(provider.reviews_avg_rating.toString()) : 0;
  const ratingColorClass = getRatingColor(averageRating);

  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.15), 0 8px 16px -8px rgba(0, 0, 0, 0.1)' 
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        duration: 0.3
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:hover:border-blue-900/50 backdrop-blur-sm"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Like button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors"
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${
            isLiked 
              ? 'fill-red-500 text-red-500' 
              : 'text-slate-400 hover:text-red-400'
          }`} 
        />
      </motion.button>

      <div className="relative p-6">
        {/* Header section */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 border-slate-200/60 bg-slate-100 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
            {provider.avatar ? (
              <img
                src={provider.avatar}
                alt={provider.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-xl font-bold text-white">
                {provider.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Verified badge with animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute -right-2 -top-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg ring-2 ring-white dark:ring-slate-900">
                <CheckCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Name and rating */}
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate pr-2">
                  <Link 
                    href={route('public-providers.show', provider.id)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {provider.name}
                  </Link>
                </h3>
                {provider.profession && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {provider.profession}
                  </p>
                )}
              </div>
              
              {averageRating > 0 && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${ratingColorClass} shadow-sm`}
                >
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  <span>{formatRating(averageRating)}</span>
                  <span className="ml-1 opacity-75">
                    ({provider.reviews_count || 0})
                  </span>
                </motion.div>
              )}
            </div>

            {/* Location */}
            {provider.country && (
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-2">
                <MapPin className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                <span className="truncate">{provider.country}</span>
                {provider.city && (
                  <span className="truncate">, {provider.city}</span>
                )}
              </div>
            )}

            {/* Bio */}
            {provider.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {provider.bio}
              </p>
            )}
          </div>
        </div>

        {/* Categories */}
        {provider.categories && provider.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {provider.categories.slice(0, 3).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 text-xs font-medium border-0 shadow-sm transition-all duration-200"
                >
                  {category.name}
                </Badge>
              </motion.div>
            ))}
            {provider.categories.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs font-medium bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                +{provider.categories.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center space-x-3">
            {provider.years_of_experience && (
              <div className="flex items-center">
                <Award className="mr-1 h-3 w-3" />
                <span>{provider.years_of_experience} years</span>
              </div>
            )}
            {provider.response_time && (
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                <span>~{provider.response_time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60">
          {/* Quick contact buttons */}
          <div className="flex items-center space-x-2">
            {provider.phone && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:border-green-800 dark:hover:text-green-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
            )}
            {provider.email && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-800 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* View profile button */}
          <Link
            href={route('public-providers.show', provider.id)}
            className="group/button"
          >
            <motion.div
              whileHover={{ x: 4 }}
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <span>View Profile</span>
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
            </motion.div>
          </Link>
        </div>

        {/* Availability indicator */}
        {provider.is_available !== undefined && (
          <div className="absolute top-6 left-6">
            <div className={`flex items-center space-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${
              provider.is_available 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${
                provider.is_available ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span>{provider.is_available ? 'Available' : 'Busy'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}