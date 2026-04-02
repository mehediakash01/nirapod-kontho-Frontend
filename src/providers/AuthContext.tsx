'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { api } from '@/src/services/api';
import { toast } from 'sonner';
import type { User } from '@/src/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetchSession: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  const fetchSession = useCallback(async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      // Add timestamp to force fresh data and prevent caching
      const timestamp = Date.now();
      const response = await api.get('/auth/get-session', {
        params: { t: timestamp },
      });

      const sessionUser = response.data?.user ?? response.data?.data?.user;
      const sessionId = response.data?.data?.session?.id || response.data?.session?.id;

      if (sessionUser) {
        // Only update if session ID changed (prevents cross-tab contamination)
        if (lastSessionId !== sessionId) {
          setLastSessionId(sessionId || null);
        }
        setUser(sessionUser);
        return sessionUser;
      } else {
        setUser(null);
        setLastSessionId(null);
        return null;
      }
    } catch {
      console.log('Session not found or expired');
      setUser(null);
      setLastSessionId(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [lastSessionId]);

  const logout = async () => {
    try {
      // Clear user state first
      setUser(null);
      setLastSessionId(null);

      // Then try to sign out from backend
      try {
        await api.post('/auth/sign-out', {});
      } catch (error) {
        console.error('Backend sign-out error:', error);
        // Continue with client-side logout even if backend fails
      }

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      throw new Error('Logout failed');
    }
  };

  // Fetch session on mount
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
