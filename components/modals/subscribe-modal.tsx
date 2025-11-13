'use client';

import { Price, ProductWithPrice } from '@/lib/types/types';
import Modal from '../modal';
import { Button } from '../button';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';
import { postData } from '@/lib/stripe/helpers';
import useSubscriptionModal from '@/hooks/useSubscribeModal';

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscriptionModal();
  let content = <div className='text-center'>No Content Available</div>;
  const { user, isLoading, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const formatPrice = (price: Price) => {
    const priceString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
    }).format((price?.unit_amount || 0) / 100);

    return priceString;
  };

  const onChange = (open: boolean) => {
    if (!open) subscribeModal.onClose();
  };

  const handleSubscribe = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Must be logged in to subscribe');
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast('Already subscribed');
    }

    try {
      const { url } = await postData({
        url: '/api/create-checkout-session',
        data: {
          price,
        },
      });

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      setPriceIdLoading(undefined);
      console.log(error);
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (products.length) {
    content = (
      <div className=''>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No Prices Available</div>;
          }

          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleSubscribe(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className='mb-4'
            >
              Subscribe {formatPrice(price)} for a {price.interval}
            </Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className='text-center'>Already Subscribed</div>;
  }

  return (
    <Modal
      title='Only for premium users'
      description='Listen to music with Khutenga Premium.'
      isOpen
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
