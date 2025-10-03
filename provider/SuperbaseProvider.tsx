'use client';

import { Database } from '@/lib/db/supabase';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

interface SuperBaseProviderProps {
  children: React.ReactNode;
}

const SuperBaseProvider: React.FC<SuperBaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() =>
    createClientComponentClient<Database>()
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient as any}>
      {children}
    </SessionContextProvider>
  );
};

export default SuperBaseProvider;
