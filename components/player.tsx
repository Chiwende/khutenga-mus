'use client';

import useGetSongById from '@/hooks/useGetSongById';
import useLoadSong from '@/hooks/useLoadSongUrl';
import usePlayer from '@/hooks/usePlayerHook';
import PlayerContent from './player-content';
import useLoadImage from '@/hooks/useLoadImage';

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId || '');
  const songUrl = useLoadSong(song!);

  if (!song || !songUrl || !player.activeId) return null;

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 w-[98%] rounded-2xl overflow-hidden shadow-lg'>
      <div
        className='relative h-[80px] bg-cover bg-center bg-slate-800/20'
        // style={{ backgroundImage: `url(${imagePath})` }}
      >
        <div className='absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center px-4'>
          <PlayerContent key={songUrl} song={song} songUrl={songUrl} />
        </div>
      </div>
    </div>
  );
};

export default Player;
