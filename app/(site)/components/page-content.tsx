'use client';

import SongItem from '@/components/song-item';
import useOnPlay from '@/hooks/useOnPlay';
import { allowedStatus } from '@/lib/constants/allowed-status';
import { Song } from '@/lib/types/types';
import { usePathname } from 'next/navigation';

interface PageContentProps {
  songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const pathname = usePathname();
  console.log('pathname', pathname);
  const showStatus = allowedStatus.includes(pathname);
  console.log('showStatus', showStatus);

  const onPlay = useOnPlay(songs);
  if (!songs.length) {
    return <div className='mt-4 text-neutral-400'>No songs found</div>;
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4'>
      {songs.map((song) => (
        <SongItem
          key={song.id}
          onClick={(id) => onPlay(id.toString())}
          data={song}
          status={showStatus ? song.status : undefined}
        />
      ))}
    </div>
  );
};

export default PageContent;
