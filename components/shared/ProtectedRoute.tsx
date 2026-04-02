'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Role } from '@/src/types/user';

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
  const searchParams = useSearchParams();
  const isOAuthHandoff =
    pathname === '/dashboard' && searchParams.get('oauth_success') === 'true';

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

  if (isLoading) return <p>Loading...</p>;

  if (!data && isOAuthHandoff) {
    return <>{children}</>;
  }

  if (!data) return null;

  if (allowedRoles && (!data.role || !allowedRoles.includes(data.role))) return null;

  return <>{children}</>;
}
