'use client';
import Box from '@/components/box';
import { ScaleLoader } from 'react-spinners';

const Loading = () => {
  return (
    <>
      <Box className='h-full flex items-center justify-center'>
        <ScaleLoader color='#22c55e' barCount={5} />
      </Box>
    </>
    // <div className='flex items-center justify-center h-screen'>
    //   {/* <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-neutral-400'></div> */}
    // </div>
  );
};

export default Loading;
