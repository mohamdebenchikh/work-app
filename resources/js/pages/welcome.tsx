import FeaturedProviders from '@/components/public/FeaturedProviders';
import HeroVisualCard from '@/components/public/HeroVisualCard';
import PopularCategories from '@/components/public/PopularCategories';
import RecentlyPostedRequests from '@/components/public/RecentlyPostedRequests';
import SearchSection from '@/components/public/SearchSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, MessageCircle, Search, Shield, Star, Users, Zap } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <PublicLayout
            title="Welcome"
        >
            {/* Hero Section - Enhanced with modern gradients and animations */}
            <section className="relative overflow-hidden">
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 lg:py-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 items-center  gap-16 lg:grid-cols-2"
                    >
                        {/* Left Column - Enhanced Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-10"
                        >
                            <div className="space-y-6">
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                                    <Badge
                                        variant="secondary"
                                        className="w-fit border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-blue-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 dark:text-blue-300"
                                    >
                                        <Zap className="mr-2 h-3 w-3" />
                                        Connecting Talent with Opportunity
                                    </Badge>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-5xl leading-tight font-bold tracking-tight sm:text-6xl lg:text-7xl"
                                >
                                    Find the perfect{' '}
                                    <motion.span
                                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                    >
                                        professional
                                    </motion.span>{' '}
                                    for any job
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="text-xl leading-relaxed font-light text-muted-foreground sm:text-2xl"
                                >
                                    Discover skilled professionals ready to help with your projects.
                                    <br />
                                    <span className="font-medium text-blue-600 dark:text-blue-400">Quick, reliable, and hassle-free</span> service
                                    matching.
                                </motion.p>
                            </div>

                            {/* Enhanced Search Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="space-y-4"
                            >
                                <div className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        className="space-y-4"
                                    >
                                        <Button
                                            asChild
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto"
                                            size="lg"
                                        >
                                            <Link href="/register">
                                                Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="w-full border-slate-300 sm:w-auto dark:border-slate-600" size="lg">
                                            How it works
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 1 }}
                                    >
                                        <div className="flex items-center">
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                            No credit card required
                                        </div>
                                        <div className="flex items-center">
                                            <Shield className="mr-2 h-4 w-4 text-blue-500" />
                                            100% Secure
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Enhanced Visual with floating elements */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative"
                        >
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative overflow-hidden rounded-3xl shadow-2xl"
                            >
                                <HeroVisualCard />
                            </motion.div>

                            {/* Floating Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1, type: 'spring' }}
                                className="absolute -top-4 -left-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium">Verified</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, type: 'spring' }}
                                className="absolute -right-4 -bottom-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">10k+ Users</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Search Section */}
            <SearchSection categories={(usePage().props as any).categories || []} initialCountry={(usePage().props as any).initialCountry || ''} />

            {/* Main Content with enhanced spacing and animations */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Popular Categories - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-20"
                >
                    <PopularCategories categories={(usePage().props as any).categories || []} />
                </motion.div>

                {/* How it Works - Completely redesigned */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-20"
                >
                    <div className="mb-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="outline" className="mb-4 border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300">
                                How it works
                            </Badge>
                            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                                Get started in{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">three simple steps</span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                                Our streamlined process connects you with the right professional in minutes, not hours.
                            </p>
                        </motion.div>
                    </div>

                    <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Connection Lines */}
                        <div className="absolute top-1/2 right-1/3 left-1/3 hidden h-px -translate-y-1/2 transform bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 md:block dark:from-blue-800 dark:via-purple-800 dark:to-blue-800" />

                        {[
                            {
                                step: 1,
                                title: 'Post a request',
                                description: 'Describe your task, set your budget, and specify your timeline with our intelligent form.',
                                icon: <Search className="h-6 w-6" />,
                                color: 'from-blue-500 to-blue-600',
                            },
                            {
                                step: 2,
                                title: 'Get offers',
                                description: 'Receive competitive proposals from verified professionals with detailed profiles and reviews.',
                                icon: <MessageCircle className="h-6 w-6" />,
                                color: 'from-purple-500 to-purple-600',
                            },
                            {
                                step: 3,
                                title: 'Hire with confidence',
                                description: 'Message directly, hire securely, and leave reviews to help our community grow.',
                                icon: <Shield className="h-6 w-6" />,
                                color: 'from-indigo-500 to-indigo-600',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="relative"
                            >
                                <Card className="group h-full border-slate-200/50 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800/50">
                                    <CardContent className="p-8 text-center">
                                        <motion.div
                                            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-lg transition-all duration-300 group-hover:shadow-xl`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                                        >
                                            {item.icon}
                                        </motion.div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Step number indicator */}
                                <motion.div
                                    className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-sm font-bold text-white shadow-lg"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                                    viewport={{ once: true }}
                                >
                                    {item.step}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Features - Enhanced with better visual hierarchy */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-20"
                >
                    <div className="mb-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="outline" className="mb-4 border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300">
                                Why choose us
                            </Badge>
                            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                                Built for{' '}
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    trust, speed & quality
                                </span>
                            </h2>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[
                            {
                                title: 'Verified profiles',
                                description:
                                    'Every professional is background-checked with verified ratings and comprehensive reviews from real clients.',
                                icon: <CheckCircle className="h-8 w-8" />,
                                gradient: 'from-green-400 to-emerald-500',
                            },
                            {
                                title: 'Smart matching',
                                description:
                                    'AI-powered algorithm ensures your requests reach the most qualified professionals in your area instantly.',
                                icon: <Zap className="h-8 w-8" />,
                                gradient: 'from-yellow-400 to-orange-500',
                            },
                            {
                                title: 'Clear offers',
                                description:
                                    'Compare detailed proposals with transparent pricing, realistic timelines, and comprehensive project scope.',
                                icon: <Star className="h-8 w-8" />,
                                gradient: 'from-blue-400 to-indigo-500',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group"
                            >
                                <Card className="h-full border-slate-200/50 bg-gradient-to-br from-white to-slate-50 transition-all duration-500 hover:shadow-2xl dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-900">
                                    <CardContent className="p-8">
                                        <motion.div
                                            className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                                        >
                                            {feature.icon}
                                        </motion.div>
                                        <div className="space-y-4">
                                            <h4 className="text-xl font-bold transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                {feature.title}
                                            </h4>
                                            <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Featured Content - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-20"
                >
                    <FeaturedProviders />
                    <div className="mt-20">
                        <RecentlyPostedRequests />
                    </div>
                </motion.div>

                {/* CTA Section - Completely redesigned */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="py-20"
                >
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <motion.div
                                animate={{
                                    backgroundPosition: ['0% 0%', '100% 100%'],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                className="h-full w-full bg-[radial-gradient(circle,_white_2px,_transparent_2px)] bg-[length:50px_50px]"
                            />
                        </div>

                        <CardContent className="relative p-12 text-center text-white">
                            {auth.user ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-3xl font-bold sm:text-4xl">Ready to continue your journey?</h3>
                                    <p className="mx-auto max-w-2xl text-xl text-blue-100">
                                        Access your personalized dashboard to manage requests, track offers, and connect with professionals.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            asChild
                                            size="lg"
                                            className="group bg-white text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
                                        >
                                            <Link href={route('dashboard')}>
                                                Open Dashboard
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-3xl font-bold sm:text-4xl">Ready to transform your projects?</h3>
                                    <p className="mx-auto max-w-2xl text-xl text-blue-100">
                                        Join thousands of satisfied clients and get matched with top professionals in under 24 hours.
                                    </p>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                asChild
                                                size="lg"
                                                className="group bg-white text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
                                            >
                                                <Link href={route('register')}>
                                                    Join as Client
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="border-white/30 bg-transparent text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                                                asChild
                                            >
                                                <Link href={route('login')}>Browse Services</Link>
                                            </Button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.section>
            </div>
        </PublicLayout>
    );
}
