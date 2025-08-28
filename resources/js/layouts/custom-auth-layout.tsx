import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/theme-toggle';

interface CustomAuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showAuthHeader?: boolean;
  className?: string;
}

export default function CustomAuthLayout({
  children,
  title,
  description,
  showAuthHeader = true,
  className = '',
}: CustomAuthLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <Head title={title}>
        <meta name="description" content={description} />
      </Head>

      {/* Header */}
      {showAuthHeader && (
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
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
        </header>
      )}

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6">
        <div className={cn('w-full max-w-md', className)}>
          {title && (
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-3 text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
          )}
          
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700/50 dark:bg-slate-800/50">
            <div className="p-8 sm:p-10">
              {children}
            </div>
            
            <div className="border-t border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700/50 dark:bg-slate-800/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                &copy; {currentYear} WorkApp. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Toaster position="top-center" richColors />
    </div>
  );
}
