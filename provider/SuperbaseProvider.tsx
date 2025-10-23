'use client';

import { Database } from '@/lib/db/supabase';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

interface SuperBaseProviderProps {
  children: React.ReactNode;
}

const SuperBaseProvider: React.FC<SuperBaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient as any}>
      {children}
    </SessionContextProvider>
  );
};

export default SuperBaseProvider;
