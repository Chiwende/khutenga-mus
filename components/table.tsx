import { Song } from '@/lib/types/types';
import TableHeader from './table/header';
import { sanitizeArtist } from '@/lib/helpers/santise-artist';

const songs = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  {
    name: 'Courtney Henry',
    title: 'Designer',
    email: 'courtney.henry@example.com',
    role: 'Admin',
  },
  {
    name: 'Tom Cook',
    title: 'Director of Product',
    email: 'tom.cook@example.com',
    role: 'Member',
  },
  {
    name: 'Whitney Francis',
    title: 'Copywriter',
    email: 'whitney.francis@example.com',
    role: 'Admin',
  },
  {
    name: 'Leonard Krasner',
    title: 'Senior Designer',
    email: 'leonard.krasner@example.com',
    role: 'Owner',
  },
  {
    name: 'Floyd Miles',
    title: 'Principal Designer',
    email: 'floyd.miles@example.com',
    role: 'Member',
  },
  {
    name: 'Emily Selman',
    title: 'VP, User Experience',
    email: 'emily.selman@example.com',
    role: 'Member',
  },
  {
    name: 'Kristin Watson',
    title: 'VP, Human Resources',
    email: 'kristin.watson@example.com',
    role: 'Admin',
  },
  {
    name: 'Emma Dorsey',
    title: 'Senior Developer',
    email: 'emma.dorsey@example.com',
    role: 'Member',
  },
  {
    name: 'Alicia Bell',
    title: 'Junior Copywriter',
    email: 'alicia.bell@example.com',
    role: 'Admin',
  },
  {
    name: 'Jenny Wilson',
    title: 'Studio Artist',
    email: 'jenny.wilson@example.com',
    role: 'Owner',
  },
  {
    name: 'Anna Roberts',
    title: 'Partner, Creative',
    email: 'anna.roberts@example.com',
    role: 'Member',
  },
  {
    name: 'Benjamin Russel',
    title: 'Director, Print Operations',
    email: 'benjamin.russel@example.com',
    role: 'Member',
  },
  {
    name: 'Jeffrey Webb',
    title: 'Senior Art Director',
    email: 'jeffrey.webb@example.com',
    role: 'Admin',
  },
  {
    name: 'Kathryn Murphy',
    title: 'Associate Creative Director',
    email: 'kathryn.murphy@example.com',
    role: 'Member',
  },
];

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface SongsTableProps {
  songs: Song[];
}

const SongsTable: React.FC<SongsTableProps> = ({ songs }) => {
  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle'>
            <table className='min-w-full border-separate border-spacing-0'>
              <TableHeader />
              <tbody>
                {songs.map((song, songIdx) => (
                  <tr key={songIdx}>
                    <td
                      className={classNames(
                        songIdx !== songs.length - 1
                          ? 'border-b border-white/10'
                          : '',
                        'capitalize py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-white sm:pl-6 lg:pl-8'
                      )}
                    >
                      {sanitizeArtist(song.author)}
                    </td>
                    <td
                      className={classNames(
                        songIdx !== songs.length - 1
                          ? 'border-b border-white/10'
                          : '',
                        'hidden px-3 py-4 text-sm whitespace-nowrap text-gray-400 sm:table-cell'
                      )}
                    >
                      {song.title}
                    </td>
                    <td
                      className={classNames(
                        songIdx !== songs.length - 1
                          ? 'border-b border-white/10'
                          : '',
                        'hidden px-3 py-4 text-sm whitespace-nowrap text-gray-400 lg:table-cell'
                      )}
                    >
                      {song.album}
                    </td>
                    <td
                      className={classNames(
                        songIdx !== songs.length - 1
                          ? 'border-b border-white/10'
                          : '',
                        'px-3 py-4 text-sm whitespace-nowrap text-gray-400'
                      )}
                    >
                      {song.status}
                    </td>
                    <td
                      className={classNames(
                        songIdx !== songs.length - 1
                          ? 'border-b border-white/10'
                          : '',
                        'py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-8 lg:pr-8'
                      )}
                    >
                      <a
                        href='#'
                        className='text-indigo-400 hover:text-indigo-300'
                      >
                        Edit<span className='sr-only'>, {song.id}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongsTable;
