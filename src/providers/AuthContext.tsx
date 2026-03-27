'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { api } from '@/src/services/api';
import { toast } from 'sonner';
import type { User } from '@/src/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetchSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      let response;

      // Try OAuth session endpoint first (for OAuth-authenticated users)
      try {
        response = await api.get('/oauth/session');
        const sessionUser = response.data?.user ?? response.data?.data?.user;
        if (sessionUser) {
          setUser(sessionUser);
          return;
        }
      } catch (oauthError) {
        console.log('OAuth session not found, trying auth endpoint...');
      }

      // Fall back to regular auth session endpoint (for email/password users)
      try {
        response = await api.get('/auth/session');
        const sessionUser = response.data?.user ?? response.data?.data?.user;
        if (sessionUser) {
          setUser(sessionUser);
          return;
        }
      } catch (authError) {
        console.log('Auth session not found');
      }

      // No session found
      setUser(null);
    } catch (error) {
      console.error('Session fetch error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/sign-out');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      throw new Error('Logout failed');
    }
  };

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refetchSession: fetchSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
