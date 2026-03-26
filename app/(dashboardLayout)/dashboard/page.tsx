'use client';


import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { data } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!data) return;

    if (data.role === 'USER') router.push('/dashboard/user');
    if (data.role === 'MODERATOR') router.push('/dashboard/moderator');
    if (data.role === 'ADMIN') router.push('/dashboard/ngo');
    if (data.role === 'SUPER_ADMIN')
      router.push('/dashboard/super-admin');
  }, [data]);

  return <p>Redirecting...</p>;
}