'use client';
import { useRouter } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';
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
      className={twMerge('h-fit bg-linear-to-b from-red-500 p-6', className)}
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
          <div className='ml-auto flex gap-x-4 items-center'>
            <div>
              <button
                className='bg-white  text-black font-bold py-2 px-4 rounded cursor-pointer'
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
            <div>
              <button
                className='bg-white  text-black font-bold py-4 px-4 rounded-full cursor-pointer'
                onClick={() => router.push('/account')}
              >
                <FaUserAlt />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className='ml-auto flex items-center gap-x-4'>
              <button className='rounded-full bg-white p-2 flex items-center justify-center hover:opacity-75 transition'>
                <HiHome size={20} className='text-black' />
              </button>
              <button className='rounded-full bg-white p-2 flex items-center justify-center hover:opacity-75 transition'>
                <BiSearch size={20} className='text-black' />
              </button>

              {/* Sign Up + Login */}
              <button
                onClick={authModal.onOpen}
                className='bg-transparent text-neutral-500 font-bold py-2 px-4 rounded cursor-pointer'
              >
                Sign Up
              </button>
              <button
                onClick={authModal.onOpen}
                className='bg-white text-neutral-600 font-bold py-2 px-4 rounded cursor-pointer'
              >
                Login
              </button>
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default Header;
