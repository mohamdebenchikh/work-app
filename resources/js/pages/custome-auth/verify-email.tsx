import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomAuthLayout from '@/layouts/custom-auth-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <CustomAuthLayout
      title="Verify Your Email Address"
      description="Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?"
    >
      <div className="space-y-6">
        {status === 'verification-link-sent' && (
          <Alert className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <MailCheck className="h-4 w-4" />
            <AlertDescription>
              A new verification link has been sent to the email address you provided during registration.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={processing}
            >
              {processing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <form method="POST" action={route('logout')}>
              <button
                type="submit"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Log out
              </button>
            </form>
          </div>
        </form>
      </div>
    </CustomAuthLayout>
  );
}
