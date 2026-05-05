'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import type { Role } from '@/src/types/user';
import { PageSkeleton } from '@/components/shared/LoadingSkeletons';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const { data, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isOAuthHandoff =
    pathname === '/dashboard' &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('oauth_success') === 'true';

  useEffect(() => {
    if (isLoading) return;

    if (!data) {
      if (isOAuthHandoff) {
        return;
      }
      router.replace('/login');
      return;
    }

    if (allowedRoles && (!data.role || !allowedRoles.includes(data.role))) {
      router.replace('/');
    }
  }, [data, isLoading, allowedRoles, isOAuthHandoff, router]);

  if (isLoading) return <PageSkeleton />;

  if (!data && isOAuthHandoff) {
    return <>{children}</>;
  }

  if (!data) return null;

  if (allowedRoles && (!data.role || !allowedRoles.includes(data.role))) return null;

  return <>{children}</>;
}
