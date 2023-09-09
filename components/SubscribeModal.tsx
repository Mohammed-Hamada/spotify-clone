'use client';

import { useState } from 'react';

import { Price, ProductWithPrice } from '@/types';
import { useUser } from '@/hooks/useUser';

import Modal from './Modal';
import Button from './Button';
import toast from 'react-hot-toast';
import { postData } from '@/libs/helpers';
import { getStripe } from '@/libs/stripeClient';
import useSubscribeModal from '@/hooks/useSubscribeModal';

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price.unit_amount || 0) / 100);

  return priceString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, subscription, isLoading } = useUser();
  const [priceIDLoading, setPriceIDLoading] = useState<string>();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

  const handleCheckout = async (price: Price) => {
    setPriceIDLoading(price.id);

    if (!user) {
      setPriceIDLoading(undefined);
      return toast.error('You must be logged in to subscribe');
    }

    if (subscription) {
      setPriceIDLoading(undefined);
      return toast.error('You are already subscribed');
    }

    try {
      const { sessionId } = await postData('/api/create-checkout-session', {
        price,
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPriceIDLoading(undefined);
    }
  };
  let content = <div className="text-center">No products available</div>;

  if (products.length) {
    content = (
      <div className="text-center">
        {products.map((product) => {
          if (!product.prices?.length) {
            return (
              <div key={product.id}>No prices available for {product.name}</div>
            );
          }
          return product.prices.map((price) => {
            return (
              <Button
                onClick={() => handleCheckout(price)}
                key={price.id}
                disabled={isLoading || product.id === priceIDLoading}
                className="mb-4"
              >
                {`Subscribe for ${formatPrice(price)} / ${price.interval}`}
              </Button>
            );
          });
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className="text-center">You are already subscribed</div>;
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with spotify premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
