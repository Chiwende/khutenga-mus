'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { Session, User } from '@supabase/supabase-js';

export interface SessionFeedState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastRefresh: Date | null;
  sessionExpiry: Date | null;
}

export interface SessionFeedActions {
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useSessionFeed = (): SessionFeedState & SessionFeedActions => {
  const { session, isLoading: contextLoading } = useSessionContext();
  const supabase = useSupabaseClient();

  const [state, setState] = useState<SessionFeedState>({
    session: null,
    user: null,
    isLoading: true,
    isRefreshing: false,
    error: null,
    lastRefresh: null,
    sessionExpiry: null,
  });

  // Update session state when context changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      session,
      user: session?.user || null,
      isLoading: contextLoading,
      sessionExpiry: session?.expires_at
        ? new Date(session.expires_at * 1000)
        : null,
    }));
  }, [session, contextLoading]);

  // Auto-refresh session before expiry
  useEffect(() => {
    if (!session?.expires_at) return;

    const expiryTime = session.expires_at * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    // Refresh 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

    const timeoutId = setTimeout(() => {
      refreshSession();
    }, refreshTime);

    return () => clearTimeout(timeoutId);
  }, [session?.expires_at]);

  const refreshSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isRefreshing: true, error: null }));

    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Session refresh error:', error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          isRefreshing: false,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        session: data.session,
        user: data.user,
        lastRefresh: new Date(),
        isRefreshing: false,
        error: null,
      }));
    } catch (error) {
      console.error('Session refresh failed:', error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : 'Failed to refresh session',
        isRefreshing: false,
      }));
    }
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isRefreshing: true, error: null }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          isRefreshing: false,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        session: null,
        user: null,
        lastRefresh: new Date(),
        isRefreshing: false,
        error: null,
      }));
    } catch (error) {
      console.error('Sign out failed:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sign out',
        isRefreshing: false,
      }));
    }
  }, [supabase.auth]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    refreshSession,
    signOut,
    clearError,
  };
};
