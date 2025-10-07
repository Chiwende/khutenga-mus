import { Song } from '@/lib/types/types';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import getSongs from './getSongs';

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
  }

  return (data as Song[]) || [];
};

export default getSongsByTitle;
