import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Filter, Globe, Loader2, MapPin, Search, X } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface SearchCardProps {
    categories: Category[];
    initialCity?: string;
    initialCountry?: string;
    variant?: 'hero' | 'compact';
    title?: string;
    subtitle?: string;
    showClearFilters?: boolean;
    onSearch?: (params: Record<string, string | number>) => void;
}

export default function SearchCard({
    categories,
    initialCity = '',
    initialCountry = '',
    variant = 'compact',
    title,
    subtitle,
    showClearFilters = false,
    onSearch,
}: SearchCardProps) {
    const [city, setCity] = useState(initialCity);
    const [country, setCountry] = useState(initialCountry);
    const [categoryId, setCategoryId] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isHero = variant === 'hero';
    const hasActiveFilters = city || country || categoryId;

    function handleSubmit() {
        setIsLoading(true);

        const params: Record<string, string | number> = {};
        if (city) params.city = city;
        if (country) params.country = country;
        if (categoryId) params.category_id = Number(categoryId);

        if (onSearch) {
            onSearch(params);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }

    function clearFilters() {
        setCity('');
        setCountry('');
        setCategoryId('all');
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    const selectedCategory = categories.find((cat) => cat.id.toString() === categoryId);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`w-full ${isHero ? 'mx-auto max-w-5xl' : ''}`}
        >
            <Card
                className={`relative overflow-hidden border-0 shadow-xl ${isHero ? 'bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm dark:from-slate-900/80 dark:to-slate-800/80' : 'bg-card'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Animated background elements */}
                <motion.div
                    animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute -top-1/2 -right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-r from-blue-100/20 to-purple-100/20 blur-3xl dark:from-blue-900/10 dark:to-purple-900/10"
                />
                <motion.div
                    animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
                    transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute -bottom-1/2 -left-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-r from-purple-100/20 to-pink-100/20 blur-3xl dark:from-purple-900/10 dark:to-pink-900/10"
                />

                {(title || subtitle) && (
                    <CardHeader className={isHero ? 'pb-8 text-center' : 'pb-6'}>
                        {title && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <CardTitle
                                    className={`${isHero ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl' : 'text-xl'}`}
                                >
                                    {title}
                                </CardTitle>
                            </motion.div>
                        )}
                        {subtitle && (
                            <motion.p
                                className={`text-muted-foreground ${isHero ? 'mx-auto max-w-3xl text-lg sm:text-xl' : 'text-sm'}`}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </CardHeader>
                )}

                <CardContent className={isHero ? 'relative z-10 pt-0' : 'relative z-10'}>
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        {/* Inputs Row */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* City Input */}
                            <motion.div className="grid gap-2" whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }}>
                                <Label htmlFor="city" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <MapPin className="-mt-0.5 mr-1.5 inline-block h-4 w-4" />
                                    City
                                </Label>
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 blur transition duration-300 group-hover:opacity-100"></div>
                                    <div className="relative">
                                        <Input
                                            id="city"
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="e.g., Cairo"
                                            className="border-slate-200/70 bg-white/80 pl-10 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-slate-700/70 dark:bg-slate-800/80"
                                            onKeyPress={handleKeyPress}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Country Input */}
                            <motion.div className="grid gap-2" whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }}>
                                <Label htmlFor="country" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <Globe className="-mt-0.5 mr-1.5 inline-block h-4 w-4" />
                                    Country
                                </Label>
                                <div className="group relative">
                                    <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 blur transition duration-300 group-hover:opacity-100"></div>
                                    <div className="relative">
                                        <Input
                                            id="country"
                                            type="text"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            placeholder="Auto-detected"
                                            className="border-slate-200/70 bg-white/80 pl-10 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-purple-500/50 dark:border-slate-700/70 dark:bg-slate-800/80"
                                            onKeyPress={handleKeyPress}
                                        />
                                        <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Category Select */}
                            <motion.div 
                                className="grid gap-2"
                                whileHover={{ y: -3 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <Filter className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                                    Category
                                </Label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                    <div className="relative">
                                        <Select value={categoryId} onValueChange={setCategoryId}>
                                            <SelectTrigger 
                                                className={`w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70 focus:ring-2 focus:ring-indigo-500/50 ${isHero ? 'h-12' : 'h-10'}`}
                                            >
                                                <SelectValue placeholder="Any category" className="text-left" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Any category</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Search Button Row */}
                        <motion.div 
                            className="relative group"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isLoading} 
                                className="relative w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    {isHero ? 'Find Providers' : 'Search'}
                                </>
                            )}
                            </Button>
                        </motion.div>

                        {/* Clear Filters */}
                        {showClearFilters && hasActiveFilters && (
                            <div className="flex justify-center">
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                                    <X className="mr-1.5 h-3 w-3" />
                                    Clear all filters
                                </Button>
                            </div>
                        )}

                        {/* Active Filters Display */}
                        {hasActiveFilters && !isHero && (
                            <div className="border-t pt-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Active filters:</span>
                                    {city && (
                                        <Badge variant="secondary" className="gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {city}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCity('')}
                                                className="ml-1 h-auto p-0 hover:bg-transparent"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    )}
                                    {country && (
                                        <Badge variant="secondary" className="gap-1">
                                            {country}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCountry('')}
                                                className="ml-1 h-auto p-0 hover:bg-transparent"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    )}
                                    {selectedCategory && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Filter className="h-3 w-3" />
                                            {selectedCategory.name}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCategoryId('')}
                                                className="ml-1 h-auto p-0 hover:bg-transparent"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
