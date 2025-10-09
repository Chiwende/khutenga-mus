'use client';

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
  songs: any[];
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
  return <>Liked Content</>;
};

export default LikedContent;
