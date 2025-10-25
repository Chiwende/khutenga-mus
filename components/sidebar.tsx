'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Box from './box';
import SidebarItem from './sidebar-item';
import Library from './library';
import { Song } from '@/lib/types/types';
import usePlayer from '@/hooks/usePlayerHook';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const pathname = usePathname();
  const player = usePlayer();
  const routes = useMemo(
    () => [
      {
        label: 'Home',
        active: pathname !== '/search',
        href: '/',
        icon: HiHome,
      },
      {
        label: 'Search',
        active: pathname === '/search',
        href: '/search',
        icon: BiSearch,
      },
    ],
    [pathname]
  );

  return (
    <div
      className={twMerge(
        'h-full flex',
        player.activeId ? 'h-[calc(100%-80px)]' : 'h-full'
      )}
    >
      <div className='hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2'>
        <Box>
          <div className='flex flex-col gap-y-4 px-5 py-4'>
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className='overflow-y-auto flex-1'>
          <Library songs={songs} />
        </Box>
      </div>
      <main className='flex-1 h-full overflow-y-auto py-2'>{children}</main>
    </div>
  );
};

export default Sidebar;
