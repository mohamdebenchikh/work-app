import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User2, Star, MapPin, Check, Clock, Award, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProviderCardProps {
    name: string;
    city: string;
    rating?: number;
    service?: string;
    reviews?: number;
    image?: string;
}

function ProviderCard({ name, city, rating = 5, service = 'Service Professional', reviews = 0, image }: ProviderCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group h-full"
        >
            <Link
                href={route('providers.index', { q: name })}
                className="block h-full rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
                {/* Header with Image */}
                <div className="h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative overflow-hidden">
                    {image ? (
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <User2 className="h-16 w-16 opacity-20" />
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span>{rating.toFixed(1)}</span>
                        <span className="text-slate-400">({reviews})</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="h-4 w-4" />
                                {city}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <User2 className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">{service}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                            <Clock className="h-4 w-4" />
                            <span>Available now</span>
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>
                            ))}
                            <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                +12
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                            View Profile
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function FeaturedProviders() {
    // Placeholder content; replace with real data later
    const featured = [
        { 
            name: 'Ahmed Ali', 
            city: 'Cairo', 
            rating: 4.9, 
            service: 'Home Cleaning Expert',
            reviews: 128,
            image: '/placeholder-1.jpg'
        },
        { 
            name: 'Sara Mohamed', 
            city: 'Giza', 
            rating: 4.8, 
            service: 'Interior Designer',
            reviews: 94,
            image: '/placeholder-2.jpg'
        },
        { 
            name: 'Omar Youssef', 
            city: 'Alexandria', 
            rating: 4.9, 
            service: 'Plumbing Specialist',
            reviews: 156,
            image: '/placeholder-3.jpg'
        },
        { 
            name: 'Lina Hassan', 
            city: 'Cairo', 
            rating: 5.0, 
            service: 'Beauty Therapist',
            reviews: 203,
            image: '/placeholder-4.jpg'
        },
        { 
            name: 'Khaled Samir', 
            city: 'Giza', 
            rating: 4.7, 
            service: 'Electrician',
            reviews: 87,
            image: '/placeholder-5.jpg'
        },
        { 
            name: 'Mona Adel', 
            city: 'Alexandria', 
            rating: 4.8, 
            service: 'Personal Trainer',
            reviews: 112,
            image: '/placeholder-6.jpg'
        },
    ];

    return (
        <section className="relative py-16 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
                <motion.div 
                    className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"
                    animate={{ 
                        x: [0, -30, 0],
                        y: [0, 50, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ 
                        duration: 15, 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Trusted Service Professionals
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Connect with our top-rated professionals for all your service needs
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((provider, index) => (
                        <ProviderCard 
                            key={provider.name}
                            name={provider.name}
                            city={provider.city}
                            rating={provider.rating}
                            service={provider.service}
                            reviews={provider.reviews}
                            image={provider.image}
                        />
                    ))}
                </div>

                <motion.div 
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Link
                        href={route('providers.index')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        View All Service Providers
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div 
                    className="flex flex-wrap justify-center gap-6 mt-16 pt-12 border-t border-slate-200/50 dark:border-slate-700/30"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {[
                        { icon: <Check className="h-5 w-5 text-green-500" />, text: 'Verified Professionals' },
                        { icon: <ShieldCheck className="h-5 w-5 text-blue-500" />, text: 'Secure Payments' },
                        { icon: <Star className="h-5 w-5 text-amber-500" />, text: 'Customer Reviews' },
                        { icon: <Clock className="h-5 w-5 text-purple-500" />, text: '24/7 Support' }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            {item.icon}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}


