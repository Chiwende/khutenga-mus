'use client';

import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: '#0F172A',
          color: '#fff',
          borderRadius: '10px',
          padding: '10px',
          fontSize: '16px',
        },
      }}
    />
  );
};

export default ToasterProvider;
