import { Song } from '@/lib/types/types';
import { getServerSession } from '@/lib/auth/session';

const getSongs = async (): Promise<Song[]> => {
  const { supabase } = await getServerSession();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.log(error);
  }

  return (data as Song[]) || [];
};

export default getSongs;
