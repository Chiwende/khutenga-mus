const TableHeader = () => {
  return (
    <>
      <thead>
        <tr>
          <th
            scope='col'
            className='sticky top-0 z-10 border-b border-white/15 bg-gray-900/75 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-white backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8'
          >
            Artist
          </th>
          <th
            scope='col'
            className='sticky top-0 z-10 hidden border-b border-white/15 bg-gray-900/75 px-3 py-3.5 text-left text-sm font-semibold text-white backdrop-blur-sm backdrop-filter sm:table-cell'
          >
            Title
          </th>
          <th
            scope='col'
            className='sticky top-0 z-10 hidden border-b border-white/15 bg-gray-900/75 px-3 py-3.5 text-left text-sm font-semibold text-white backdrop-blur-sm backdrop-filter lg:table-cell'
          >
            Album
          </th>
          <th
            scope='col'
            className='sticky top-0 z-10 border-b border-white/15 bg-gray-900/75 px-3 py-3.5 text-left text-sm font-semibold text-white backdrop-blur-sm backdrop-filter'
          >
            Status
          </th>
          <th
            scope='col'
            className='sticky top-0 z-10 border-b border-white/15 bg-gray-900/75 py-3.5 pr-4 pl-3 backdrop-blur-sm backdrop-filter sm:pr-6 lg:pr-8'
          >
            <span className='sr-only'>Edit</span>
          </th>
        </tr>
      </thead>
    </>
  );
};

export default TableHeader;
