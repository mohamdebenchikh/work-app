import { Head, Link } from '@inertiajs/react';
import { User, Briefcase, ChevronRight } from 'lucide-react';
import CustomAuthLayout from '@/layouts/custom-auth-layout';

export default function SelectRole() {
  return (
    <CustomAuthLayout
      title="Create an Account"
      description="Select your account type to get started"
    >
      <div className="space-y-4 w-full max-w-md mx-auto">
        <Link
          href="/client/register"
          className="flex items-center p-4 w-full border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">I'm a Client</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Looking to hire professionals for your projects
            </p>
          </div>
          <ChevronRight className="ml-auto w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/provider/register"
          className="flex items-center p-4 w-full border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">I'm a Provider</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Offering professional services to clients
            </p>
          </div>
          <ChevronRight className="ml-auto w-5 h-5 text-gray-400" />
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Sign in
        </Link>
      </p>
    </CustomAuthLayout>
  );
}
