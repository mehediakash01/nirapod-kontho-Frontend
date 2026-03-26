'use client';

import { useAuth as useAuthContext } from '@/src/providers/AuthContext';

export const useAuth = () => {
  const { user, isLoading, refetchSession } = useAuthContext();

  return {
    data: user,
    isLoading,
    refetch: refetchSession,
  };
};