'use client';
import PageContent from '@/app/(site)/components/page-content';
import StatComponent from '@/components/stats';
import { Song } from '@/lib/types/types';
import { useState } from 'react';
import { CiGrid32, CiBoxList } from 'react-icons/ci';
import SongsTable from '../table';
import useAuthModal from '@/hooks/useAuthModal';
import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';

interface DashboardProps {
  songs: Song[];
}

const DashboardContent: React.FC<DashboardProps> = ({ songs }) => {
  const stats = [
    { id: 1, name: 'Total Streams', value: '8,000+' },
    { id: 2, name: 'Total Earnings', value: '3%' },
    { id: 3, name: 'Avg. Likes', value: '99.9%' },
    { id: 4, name: 'Total Songs', value: '$70M' },
  ];
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const user = useUser();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const onClick = () => {
    if (!user.user) {
      authModal.onOpen();
    }

    // TODO: Check for subscription

    return uploadModal.onOpen();
  };
  return (
    <div className='flex flex-col h-full bg-neutral-900'>
      <StatComponent stats={stats} />
      <div className='mx-auto w-full px-6 lg:px-8 flex justify-between py-4'>
        <div className='flex items-center gap-4'>
          <button
            onClick={onClick}
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
          >
            <svg
              className='fill-current w-4 h-4 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z' />
            </svg>
            <span>Upload Song</span>
          </button>

          <button className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'>
            <svg
              className='fill-current w-4 h-4 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z' />
            </svg>
            <span>Upload Album</span>
          </button>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setViewMode('list')}
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
          >
            <CiBoxList />
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className='bg-gray-300 hover:bg-gray-400 font-bold py-2 px-4 rounded inline-flex items-center text-red-500'
          >
            <CiGrid32 />
          </button>
        </div>
      </div>
      {viewMode === 'grid' ? (
        <div className='mx-auto w-full px-6 lg:px-8'>
          <PageContent songs={songs} />
        </div>
      ) : (
        <div className='mx-auto w-full px-6 lg:px-8'>
          <SongsTable songs={songs} />
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
