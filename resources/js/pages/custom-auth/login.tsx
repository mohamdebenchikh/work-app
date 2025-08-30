import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomAuthLayout from '@/layouts/custom-auth-layout';
import { Link, useForm } from '@inertiajs/react';
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword, errors: serverErrors = {} }: { status?: string; canResetPassword: boolean; errors?: Record<string, string> }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState({
        google: false,
        github: false
    });
    const { data, setData, post, processing, errors: formErrors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    
    // Combine server-side and client-side errors
    const errors = { ...serverErrors, ...formErrors };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <CustomAuthLayout title="Welcome back" description="Sign in to your account to continue">
            <div className="space-y-6">
                {status && (
                    <Alert variant="default" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{status}</AlertDescription>
                    </Alert>
                )}

                {status && (
                    <Alert variant="default" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{status}</AlertDescription>
                    </Alert>
                )}

                {errors.email && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.email}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={submit} className="space-y-4" noValidate>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                                autoComplete="username"
                                className={`w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Enter your email"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                            {errors.email && (
                                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                                className={`w-full pr-10 pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                placeholder="Enter your password"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                )}
                            </Button>
                            {errors.password && (
                                <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <InputError message={errors.password } className='mt-1' />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" checked={data.remember} onCheckedChange={(checked) => setData('remember', Boolean(checked))} />
                            <Label htmlFor="remember" className="text-sm leading-none font-medium">
                                Remember me
                            </Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full"
                        onClick={() => {
                            setIsSocialLoading(prev => ({ ...prev, google: true }));
                            window.location.href = '/auth/google/redirect';
                        }}
                        disabled={isSocialLoading.google || processing}
                        aria-busy={isSocialLoading.google}
                    >
                        {isSocialLoading.google ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Please wait...
                            </span>
                        ) : (
                            <>
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.213 2.213-5.28 2.213-5.28 0-.32-.04-1.813-.04-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Google
                            </>
                        )}
                    </Button>
                    <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full"
                        onClick={() => {
                            setIsSocialLoading(prev => ({ ...prev, github: true }));
                            window.location.href = '/auth/github/redirect';
                        }}
                        disabled={isSocialLoading.github || processing}
                        aria-busy={isSocialLoading.github}
                    >
                        {isSocialLoading.github ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Please wait...
                            </span>
                        ) : (
                            <>
                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.39-1.332-1.756-1.332-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </>
                        )}
                    </Button>
                </div>

                <p className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Sign up
                    </Link>
                </p>
            </div>
        </CustomAuthLayout>
    );
}
