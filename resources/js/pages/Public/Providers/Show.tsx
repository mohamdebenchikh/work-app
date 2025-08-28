import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Calendar, MessageSquare, Briefcase, Award, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import ProviderCard from '@/components/public/ProviderCard';
import { Review, User } from '@/types';
import { useState } from 'react';



export default function ProviderShow({ provider, relatedProviders }: { provider: User; relatedProviders: User[] }) {
  const [activeTab, setActiveTab] = useState('about');
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <motion.span
        key={i}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: i * 0.05 }}
      >
        <Star
          className={`h-5 w-5 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}
        />
      </motion.span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <PublicLayout
      title={`${provider.profession || provider.name} - Professional Profile`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"
        >
          <Button variant="ghost" asChild className="group">
            <Link 
              href={route('public-providers.index')} 
              className="flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.span>
              Back to Providers
            </Link>
          </Button>
        </motion.div>

      {/* Profile Header */}
      <motion.div 
        className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden p-0 border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900/50 hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                    {provider.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                  <CheckCircle className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>

              <div className="mt-4 text-center md:ml-6 md:mt-0 md:text-left">
                <div className="flex flex-col items-center md:flex-row md:items-baseline">
                  <h1 className="text-2xl font-bold text-white">{provider.profession || provider.name}</h1>
                  {provider.profession && (
                    <span className="mt-1 text-blue-100 md:ml-3">
                      {provider.name}
                    </span>
                  )}
                </div>

                {provider.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1 md:justify-start">
                    {provider.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-center space-x-4 md:justify-start">
                  <div className="flex items-center">
                    <div className="flex">
                      {renderStars(provider.reviews_avg_rating || 0)}
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-100">
                      {provider.reviews_avg_rating?.toFixed(1) || 'No'} ({provider.reviews_count} reviews)
                    </span>
                  </div>
                  
                  {provider.country && (
                    <div className="flex items-center text-sm text-blue-100">
                      <MapPin className="mr-1 h-4 w-4" />
                      {provider.country  + ' ' + provider.city}
                    </div>
                  )}
                  
                  <div className="text-sm text-blue-100">
                    <Calendar className="mr-1 inline h-4 w-4" />
                    Member since {new Date(provider.created_at).getFullYear()}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex w-full justify-center space-x-3 md:mt-0 md:ml-auto md:w-auto md:justify-end">
                <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Hire Me
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs 
            defaultValue="about" 
            className="w-full"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50 p-0 dark:bg-slate-900/30">
              {['about', 'services', 'portfolio', 'reviews'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="relative py-4 px-6 group"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && ` (${provider.reviews_count})`}
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <TabsContent value="about">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">About Me</h2>
                    {provider.bio ? (
                      <div className="prose max-w-none text-slate-600 dark:prose-invert dark:text-slate-300">
                        {provider.bio}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">
                        No biography available.
                      </p>
                    )}

                    <div className="mt-8">
                      <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">Contact Information</h3>
                      <div className="space-y-3">
                        {provider.email && (
                          <div className="flex items-center">
                            <span className="w-32 text-slate-500 dark:text-slate-400">Email:</span>
                            <a
                              href={`mailto:${provider.email}`}
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {provider.email}
                            </a>
                          </div>
                        )}
                        {provider.phone && (
                          <div className="flex items-center">
                            <span className="w-32 text-slate-500 dark:text-slate-400">Phone:</span>
                            <a
                              href={`tel:${provider.phone}`}
                              className="text-slate-900 hover:underline dark:text-white"
                            >
                              {provider.phone}
                            </a>
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </div>

                  <div>
                    <Card className="border-slate-200 dark:border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-lg">Categories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {provider.categories.length > 0 ? (
                            provider.categories.map((category) => (
                              <Badge key={category.id} variant="outline" className="text-sm">
                                {category.name}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No categories specified</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-4 border-slate-200 dark:border-slate-800">
                      <CardHeader>
                        <CardTitle className="text-lg">Languages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-300">English</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Fluent</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-300">Spanish</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Conversational</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Button className="mt-6 w-full" size="lg">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Hire {provider.name.split(' ')[0]}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">Services & Pricing</h2>
                {provider.categories.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {provider.categories.map((category) => (
                      <Card key={category.id} className="overflow-hidden border-slate-200 dark:border-slate-800">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          
                        </div>
                        <CardContent className="p-4">
                         
                          <Button variant="outline" size="sm" className="mt-4 w-full">
                            Request Service
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No services listed</h3>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      This provider hasn't listed any services yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Customer Reviews</h2>
                    <div className="mt-1 flex items-center">
                      <div className="flex">
                        {renderStars(provider.reviews_avg_rating || 0)}
                      </div>
                      <span className="ml-2 text-slate-600 dark:text-slate-300">
                        {provider.reviews_avg_rating?.toFixed(1) || 'No'} average based on {provider.reviews_count} reviews.
                      </span>
                    </div>
                  </div>
                  <Button variant="outline">Write a Review</Button>
                </div>

                {provider.reviews_received &&  provider.reviews_received.length > 0 ? (
                  <div className="mt-8 space-y-6">
                    {provider.reviews_received.map((review : Review) => (
                      <div key={review.id} className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={review.user.avatar} alt={review.user.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {review.user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-white">{review.user.name}</h4>
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 rounded-lg border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                    <MessageSquare className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No reviews yet</h3>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      Be the first to review this provider.
                    </p>
                    <Button className="mt-4">Write a Review</Button>
                  </div>
                )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </Card>
      </motion.div>

      {/* Enhanced Related Providers */}
      {relatedProviders.length > 0 && (
        <motion.div 
          className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Similar Service Providers
            </h2>
            <Button variant="ghost" asChild>
              <Link 
                href={route('public-providers.index')} 
                className="group flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <motion.div 
            className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {relatedProviders.map((relatedProvider, index) => (
              <motion.div
                key={relatedProvider.id}
                variants={item}
                custom={index}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ProviderCard provider={relatedProvider} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
      </motion.div>
    </PublicLayout>
  );
}
