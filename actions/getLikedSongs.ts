import { Song } from '@/lib/types/types';
import { getServerSession } from '@/lib/auth/session';

const getLikedSongs = async (): Promise<Song[]> => {
  try {
    const { supabase, user, error } = await getServerSession();

    console.log('Session result:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: error,
    });

    if (error || !user?.id) {
      console.log('❌ No authenticated user found');
      console.error('Error in getLikedSongs:', error);
      return [];
    }

    return await fetchLikedSongs(supabase, user.id);
  } catch (error) {
    console.error('❌ Error in getLikedSongs:', error);
    return [];
  }
};

const fetchLikedSongs = async (
  supabase: any,
  userId: string
): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching liked songs:', error);
    return [];
  }

  if (!data) {
    console.log('⚠️ No data returned from database');
    return [];
  }

  console.log('📊 Raw liked songs data:', data);

  // Filter out any items where songs is null and map to Song type
  const filteredSongs = data
    .filter((item: any) => item.songs !== null)
    .map((item: any) => ({
      ...item.songs,
    })) as Song[];
  return filteredSongs;
};

export default getLikedSongs;
