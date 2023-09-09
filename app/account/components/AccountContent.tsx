'use client';

import Button from '@/components/Button';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { postData } from '@/libs/helpers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AccountContent = () => {
  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { user, subscription, isLoading } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);

    try {
      const { url, error } = await postData('/api/create-portal-link');
      window.location.assign(url);
    } catch (error) {
      toast.error((error as Error).message);
    }

    setLoading(false);
  };

  return (
    <div className="mb-7 px-6">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p>No subscription found.</p>
          <Button className="w-[300px]" onClick={() => subscribeModal.onOpen()}>
            Subscribe now!
          </Button>
        </div>
      )}

      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>
            You are currently subscribed to the{' '}
            <span className="font-extrabold">
              {subscription.prices?.products?.name}
            </span>{' '}
            plan.
          </p>
          <Button
            disabled={loading || isLoading}
            className="w-[300px]"
            onClick={() => redirectToCustomerPortal()}
          >
            Manage subscription
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
