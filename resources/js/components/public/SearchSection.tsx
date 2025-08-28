import { motion } from 'framer-motion';
import { Search, Star, Check, Shield, Zap, Users } from 'lucide-react';
import SearchCard from './SearchCard';
import { Badge } from '@/components/ui/badge';

interface SearchSectionProps {
    categories: any[];
    initialCountry?: string;
}

export default function SearchSection({ categories, initialCountry = '' }: SearchSectionProps) {
    const stats = [
        { value: '10,000+', label: 'Active Professionals', icon: Users },
        { value: '95%', label: 'Satisfaction Rate', icon: Star },
        { value: '5 Min', label: 'Average Response', icon: Zap },
        { value: '100%', label: 'Verified', icon: Shield }
    ];

    return (
        <section className="relative rounded-2xl py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ 
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ 
                        duration: 15, 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Find the perfect professional for any task
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Connect with skilled professionals ready to help with your projects. Quick, reliable, and hassle-free service matching.
                        </p>
                    </motion.div>

                    {/* Search Card */}
                    <motion.div 
                        className="relative mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <SearchCard
                            variant="hero"
                            categories={categories}
                            initialCountry={initialCountry}
                        />
                        <motion.div
                            animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ 
                                duration: 8, 
                                repeat: Infinity, 
                                repeatType: 'reverse',
                                ease: "easeInOut"
                            }}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Search className="w-5 h-5 text-white" />
                        </motion.div>
                        
                        <motion.p 
                            className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            Popular searches: 
                            <span className="font-medium text-foreground">Cleaning, Moving, Handyman, Beauty</span>
                        </motion.p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div 
                                    key={stat.label}
                                    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center"
                                    whileHover={{ 
                                        y: -5,
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                >
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-4 mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {[
                            'Secure Payments',
                            'Verified Professionals',
                            '24/7 Support',
                            'Satisfaction Guaranteed'
                        ].map((badge, index) => (
                            <Badge 
                                key={index}
                                variant="secondary"
                                className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70 text-sm font-medium"
                            >
                                <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                                {badge}
                            </Badge>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
