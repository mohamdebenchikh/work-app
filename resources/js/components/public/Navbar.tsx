import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from '@/components/ui/sheet';
import { 
    Menu, 
    X, 
    Search, 
    Users, 
    Star, 
    MessageCircle, 
    Settings, 
    HelpCircle,
    Briefcase,
    Award,
    TrendingUp,
    Globe,
    LogOut
} from 'lucide-react';
import { UserDropdown } from './UserDropdown';

export default function PublicNavbar() {
    const { auth } = usePage<SharedData>().props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        {
            title: 'Find Services',
            href: route('public-providers.index'),
            icon: <Search className="w-4 h-4" />,
            description: 'Browse professional services'
        },
        {
            title: 'Top Professionals',
            href: '#featured-providers',
            icon: <Award className="w-4 h-4" />,
            description: 'Meet our verified experts'
        },
        {
            title: 'Categories',
            href: '#popular-categories',
            icon: <Briefcase className="w-4 h-4" />,
            description: 'Explore service categories'
        },
        {
            title: 'How it Works',
            href: '#how-it-works',
            icon: <HelpCircle className="w-4 h-4" />,
            description: 'Learn our process'
        },
        {
            title: 'Success Stories',
            href: '#testimonials',
            icon: <Star className="w-4 h-4" />,
            description: 'Client experiences'
        }
    ];

    const quickActions = [
        {
            title: 'Post a Job',
            href: route('client.register'),
            icon: <MessageCircle className="w-4 h-4" />,
            variant: 'default' as const
        },
        {
            title: 'Join as Pro',
            href: route('provider.register'),
            icon: <Users className="w-4 h-4" />,
            variant: 'outline' as const
        }
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={
                `fixed inset-x-0 top-0 z-50 transition-all duration-300 ` +
                (scrolled
                    ? 'border-b border-slate-200/20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg'
                    : 'bg-transparent')
            }
        >
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                    <Link 
                        href={route('home')} 
                        className="inline-flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                        </div>
                        WorkApp
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.slice(0, 4).map((link, index) => (
                        <motion.div
                            key={link.title}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link
                                href={link.href}
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300 group"
                            >
                                <span className="text-slate-500 group-hover:text-blue-500 transition-colors">
                                    {link.icon}
                                </span>
                                {link.title}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Desktop Auth Actions */}
                <div className="hidden md:flex items-center gap-3">
                    {auth?.user ? (
                        <div className="flex items-center gap-3">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Link href={route('dashboard')}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                </Button>
                            </motion.div>
                            <UserDropdown user={auth.user} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="ghost" asChild className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                                    <Link href={route('login')}>
                                        Log in
                                    </Link>
                                </Button>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Link href={route('register')}>
                                        Sign Up
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Trigger */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="md:hidden border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <Menu className="w-4 h-4" />
                        </Button>
                    </SheetTrigger>
                    
                    <SheetContent side="right" className="w-full sm:w-[400px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                        <SheetHeader className="text-left mb-6">
                            <SheetTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Globe className="w-3 h-3 text-white" />
                                </div>
                                WorkApp
                            </SheetTitle>
                        </SheetHeader>

                        <div className="space-y-6">
                            {/* Navigation Links */}
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                    Explore
                                </h3>
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <SheetClose asChild>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-3 rounded-xl p-3 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group"
                                            >
                                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                                                    {link.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{link.title}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                                        {link.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        </SheetClose>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    {quickActions.map((action, index) => (
                                        <motion.div
                                            key={action.title}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                        >
                                            <SheetClose asChild>
                                                <Button
                                                    variant={action.variant}
                                                    asChild
                                                    className={`w-full justify-start gap-2 ${
                                                        action.variant === 'default' 
                                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                                                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <Link href={action.href}>
                                                        {action.icon}
                                                        {action.title}
                                                    </Link>
                                                </Button>
                                            </SheetClose>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Auth Section */}
                            <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Account
                                </h3>
                                <div className="space-y-2">
                                    {auth?.user ? (
                                        <div className="space-y-2">
                                            <SheetClose asChild>
                                                <Link
                                                    href={route('profile.index')}
                                                    className="flex items-center gap-3 p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                                        {auth.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{auth.user.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">View Profile</p>
                                                    </div>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="flex items-center gap-3 p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <Settings className="w-5 h-5 text-slate-500" />
                                                    <span>Settings</span>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link
                                                    method="post"
                                                    href={route('logout')}
                                                    className="flex items-center gap-3 p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                    <span>Log out</span>
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    ) : (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.7 }}
                                            >
                                                <SheetClose asChild>
                                                    <Button variant="ghost" asChild className="w-full justify-start">
                                                        <Link href={route('login')}>
                                                            Log in to your account
                                                        </Link>
                                                    </Button>
                                                </SheetClose>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.8 }}
                                            >
                                                <SheetClose asChild>
                                                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                                        <Link href={route('register')}>
                                                            Sign Up
                                                        </Link>
                                                    </Button>
                                                </SheetClose>
                                            </motion.div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Footer */}
                            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { title: 'Privacy', href: '#' },
                                        { title: 'Terms', href: '#' },
                                        { title: 'Help', href: '#' },
                                        { title: 'Contact', href: '#' },
                                    ].map((link, index) => (
                                        <motion.div
                                            key={link.title}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                                        >
                                            <SheetClose asChild>
                                                <Link
                                                    href={link.href}
                                                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                                                >
                                                    {link.title}
                                                </Link>
                                            </SheetClose>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.9 }}
                                className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            10,000+ professionals
                                        </span>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                        Growing fast
                                    </Badge>
                                </div>
                            </motion.div>
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </motion.header>
    );
}