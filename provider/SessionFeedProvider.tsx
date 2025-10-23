'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useSessionFeed,
  SessionFeedState,
  SessionFeedActions,
} from '@/hooks/useSessionFeed';

interface SessionFeedContextType extends SessionFeedState, SessionFeedActions {}

const SessionFeedContext = createContext<SessionFeedContextType | undefined>(
  undefined
);

interface SessionFeedProviderProps {
  children: ReactNode;
}

export const SessionFeedProvider: React.FC<SessionFeedProviderProps> = ({
  children,
}) => {
  const sessionFeed = useSessionFeed();

  return (
    <SessionFeedContext.Provider value={sessionFeed}>
      {children}
    </SessionFeedContext.Provider>
  );
};

export const useSessionFeedContext = (): SessionFeedContextType => {
  const context = useContext(SessionFeedContext);
  if (context === undefined) {
    throw new Error(
      'useSessionFeedContext must be used within a SessionFeedProvider'
    );
  }
  return context;
};

// Convenience hooks for specific session data
export const useSession = () => {
  const { session, isLoading, error } = useSessionFeedContext();
  return { session, isLoading, error };
};

export const useUser = () => {
  const { user, isLoading, error } = useSessionFeedContext();
  return { user, isLoading, error };
};

export const useSessionActions = () => {
  const { refreshSession, signOut, clearError, isRefreshing } =
    useSessionFeedContext();
  return { refreshSession, signOut, clearError, isRefreshing };
};
