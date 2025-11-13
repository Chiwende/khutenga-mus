'use client';

import Modal from '../modal';
import useUploadModal from '@/hooks/useUploadModal';
import { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import Input from '../input';
import { Button } from '../button';
import { toast } from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import uniqid from 'uniqid';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      author: '',
      song: null,
      imageUrl: '',
      genre: '',
      album: '',
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];
      const uniqueId = uniqid();

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (songError) {
        toast.error(songError.message);
      }

      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from('images')
          .upload(`image-${values.title}-${uniqueId}`, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

      if (imageError) {
        toast.error(imageError.message);
      }

      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData?.path,
          song_path: songData?.path,
          genre: values.genre,
          album: values.album,
        });

      if (supabaseError) {
        setIsLoading(false);
        toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song created');
      reset();
      uploadModal.onClose();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title='Add a Song'
      description='Upload your music file'
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
        <Input
          id='title'
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder='Song title'
        />
        <Input
          id='author'
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder='Author'
        />
        <Input
          id='album'
          disabled={isLoading}
          {...register('album', { required: true })}
          placeholder='Album'
        />
        <Input
          id='genre'
          disabled={isLoading}
          {...register('genre', { required: true })}
          placeholder='Genre'
        />
        <div>
          <div className='pb-1'>Select a song file</div>
          <Input
            id='song'
            type='file'
            accept='.mp3'
            disabled={isLoading}
            {...register('song', { required: true })}
            placeholder='Song file'
          />
          {errors.song && (
            <p className='text-red-500'>{errors.song.message as string}</p>
          )}
        </div>
        <div>
          <div className='pb-1'>Select an image</div>
          <Input
            id='image'
            type='file'
            accept='image/*'
            disabled={isLoading}
            {...register('image', { required: true })}
            placeholder='Song file'
          />
          {errors.song && (
            <p className='text-red-500'>{errors.song.message as string}</p>
          )}
        </div>
        <Button disabled={isLoading} type='submit'>
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
