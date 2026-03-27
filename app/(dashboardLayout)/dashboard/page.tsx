'use client';


import { useAuth } from '@/src/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardRedirect() {
  const { data, isLoading, refetch } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefetching, setIsRefetching] = useState(false);
  const [oauthRetryCount, setOauthRetryCount] = useState(0);
  const oauthSuccess = searchParams.get('oauth_success') === 'true';

  // Handle OAuth callback - trigger session refetch
  useEffect(() => {
    if (oauthSuccess && !isLoading && !data && !isRefetching && oauthRetryCount < 3) {
      setIsRefetching(true);
      // Refetch session after OAuth redirect
      refetch()
        .then(() => {
          setIsRefetching(false);
          setOauthRetryCount((prev) => prev + 1);
        })
        .catch((error) => {
          console.error('Failed to refetch session after OAuth:', error);
          setIsRefetching(false);
          setOauthRetryCount((prev) => prev + 1);
        });
    }
  }, [oauthSuccess, isLoading, data, refetch, isRefetching, oauthRetryCount]);

  useEffect(() => {
    if (isLoading || isRefetching) return;

    // Give OAuth callback a few attempts before falling back to login.
    if (oauthSuccess && !data && oauthRetryCount < 3) {
      return;
    }

    if (!data || !data.role) {
      router.replace('/login');
      return;
    }

    if (data.role === 'USER') router.replace('/dashboard/user');
    if (data.role === 'MODERATOR') router.replace('/dashboard/moderator');
    if (data.role === 'NGO_ADMIN') router.replace('/dashboard/ngo');
    if (data.role === 'SUPER_ADMIN')
      router.replace('/dashboard/super-admin');
  }, [data, isLoading, isRefetching, oauthSuccess, oauthRetryCount, router]);

  return <p>Loading your dashboard...</p>;
}