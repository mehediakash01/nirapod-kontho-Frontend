'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CircleAlert, Eye, EyeOff, Lock, Mail, ShieldPlus, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { registerSchema } from '../validation';

import { useRouter } from 'next/navigation';
import { registerUser } from '../service';
import { useAuth } from '@/src/providers/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type RegisterFormValues = z.infer<typeof registerSchema>;

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function RegisterForm() {
  const router = useRouter();
  const { refetchSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data);
      // Small delay to ensure token is stored
      await new Promise(resolve => setTimeout(resolve, 100));
      await refetchSession();
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as ApiErrorShape).response?.data?.message === 'string'
          ? (err as ApiErrorShape).response?.data?.message
          : 'Register failed';
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
          <ShieldPlus className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
        <CardDescription>
          Build your secure profile and start reporting safely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full name</label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...register('name')}
                placeholder="Enter your full name"
                className="h-11 border-primary/20 bg-white/70 pl-9 focus-visible:border-secondary"
                aria-invalid={Boolean(errors.name)}
              />
            </div>
            {errors.name?.message ? (
              <p className="inline-flex items-center gap-1 text-sm text-destructive">
                <CircleAlert className="h-4 w-4" />
                {errors.name.message}
              </p>
            ) : null}
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
                placeholder="At least 6 characters"
                className="h-11 border-primary/20 bg-white/70 pl-9 pr-10 focus-visible:border-secondary"
                aria-invalid={Boolean(errors.password)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
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

          <Button
            type="submit"
            className="h-11 w-full bg-linear-to-r from-secondary via-tertiary to-primary text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}