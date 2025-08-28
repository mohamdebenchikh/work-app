import { Star, Zap, BadgeCheck, Check, Clock, Shield, Users } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, ReactNode } from 'react';

interface FloatingElementProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

const FloatingElement = ({ children, delay = 0, className = '' }: FloatingElementProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        className={className}
    >
        {children}
    </motion.div>
);

export default function HeroVisualCard() {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            await controls.start({ 
                scale: [1, 1.05, 1],
                transition: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
            });
        };
        sequence();
    }, [controls]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-indigo-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-blue-100/20 dark:to-blue-900/10" />
            
            {/* Animated background elements */}
            <motion.div 
                animate={controls}
                className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            />
            <motion.div 
                animate={controls}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            />
            
            <div className="relative aspect-[16/10] w-full flex items-center justify-center p-8">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl blur-2xl opacity-70" />
                </div>

            {/* Main Content */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 text-center space-y-6"
            >
                <motion.div 
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                >
                    <Users className="h-8 w-8" />
                </motion.div>
                
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Find Trusted Professionals</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
                        Connect with verified experts for all your service needs
                    </p>
                </div>
            </motion.div>
            </div>

            {/* Bottom Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-5/6"
            >
                <div className="rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">Professional & Reliable</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300">Skilled workers for your needs</p>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white dark:border-slate-800" />
                            ))}
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">50+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Rating Badge */}
            <FloatingElement 
                delay={0.3}
                className="absolute left-4 top-4"
            >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`h-3.5 w-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                            />
                        ))}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white ml-1">4.9</span>
                    <span className="text-slate-500 text-[10px]">(2.4k)</span>
                </div>
            </FloatingElement>

            {/* Features */}
            <FloatingElement 
                delay={0.5}
                className="absolute right-4 top-4 flex flex-col gap-2"
            >
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <Zap className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500/20" />
                    <span className="font-medium text-slate-800 dark:text-white">Fast Service</span>
                </div>
                
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    <span className="font-medium text-slate-800 dark:text-white">Verified Pros</span>
                </div>
                
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-medium text-slate-800 dark:text-white">24/7 Support</span>
                </div>
            </FloatingElement>
        </motion.div>
    );
}
