import { type Category } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Wrench, Hammer, Paintbrush, Scissors, PlugZap, Drill, ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<any>> = {
    plumbing: Wrench,
    carpentry: Hammer,
    painting: Paintbrush,
    beauty: Scissors,
    electrical: PlugZap,
    repair: Drill,
};

const colors = [
    'from-blue-500/10 to-blue-600/10',
    'from-purple-500/10 to-purple-600/10',
    'from-pink-500/10 to-pink-600/10',
    'from-indigo-500/10 to-indigo-600/10',
    'from-cyan-500/10 to-cyan-600/10',
    'from-emerald-500/10 to-emerald-600/10',
    'from-amber-500/10 to-amber-600/10',
    'from-rose-500/10 to-rose-600/10',
];

function getIcon(slug?: string) {
    if (!slug) return Wrench;
    return iconMap[slug] ?? Wrench;
}

export default function PopularCategories({ categories = [] as Category[] }) {
    const [showAll, setShowAll] = useState(false);
    const displayedCategories = showAll ? categories : categories.slice(0, 8);
    
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };
    
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 100
            }
        }
    };

    return (
        <div className="relative py-16 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 -z-10">
                <motion.div 
                    className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"
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
                        Popular Categories
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Browse through our most popular service categories
                    </p>
                </motion.div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {displayedCategories.map((cat, index) => {
                        const Icon = getIcon(cat.slug);
                        const colorClass = colors[index % colors.length];
                        
                        return (
                            <motion.div 
                                key={cat.id} 
                                variants={item}
                                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                className="group"
                            >
                                <Link
                                    href={route('providers.index', { category_id: cat.id })}
                                    className={`block h-full p-6 rounded-xl bg-gradient-to-br ${colorClass} border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClass.replace('/10', '/20')} backdrop-blur-sm`}>
                                            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-lg">{cat.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {categories.length > 8 && (
                    <motion.div 
                        className="mt-10 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            {showAll ? 'Show Less' : 'View All Categories'}
                            {showAll ? (
                                <Plus className="h-4 w-4 transform rotate-45" />
                            ) : (
                                <ArrowRight className="h-4 w-4" />
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}


