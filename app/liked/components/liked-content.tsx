'use client';

import LikeButton from '@/components/like-button';
import MediaItem from '@/components/media-item';
import { useUser } from '@/hooks/useUser';
import { Song } from '@/lib/types/types';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LikedContentProps {
  songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({
  songs,
}: {
  songs: Song[];
}) => {
  const router = useRouter();
  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (songs.length === 0) {
    return (
      <div className='flex flex-col gap-y-2 w-full px-6 text-neutral-400'>
        No songs liked
      </div>
    );
  }

  const handleClick = (id: number) => {};

  return (
    <div className='flex flex-col gap-y-2 w-full p-6'>
      {songs.map((song) => (
        <div key={song.id} className='flex items-center gap-x-4 w-full'>
          <div className='flex-1'>
            <MediaItem data={song} onClick={handleClick} />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
