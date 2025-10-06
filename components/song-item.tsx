'use client';
import React from 'react';
import Image from 'next/image';
import useLoadImage from '@/hooks/useLoadImage';
import { Song } from '@/lib/types/types';
import { Play } from 'next/font/google';
import PlayButton from './play-button';

interface SongItemProps {
  onClick: (id: string) => void;
  data: Song;
}

const SongItem: React.FC<SongItemProps> = ({ onClick, data }) => {
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
        <p className='font-semibold truncate w-full'>{data.title}</p>
        <p className='text-neutral-400 text-sm pb-2 truncate w-full'>
          {data.author}
        </p>
      </div>
      <div className='absolute bottom-24 right-5'>
        <PlayButton />
      </div>
    </div>
  );
};

export default SongItem;
