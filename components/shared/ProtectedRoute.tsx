'use client';

import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (isLoading) return;

    if (!data) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && (!data.role || !allowedRoles.includes(data.role))) {
      router.replace('/');
    }
  }, [data, isLoading, allowedRoles, router]);

  if (isLoading) return <p>Loading...</p>;

  if (!data) return null;

  if (allowedRoles && (!data.role || !allowedRoles.includes(data.role))) return null;

  return <>{children}</>;
}