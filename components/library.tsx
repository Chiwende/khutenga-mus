'use client';

import { AiOutlinePlus } from 'react-icons/ai';
import { TbPlaylist } from 'react-icons/tb';
import useAuthModal from '@/hooks/useAuthModal';
import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { Song } from '@/lib/types/types';
import { LuRadioTower } from 'react-icons/lu';

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const user = useUser();
  const onClick = () => {
    if (!user.user) {
      authModal.onOpen();
    }

    // TODO: Check for subscription

    return uploadModal.onOpen();
  };
  return (
    <div className='flex flex-col gap-y-2 px-3'>
      <div className='flex items-center justify-between px-2 pt-4'>
        <div className='inline-flex items-center gap-x-2'>
          <TbPlaylist size={26} className='text-neutral-400' />
          <p className='text-md font-medium text-neutral-400'>Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className='text-neutral-400 cursor-pointer hover:text-white transition'
        />
      </div>
      <div className='flex flex-col gap-y-2 mt-4 px-3'>
        {songs.map((song) => (
          <div key={song.id} className='flex items-center gap-x-2'>
            <p className='text-md font-medium'>{song.title}</p>
          </div>
        ))}
      </div>
      {/* Radio Station Section */}
      <div className='flex items-center justify-between px-2 pt-4'>
        <div className='inline-flex items-center gap-x-2'>
          <LuRadioTower size={26} className='text-neutral-400' />
          <p className='text-md font-medium text-neutral-400'>Radio Stations</p>
        </div>
      </div>
    </div>
  );
};

export default Library;
