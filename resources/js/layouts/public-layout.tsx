import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import { cn } from '@/lib/utils';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
  showFooter?: boolean;
  showNavbar?: boolean;
  fullWidth?: boolean;
}

export function PublicLayout({
  children,
  title,
  className = '',
  showFooter = true,
  showNavbar = true,
  fullWidth = true,
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-blue-50/50 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900">
      <Head>
        <title>{title ? `${title} | WorkApp` : 'WorkApp'}</title>
      </Head>

      {showNavbar && (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80">
          <PublicNavbar />
        </header>
      )}

      <main className={cn('flex-1', !fullWidth && 'mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8', className,showNavbar ? 'pt-20' : 'pt-0',showFooter ? 'pb-20' : 'pb-0',"bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-900/30")}>
        {children}
      </main>

      {showFooter && <PublicFooter />}

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -left-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-r from-blue-100/20 to-purple-100/20 blur-3xl dark:from-blue-900/10 dark:to-purple-900/10"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-r from-blue-50/20 to-purple-50/20 blur-3xl dark:from-blue-900/10 dark:to-purple-900/10"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [5, 0, 5]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
      </div>
    </div>
  );
}

export default PublicLayout;
