import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, ArrowUpDown, Star, Users, MapPin, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '@/layouts/public-layout';
import ProviderCard from '@/components/public/ProviderCard';
import { Category, User } from '@/types';

interface PageProps {
  providers: {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    path: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  filters: {
    search?: string;
    category?: string;
    min_rating?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  };
  categories: Category[];
  minRating?: number;
}

export default function ProvidersIndex({ providers, categories = [], filters }: PageProps) {
  // State management
  const [search, setSearch] = useState(filters.search || '');
  const [category, setCategory] = useState(filters.category || '');
  const [rating, setRating] = useState(filters.min_rating || 0);
  const [sort, setSort] = useState(filters.sort || 'reviews_avg_rating');
  const [order, setOrder] = useState<'asc' | 'desc'>(filters.order === 'asc' ? 'asc' : 'desc');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Computed values
  const selectedCategory = categories?.find(cat => cat.slug === category);
  const hasActiveFilters = search || category || rating > 0;
  const totalProviders = providers?.total || 0;
  const providerList = providers?.data || [];

  // Filter application with debouncing and loading state
  const applyFilters = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    
    // Only include non-default values in URL
    if (search.trim()) params.set('search', search.trim());
    if (category && category !== 'all') params.set('category', category);
    if (rating > 0) params.set('min_rating', rating.toString());
    if (sort !== 'reviews_avg_rating') params.set('sort', sort);
    if (order !== 'desc') params.set('order', order);
    
    // Preserve other query parameters
    const currentParams = new URLSearchParams(window.location.search);
    for (const [key, value] of currentParams.entries()) {
      if (!['search', 'category', 'min_rating', 'sort', 'order', 'page'].includes(key)) {
        params.set(key, value);
      }
    }
    
    router.get(`/public-providers?${params.toString()}`, {}, {
      preserveState: true,
      preserveScroll: true,
      only: ['providers', 'filters'],
      onSuccess: () => {
        // Scroll to top of results on filter change
        const resultsElement = document.getElementById('providers-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      onFinish: () => setIsLoading(false),
    });
  }, [search, category, rating, sort, order]);

  // Individual filter handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === 'all' ? '' : value);
  };

  const handleRatingChange = (value: number[]) => {
    setRating(value[0]);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };

  const toggleSortOrder = () => {
    setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('');
    setRating(0);
    setSort('reviews_avg_rating');
    setOrder('desc');
    router.get('/public-providers');
  };

  const clearIndividualFilter = (filterType: 'search' | 'category' | 'rating') => {
    switch (filterType) {
      case 'search':
        setSearch('');
        break;
      case 'category':
        setCategory('');
        break;
      case 'rating':
        setRating(0);
        break;
    }
  };

  // Apply filters when they change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only apply filters if they differ from current URL params
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category && category !== 'all') params.set('category', category);
      if (rating > 0) params.set('min_rating', rating.toString());
      if (sort !== 'reviews_avg_rating') params.set('sort', sort);
      if (order !== 'desc') params.set('order', order);
      
      const currentParams = new URLSearchParams(window.location.search);
      let shouldUpdate = false;
      
      // Check if any parameter has changed
      const paramsToCheck = ['search', 'category', 'min_rating', 'sort', 'order'];
      for (const param of paramsToCheck) {
        if (params.get(param) !== currentParams.get(param)) {
          shouldUpdate = true;
          break;
        }
      }
      
      if (shouldUpdate) {
        applyFilters();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, category, rating, sort, order, applyFilters]);

  // Close sidebar on mobile when clicking outside or on escape
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const HeroSection = () => (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] opacity-5"></div>
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Service Provider</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
          >
            Connect with trusted professionals across various industries. Quality services, verified reviews, and seamless booking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0"
          >
            <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{totalProviders}+ Providers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-medium">4.8+ Average Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-500" />
                <span className="font-medium">Global Coverage</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  // Desktop Sidebar Filters (Always visible on desktop)
  const DesktopSidebarFilters = () => (
    <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
      <div className="sticky top-8 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
            Filters
          </h2>
          
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Search Providers
              </label>
              <form onSubmit={handleSearch} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search by name, business..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" className="w-full" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Category
              </label>
              <Select value={category || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Minimum Rating
                </label>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {rating > 0 ? `${rating}+` : 'Any'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <Slider
                    min={0}
                    max={5}
                    step={0.5}
                    value={[rating]}
                    onValueChange={handleRatingChange}
                    className="flex-1"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">5</span>
                </div>
                {rating > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearIndividualFilter('rating')}
                    className="w-full"
                  >
                    Clear Rating Filter
                  </Button>
                )}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Sort By
              </label>
              <div className="space-y-2">
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reviews_avg_rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="business_name">Business Name</SelectItem>
                    <SelectItem value="created_at">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortOrder}
                  className="w-full"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {order === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                    Active Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="space-y-2">
                  {search && (
                    <Badge className="flex w-full items-center justify-between bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <span className="truncate">Search: {search}</span>
                      <button 
                        onClick={() => clearIndividualFilter('search')}
                        className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge className="flex w-full items-center justify-between bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <span className="truncate">{selectedCategory.name}</span>
                      <button 
                        onClick={() => clearIndividualFilter('category')}
                        className="ml-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {rating > 0 && (
                    <Badge className="flex w-full items-center justify-between bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <span>Rating: {rating}+</span>
                      <button 
                        onClick={() => clearIndividualFilter('rating')}
                        className="ml-2 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );

  // Mobile Sidebar Filters (Sliding overlay on mobile)
  const MobileSidebarFilters = () => (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-xl dark:bg-slate-900 lg:hidden"
          >
            <div className="flex h-full flex-col">
              {/* Mobile header */}
              <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Search Providers
                    </label>
                    <form onSubmit={handleSearch} className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Search by name, business..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                      />
                      <Button type="submit" className="w-full" size="sm">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </form>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <Select value={category || 'all'} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Minimum Rating
                      </label>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {rating > 0 ? `${rating}+` : 'Any'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <Slider
                          min={0}
                          max={5}
                          step={0.5}
                          value={[rating]}
                          onValueChange={handleRatingChange}
                          className="flex-1"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">5</span>
                      </div>
                      {rating > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => clearIndividualFilter('rating')}
                          className="w-full"
                        >
                          Clear Rating Filter
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Sort By
                    </label>
                    <div className="space-y-2">
                      <Select value={sort} onValueChange={handleSortChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reviews_avg_rating">Rating</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="business_name">Business Name</SelectItem>
                          <SelectItem value="created_at">Newest</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSortOrder}
                        className="w-full"
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        {order === 'asc' ? 'Ascending' : 'Descending'}
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {hasActiveFilters && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                          Active Filters
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {search && (
                          <Badge className="flex w-full items-center justify-between bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            <span className="truncate">Search: {search}</span>
                            <button 
                              onClick={() => clearIndividualFilter('search')}
                              className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {selectedCategory && (
                          <Badge className="flex w-full items-center justify-between bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <span className="truncate">{selectedCategory.name}</span>
                            <button 
                              onClick={() => clearIndividualFilter('category')}
                              className="ml-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {rating > 0 && (
                          <Badge className="flex w-full items-center justify-between bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <span>Rating: {rating}+</span>
                            <button 
                              onClick={() => clearIndividualFilter('rating')}
                              className="ml-2 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // Skeleton loader for provider cards
  const ProviderCardSkeleton = () => (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
      <div className="h-48 animate-pulse bg-slate-200 dark:bg-slate-700" />
      <div className="p-4">
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          ))}
          <div className="ml-2 h-4 w-8 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-12 text-center dark:border-slate-700"
    >
      <Search className="mx-auto h-16 w-16 text-slate-400" />
      <h3 className="mt-4 text-xl font-medium text-slate-900 dark:text-white">
        No providers found
      </h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Try adjusting your search criteria or filters to find what you're looking for.
      </p>
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Clear all filters'}
        </Button>
      )}
    </motion.div>
  );

  return (
    <PublicLayout>
      <Head title="Service Providers" />
      
      {/* Hero Section */}
      <HeroSection />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar - Always visible on desktop */}
            <DesktopSidebarFilters />
            
            {/* Mobile Sidebar - Sliding overlay */}
            <MobileSidebarFilters />

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Mobile Filter Toggle */}
              <div className="mb-6 lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-full"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Show Filters
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {[search, category, rating > 0].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Results Header */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Service Providers
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {totalProviders} {totalProviders === 1 ? 'provider' : 'providers'} found
                  </p>
                </div>

                {/* Quick Sort (Desktop) */}
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Quick sort:</span>
                  <Button
                    variant={sort === 'reviews_avg_rating' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange('reviews_avg_rating')}
                  >
                    Rating
                  </Button>
                  <Button
                    variant={sort === 'name' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSortChange('name')}
                  >
                    Name
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 overflow-hidden rounded-lg bg-blue-50 shadow-sm dark:bg-blue-900/20"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          Finding the best providers for you...
                        </span>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {Math.floor(Math.random() * 3) === 0 ? 'Almost there...' : 'Just a moment...'}
                      </div>
                    </div>
                    <div className="h-1 w-full bg-blue-100 dark:bg-blue-800/50">
                      <div className="h-full w-1/3 animate-[progress_2s_ease-in-out_infinite] bg-blue-500"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Providers Grid */}
              <motion.div
                layout
                id="providers-results"
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                aria-live="polite"
                aria-busy={isLoading}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    // Show skeleton loaders when loading
                    Array.from({ length: 6 }).map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProviderCardSkeleton />
                      </motion.div>
                    ))
                  ) : providerList.length > 0 ? (
                    // Show actual provider cards when loaded
                    providerList.map((provider) => (
                      <motion.div
                        key={provider.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                      >
                        <ProviderCard provider={provider} />
                      </motion.div>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {providerList.length > 0 && providers.last_page > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0"
                >
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Showing <span className="font-medium">{providers.from || 0}</span> to{' '}
                    <span className="font-medium">{providers.to || 0}</span> of{' '}
                    <span className="font-medium">{totalProviders}</span> results
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (providers.prev_page_url) {
                          setIsLoading(true);
                          router.get(providers.prev_page_url, {}, {
                            preserveState: true,
                            preserveScroll: true,
                            onFinish: () => setIsLoading(false),
                          });
                        }
                      }}
                      disabled={!providers.prev_page_url || isLoading}
                    >
                      Previous
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (providers.next_page_url) {
                          setIsLoading(true);
                          router.get(providers.next_page_url, {}, {
                            preserveState: true,
                            preserveScroll: true,
                            onFinish: () => setIsLoading(false),
                          });
                        }
                      }}
                      disabled={!providers.next_page_url || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>

    </PublicLayout>
  );
}