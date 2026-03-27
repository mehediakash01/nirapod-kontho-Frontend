'use client';


import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { data, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!data || !data.role) {
      router.replace('/login');
      return;
    }

    if (data.role === 'USER') router.replace('/dashboard/user');
    if (data.role === 'MODERATOR') router.replace('/dashboard/moderator');
    if (data.role === 'ADMIN' || data.role === 'NGO_ADMIN') router.replace('/dashboard/ngo');
    if (data.role === 'SUPER_ADMIN')
      router.replace('/dashboard/super-admin');
  }, [data, isLoading, router]);

  return <p>Loading your dashboard...</p>;
}