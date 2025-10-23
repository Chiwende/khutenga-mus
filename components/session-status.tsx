'use client';

import React from 'react';
import { useSessionFeedContext } from '@/provider/SessionFeedProvider';
import Button from '@/components/button';

interface SessionStatusProps {
  showDetails?: boolean;
  className?: string;
}

const SessionStatus: React.FC<SessionStatusProps> = ({
  showDetails = false,
  className = '',
}) => {
  const {
    session,
    user,
    isLoading,
    isRefreshing,
    error,
    lastRefresh,
    sessionExpiry,
    refreshSession,
    signOut,
    clearError,
  } = useSessionFeedContext();

  const formatTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString();
  };

  const getTimeUntilExpiry = () => {
    if (!sessionExpiry) return 'N/A';
    const now = new Date();
    const diff = sessionExpiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <div
        className={`p-4 bg-yellow-100 border border-yellow-400 rounded ${className}`}
      >
        <div className='flex items-center'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2'></div>
          <span className='text-yellow-800'>Loading session...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 bg-red-100 border border-red-400 rounded ${className}`}
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-red-800 font-medium'>Session Error</p>
            <p className='text-red-600 text-sm'>{error}</p>
          </div>
          <div className='flex space-x-2'>
            <Button onClick={clearError}>Dismiss</Button>
            <Button onClick={refreshSession} disabled={isRefreshing}>
              {isRefreshing ? 'Refreshing...' : 'Retry'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div
        className={`p-4 bg-gray-100 border border-gray-400 rounded ${className}`}
      >
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-gray-800 font-medium'>No Active Session</p>
            <p className='text-gray-600 text-sm'>Please sign in to continue</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-green-100 border border-green-400 rounded ${className}`}
    >
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-green-800 font-medium'>Session Active</p>
          <p className='text-green-600 text-sm'>
            Welcome, {user.email || 'User'}
          </p>
          {showDetails && (
            <div className='mt-2 text-xs text-green-600 space-y-1'>
              <p>Last refresh: {formatTime(lastRefresh)}</p>
              <p>Expires in: {getTimeUntilExpiry()}</p>
              <p>User ID: {user.id}</p>
            </div>
          )}
        </div>
        <div className='flex space-x-2'>
          <Button onClick={refreshSession} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      </div>
    </div>
  );
};

export default SessionStatus;
