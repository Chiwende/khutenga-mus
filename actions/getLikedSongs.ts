import { Song } from '@/lib/types/types';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const getLikedSongs = async (): Promise<Song[]> => {
  try {
    const cookieStore = await cookies();

    // Create Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => {
            const cookie = cookieStore.get(name);
            return cookie?.value;
          },
          set: (name: string, value: string, options: any) => {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Ignore cookie setting errors in server components
            }
          },
          remove: (name: string, options: any) => {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Ignore cookie removal errors in server components
            }
          },
        },
      }
    );

    // Try to get the user session first
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log('Session check:', { session: !!session, error: sessionError });

    // If session fails, try getUser
    if (sessionError || !session) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log('User check:', { user: !!user, error: userError });

      if (userError || !user?.id) {
        console.log('No authenticated user found');
        return [];
      }

      console.log('Authenticated user found via getUser:', user.id);
      return await fetchLikedSongs(supabase, user.id);
    }

    console.log('Authenticated user found via session:', session.user.id);
    return await fetchLikedSongs(supabase, session.user.id);
  } catch (error) {
    console.error('Error in getLikedSongs:', error);
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
    console.error('Error fetching liked songs:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  // Filter out any items where songs is null and map to Song type
  return data
    .filter((item: any) => item.songs !== null)
    .map((item: any) => ({
      ...item.songs,
    })) as Song[];
};

export default getLikedSongs;
