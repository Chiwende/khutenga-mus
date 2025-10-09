import useLoadImage from '@/hooks/useLoadImage';
import { Song } from '@/lib/types/types';
import Image from 'next/image';

interface MediaItemProps {
  data: Song;
  onClick: (id: number) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const image_url = useLoadImage(data);
  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }

    // TODO:: Turn on default player
  };

  return (
    <div
      onClick={handleClick}
      className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md'
    >
      <div className='relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden'>
        <Image
          fill
          src={
            image_url ||
            'https://w7.pngwing.com/pngs/540/11/png-transparent-heart-like-love-twitter-ui-flat-icon.png'
          }
          alt={data.title}
          className='object-cover'
        />
      </div>
      <div className='flex flex-col gap-y-1 overflow-hidden'>
        <p className='text-white truncate'>{data.title}</p>
        <p className='text-neutral-400 truncate text-sm'>{data.author}</p>
      </div>
    </div>
  );
};

export default MediaItem;
