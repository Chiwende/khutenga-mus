'use client';

import { useEffect } from 'react';
import Modal from '@/components/modal';
import useAuthModal from '@/hooks/useAuthModal';
import {
  useSupabaseClient,
  useSessionContext,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, onClose, router]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title='Welcome Back'
      description='Login to your account'
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        theme='dark'
        providers={[]}
        supabaseClient={supabaseClient}
        view='sign_in'
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#333333',
                brandAccent: '#333333',
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
