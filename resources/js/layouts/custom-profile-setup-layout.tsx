import ProfileSetupSkipButton from '@/components/profile-setup-skip-button';
import { ModeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

interface CustomProfileSetUpLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    showAuthHeader?: boolean;
    className?: string;
    canSkip?: boolean;
    nextStepUrl?: string;
}

export default function CustomProfileSetUpLayout({
    children,
    title,
    description,
    showAuthHeader = true,
    className = '',
    canSkip = false,
    nextStepUrl = '',
}: CustomProfileSetUpLayoutProps) {
    const currentYear = new Date().getFullYear();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: 'easeOut' as const,
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 120,
                damping: 20,
                duration: 0.6,
            },
        },
    };

    const titleVariants = {
        hidden: {
            opacity: 0,
            y: 10,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut' as const,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <Head title={title}>
                <meta name="description" content={description} />
            </Head>

            {/* Header */}
            {showAuthHeader && (
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
                >
                    <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                                WorkApp
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ModeToggle />
                        </div>
                    </div>
                </motion.header>
            )}

            <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className={cn('w-full max-w-md', className)}>
                    {title && (
                        <motion.div variants={titleVariants} className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
                            {description && <p className="mt-3 text-slate-500 dark:text-slate-400">{description}</p>}
                        </motion.div>
                    )}

                    <motion.div
                        variants={cardVariants}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700/50 dark:bg-slate-800/50"
                    >
                        <div className="p-8 sm:p-10">
                            {children}
                            <div className='mt-4 space-y-2'>
                              <ProfileSetupSkipButton canSkip={canSkip} nextStepUrl={nextStepUrl} />
                              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                You can update your infromation later in your profile settings
                            </p>
                            </div>
                           
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700/50 dark:bg-slate-800/30">
                            <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {currentYear} WorkApp. All rights reserved.</p>
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            <Toaster position="top-center" richColors />
        </div>
    );
}
