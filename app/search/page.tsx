import getSongsByTitle from '@/actions/getSongsByTitle';
import Header from '@/components/header';
import ListItem from '@/components/list-item';
import SearchInput from '@/components/search-input';
import Head from 'next/head';
import SearchContent from './components/search-content';

interface SearchProps {
  searchParams: Promise<{
    title?: string;
  }>;
}

const Search = async ({ searchParams }: SearchProps) => {
  const { title } = await searchParams;
  const songs = await getSongsByTitle(title ?? '');

  return (
    <div className='bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto'>
      <Header>
        <div className='mb-2 flex flex-col gap-y-6'>
          <h1 className='text-white text-2xl font-semibold'>Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </div>
  );
};

export default Search;
