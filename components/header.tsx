'use client';
import { useRouter } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';
import { Button } from './button';
import useAuthModal from '@/hooks/useAuthModal';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    // Reset any playing songs
    router.refresh();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('You have been logged out');
    }
  };
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  return (
    <div
      className={twMerge('h-fit bg-gradient-to-b from-red-500 p-6', className)}
    >
      <div className='w-full mb-4 flex items-center justify-between'>
        <div className='hidden md:flex gap-x-2 items-center'>
          <button
            onClick={() => router.back()}
            className='rounded-full bg-black flex items-center justify-center hover:opacity-75 transition'
          >
            <RxCaretLeft size={35} className='text-white' />
          </button>
          <button
            onClick={() => router.forward()}
            className='rounded-full bg-black flex items-center justify-center hover:opacity-75 transition'
          >
            <RxCaretRight size={35} className='text-white' />
          </button>
        </div>
        {user ? (
          <div className='flex gap-x-4 items-center max-w-lg'>
            <Button
              className='bg-white px-6 py-2 flex-1'
              onClick={handleLogout}
            >
              Log Out
            </Button>
            <Button
              onClick={() => router.push('/account')}
              className='flex-1 bg-white'
            >
              <FaUserAlt />
            </Button>
          </div>
        ) : (
          <>
            <div className='flex md:hidden gap-x-2 items-center w-full'>
              <button className='rounded-full bg-white p-2 flex items-center justify-center hover:opacity-75 transition'>
                <HiHome size={20} className='text-black' />
              </button>
              <button className='rounded-full bg-white p-2 flex items-center justify-center hover:opacity-75 transition'>
                <BiSearch size={20} className='text-black' />
              </button>
            </div>
            <div className='flex items-center gap-x-4 w-full'>
              <Button
                onClick={authModal.onOpen}
                className='bg-transparent text-neutral-500 font-medium px-6 py-3 flex-1'
              >
                Sign Up
              </Button>
              <Button
                onClick={authModal.onOpen}
                className='bg-white text-neutral-500 font-medium px-6 py-3 flex-1'
              >
                Login
              </Button>
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default Header;
