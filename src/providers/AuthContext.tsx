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

// Generate unique tab ID
const TAB_ID = typeof window !== 'undefined' ? `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Add timestamp to force fresh data and prevent caching
      const timestamp = Date.now();
      const response = await api.get('/auth/session', {
        params: { t: timestamp },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'X-Tab-ID': TAB_ID,
        },
      });

      const sessionUser = response.data?.user ?? response.data?.data?.user;
      const sessionId = response.data?.data?.session?.id || response.data?.session?.id;

      if (sessionUser) {
        // Only update if session ID changed (prevents cross-tab contamination)
        if (lastSessionId !== sessionId) {
          setLastSessionId(sessionId || null);
        }
        setUser(sessionUser);
      } else {
        setUser(null);
        setLastSessionId(null);
      }
    } catch (error) {
      console.log('Session not found or expired');
      setUser(null);
      setLastSessionId(null);
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
        await api.post('/auth/sign-out', {}, {
          headers: {
            'X-Tab-ID': TAB_ID,
          },
        });
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
