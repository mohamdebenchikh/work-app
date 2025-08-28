import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CalendarClock, Coins, MapPin, Clock, ArrowRight, Plus } from 'lucide-react';
import { JSX, useState } from 'react';

interface RequestCardProps {
    title: string;
    city: string;
    budget: string;
    deadline: string;
    category?: string;
    postedTime?: string;
    description?: string;
}

const categoryColors: Record<string, string> = {
    'plumbing': 'from-blue-500/10 to-blue-600/10',
    'painting': 'from-purple-500/10 to-purple-600/10',
    'electrical': 'from-amber-500/10 to-amber-600/10',
    'beauty': 'from-pink-500/10 to-pink-600/10',
    'carpentry': 'from-emerald-500/10 to-emerald-600/10',
    'cleaning': 'from-cyan-500/10 to-cyan-600/10',
    'default': 'from-slate-500/10 to-slate-600/10'
};

const categoryIcons: Record<string, JSX.Element> = {
    'plumbing': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.42 15.17L17.25 9.33A4 4 0 0019 7.5h-1.5a4 4 0 01-2.83-1.17l-1.5-1.5a4 4 0 00-5.66 0l-1.5 1.5a4 4 0 01-2.83 1.17H5a4 4 0 00-4 4v1.5a4 4 0 001.17 2.83l5.83 5.83a4 4 0 005.66 0l1.5-1.5a4 4 0 00-1.17-2.83z" /></svg>,
    'painting': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5" /></svg>,
    'electrical': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    'beauty': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    'carpentry': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    'cleaning': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    'default': <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
};

function RequestCard({ title, city, budget, deadline, category = 'default', postedTime = '2 hours ago', description = 'Looking for a professional to help with this task. Please contact me for more details.' }: RequestCardProps) {
    const colorClass = categoryColors[category.toLowerCase()] || categoryColors['default'];
    const icon = categoryIcons[category.toLowerCase()] || categoryIcons['default'];
    
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
                href={route('service-requests.index')}
                className="block h-full rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
                {/* Category Header */}
                <div className={`h-2 bg-gradient-to-r ${colorClass}`}></div>
                
                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className={`p-2 rounded-lg ${colorClass.replace('/10', '/20')} text-blue-600 dark:text-blue-400`}>
                            {icon}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                            <Clock className="h-3 w-3" />
                            {postedTime}
                        </span>
                    </div>
                    
                    <h3 className="mt-4 font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {title}
                    </h3>
                    
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                <span className="truncate">{city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Coins className="h-4 w-4 flex-shrink-0 text-amber-500" />
                                <span className="font-medium text-slate-900 dark:text-slate-100">{budget}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                            View Details
                            <ArrowRight className="h-4 w-4" />
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {deadline} left
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function RecentlyPostedRequests() {
    const [showAll, setShowAll] = useState(false);
    
    // Placeholder content; replace with real data later
    const items = [
        { 
            title: 'Fix leaking kitchen sink', 
            city: 'Cairo', 
            budget: '$50-80', 
            deadline: '3 days',
            category: 'Plumbing',
            postedTime: '2 hours ago',
            description: 'Need someone to fix a leaking kitchen sink. The pipe under the sink is dripping water.'
        },
        { 
            title: 'Paint living room walls', 
            city: 'Giza', 
            budget: '$150-250', 
            deadline: '1 week',
            category: 'Painting',
            postedTime: '5 hours ago',
            description: 'Looking for a professional painter to repaint my living room walls in a light blue color.'
        },
        { 
            title: 'Install ceiling fan in bedroom', 
            city: 'Alexandria', 
            budget: '$80-120', 
            deadline: '5 days',
            category: 'Electrical',
            postedTime: '1 day ago',
            description: 'Need help installing a new ceiling fan in my bedroom. I already have the fan, just need installation.'
        },
        { 
            title: 'Hair & makeup for wedding', 
            city: 'Cairo', 
            budget: '$60-100', 
            deadline: '2 days',
            category: 'Beauty',
            postedTime: '3 hours ago',
            description: 'Looking for a professional makeup artist and hairstylist for my wedding day.'
        },
    ];

    const displayedItems = showAll ? items : items.slice(0, 4);
    
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <section className="relative py-16 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
                <motion.div 
                    className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl"
                    animate={{ 
                        x: [0, 30, 0],
                        y: [0, -50, 0],
                        rotate: [0, 5, 0]
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
                        Recently Posted Requests
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Browse through service requests from people in your area
                    </p>
                </motion.div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {displayedItems.map((item, index) => (
                        <RequestCard key={`${item.title}-${index}`} {...item} />
                    ))}
                </motion.div>

                <motion.div 
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        {showAll ? 'Show Less' : 'View All Requests'}
                        {showAll ? (
                            <Plus className="h-4 w-4 transform rotate-45" />
                        ) : (
                            <ArrowRight className="h-4 w-4" />
                        )}
                    </button>
                </motion.div>

                <motion.div 
                    className="mt-16 pt-12 border-t border-slate-200/50 dark:border-slate-700/30 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h3 className="text-xl font-semibold mb-4">Have a service you need help with?</h3>
                    <Link
                        href={route('service-requests.create')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                    >
                        Post a Request
                        <Plus className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}


