'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircleAlert, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema } from '../validation';

import { useRouter } from 'next/navigation';
import { loginUser } from '../service';
import { useAuth } from '@/src/providers/AuthContext';
import { initiateGoogleAuthFlow } from '../utils/oauth';
import OAuthButton from './OAuthButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginFormSkeleton } from '@/components/shared/LoadingSkeletons';

type LoginFormValues = z.infer<typeof loginSchema>;
type DemoRole = 'user' | 'moderator' | 'ngoadmin' | 'ngo';

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function LoginFormContent() {
  const router = useRouter();
  const { refetchSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [demoSubmittingRole, setDemoSubmittingRole] = useState<DemoRole | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const isAuthBusy = isSubmitting || oauthLoading || demoSubmittingRole !== null || isRedirecting;

  const loadDemoCredentialsAndSubmit = async (role: DemoRole) => {
    if (isAuthBusy) return;

    const creds = {
      user: { email: 'testuser@gmail.com', password: 'test@user' },
      moderator: { email: 'testmoderator@gmail.com', password: 'test@moderator' },
      ngoadmin: { email: 'testngoadmin@gmail.com', password: 'test@ngoadmin' },
      ngo: { email: 'testngo@gmail.com', password: 'test@ngo' },
    }[role];

    setValue('email', creds.email);
    setValue('password', creds.password);
    setDemoSubmittingRole(role);
    const signedIn = await onSubmit(creds);
    if (!signedIn) {
      setDemoSubmittingRole(null);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginUser(data);
      const sessionUser = await refetchSession();
      if (!sessionUser) {
        throw new Error('Unable to verify session after sign in');
      }
      toast.success('Signed in successfully');
      setIsRedirecting(true);
      router.push('/dashboard');
      return true;
    } catch (err: unknown) {
      setIsRedirecting(false);
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as ApiErrorShape).response?.data?.message === 'string'
          ? (err as ApiErrorShape).response?.data?.message
          : err instanceof Error
            ? err.message
          : 'Sign in failed';
      toast.error(message);
      return false;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setOauthLoading(true);
      await initiateGoogleAuthFlow();
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google sign in failed. Please try again.');
      setOauthLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <LogIn className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to continue in your secure reporting workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 mb-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase flex justify-center tracking-wider">Demo Login</label>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                ['user', 'User'],
                ['moderator', 'Moderator'],
                ['ngoadmin', 'NGO Admin'],
                ['ngo', 'NGO'],
              ].map(([role, label]) => (
                <Button
                  key={role}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 min-w-16 px-2 text-[10px] border-primary/20 hover:bg-primary/10"
                  disabled={isAuthBusy}
                  onClick={() => loadDemoCredentialsAndSubmit(role as DemoRole)}
                >
                  {demoSubmittingRole === role ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  {label}
                </Button>
              ))}
            </div>
            {demoSubmittingRole ? (
              <p className="text-center text-xs text-muted-foreground">Signing in with the selected demo account...</p>
            ) : null}
          </div>

          <OAuthButton
            provider="google"
            isLoading={oauthLoading}
            disabled={isSubmitting || demoSubmittingRole !== null}
            onClick={handleGoogleLogin}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/15" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/70  dark:text-black px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="h-11 border-primary/20 bg-white/70 pl-9 focus-visible:border-secondary"
                aria-invalid={Boolean(errors.email)}
                disabled={isAuthBusy}
              />
            </div>
            {errors.email?.message ? (
              <p className="inline-flex items-center gap-1 text-sm text-destructive">
                <CircleAlert className="h-4 w-4" />
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className="h-11 border-primary/20 bg-white/70 pl-9 pr-10 focus-visible:border-secondary"
                aria-invalid={Boolean(errors.password)}
                disabled={isAuthBusy}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isAuthBusy}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password?.message ? (
              <p className="inline-flex items-center gap-1 text-sm text-destructive">
                <CircleAlert className="h-4 w-4" />
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-primary/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isAuthBusy}
                className="h-4 w-4 rounded border-primary/30 accent-secondary"
              />
              Keep me signed in
            </label>
            <Link href="/forgot-password" className="font-medium text-secondary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-linear-to-r from-primary via-tertiary to-secondary text-white"
            disabled={isAuthBusy}
          >
            {isAuthBusy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/register" className="font-semibold text-secondary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginFormContent />
    </Suspense>
  );
}
