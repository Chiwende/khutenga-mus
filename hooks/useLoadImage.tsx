import { useState, useEffect } from 'react';
import { Song } from '@/lib/types/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const useLoadImage = (song: Song) => {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (!song) {
      setImagePath(null);
      return;
    }

    const loadImage = async () => {
      const { data: imageData } = await supabaseClient.storage
        .from('images')
        .getPublicUrl(song.image_path);

      setImagePath(imageData.publicUrl);
    };

    loadImage();
  }, [song, supabaseClient]);

  return imagePath;
};

export default useLoadImage;
