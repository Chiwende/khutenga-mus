'use client';

import SongItem from '@/components/song-item';
import useOnPlay from '@/hooks/useOnPlay';
import { Song } from '@/lib/types/types';

interface PageContentProps {
  songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
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
        />
      ))}
    </div>
  );
};

export default PageContent;
