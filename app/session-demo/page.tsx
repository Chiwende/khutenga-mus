'use client';

import React from 'react';
import SessionStatus from '@/components/session-status';
import { useSessionFeedContext } from '@/provider/SessionFeedProvider';

const SessionDemoPage = () => {
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
    return date.toLocaleString();
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

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Session Feed Demo
        </h1>

        {/* Session Status Component */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Session Status Component
          </h2>
          <SessionStatus showDetails={true} />
        </div>

        {/* Detailed Session Information */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Detailed Session Information
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-700 mb-3'>
                Session State
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Loading:</span>
                  <span
                    className={isLoading ? 'text-yellow-600' : 'text-green-600'}
                  >
                    {isLoading ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Refreshing:</span>
                  <span
                    className={
                      isRefreshing ? 'text-yellow-600' : 'text-green-600'
                    }
                  >
                    {isRefreshing ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Has Session:</span>
                  <span className={session ? 'text-green-600' : 'text-red-600'}>
                    {session ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Has User:</span>
                  <span className={user ? 'text-green-600' : 'text-red-600'}>
                    {user ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Error:</span>
                  <span className={error ? 'text-red-600' : 'text-green-600'}>
                    {error || 'None'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium text-gray-700 mb-3'>
                Session Details
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>User Email:</span>
                  <span className='text-gray-900'>{user?.email || 'N/A'}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>User ID:</span>
                  <span className='text-gray-900 font-mono text-xs'>
                    {user?.id ? `${user.id.substring(0, 8)}...` : 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Last Refresh:</span>
                  <span className='text-gray-900'>
                    {formatTime(lastRefresh)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Expires In:</span>
                  <span className='text-gray-900'>{getTimeUntilExpiry()}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Session Expiry:</span>
                  <span className='text-gray-900'>
                    {formatTime(sessionExpiry)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Session Actions
          </h2>

          <div className='flex flex-wrap gap-4'>
            <button
              onClick={refreshSession}
              disabled={isRefreshing}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
            </button>

            <button
              onClick={signOut}
              disabled={isRefreshing || !user}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Sign Out
            </button>

            {error && (
              <button
                onClick={clearError}
                className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
              >
                Clear Error
              </button>
            )}
          </div>
        </div>

        {/* Raw Session Data */}
        {session && (
          <div className='bg-white rounded-lg shadow-md p-6 mt-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Raw Session Data
            </h2>
            <pre className='bg-gray-100 p-4 rounded-md overflow-auto text-xs'>
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDemoPage;
