'use client';
import React from 'react';
import Image from 'next/image';

import useLoadImage from '@/hooks/useLoadImage';
import { Song } from '@/lib/types/types';
import PlayButton from './play-button';
import { sanitizeArtist } from '@/lib/helpers/santise-artist';

interface SongItemProps {
  onClick: (id: number) => void;
  data: Song;
  status?: string;
}

const SongItem: React.FC<SongItemProps> = ({ onClick, data, status }) => {
  const imagePath = useLoadImage(data);

  return (
    <div
      onClick={() => onClick(data.id)}
      className='relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-natural-400/10 transition p-3'
    >
      <div className='relative aspect-square w-full h-full rounded-md overflow-hidden'>
        {imagePath && (
          <Image
            className='object-cover'
            src={imagePath}
            alt={data.title}
            fill
          />
        )}
      </div>
      <div className='flex flex-col items-start w-full pt-4 gap-y-1'>
        <p className='font-semibold truncate w-full capitalize'>{data.title}</p>
        <p className='text-neutral-400 text-sm pb-2 truncate w-full capitalize'>
          {sanitizeArtist(data.author)}
        </p>
        {status && (
          <div className='text-neutral-400 text-sm pb-2 truncate w-full capitalize flex items-center gap-2'>
            {sanitizeArtist(data.status)}

            {data.status === 'approved' && (
              <span className='flex-none rounded-full bg-green-400/10 p-1 text-green-400'>
                <span className='size-1.5 rounded-full bg-current block' />
              </span>
            )}

            {data.status === 'rejected' && (
              <span className='flex-none rounded-full bg-rose-400/10 p-1 text-rose-400'>
                <span className='size-1.5 rounded-full bg-current block' />
              </span>
            )}

            {data.status === 'pending' && (
              <span className='flex-none rounded-full bg-amber-400/10 p-1 text-amber-400'>
                <span className='size-1.5 rounded-full bg-current block' />
              </span>
            )}
          </div>
        )}
      </div>
      <div className='absolute bottom-24 right-5'>
        <PlayButton />
      </div>
    </div>
  );
};

export default SongItem;
