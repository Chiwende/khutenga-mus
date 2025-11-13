'use client';

import React, { useEffect, useState } from 'react';
import AuthModal from '@/components/modals/auth-modal';
import UploadModal from '@/components/modals/upload-modal';
import SubscribeModal from '@/components/modals/subscribe-modal';
import { ProductWithPrice } from '@/lib/types/types';

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      {/* <SubscribeModal products={products} /> */}
    </>
  );
};

export default ModalProvider;
