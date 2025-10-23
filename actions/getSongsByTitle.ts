import { Song } from '@/lib/types/types';
import { getServerSession } from '@/lib/auth/session';
import getSongs from './getSongs';

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const { supabase } = await getServerSession();

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
