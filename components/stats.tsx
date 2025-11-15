import { StatsCardInterface } from '@/lib/types/interfaces';

interface StatProps {
  stats: StatsCardInterface[];
}

const StatComponent: React.FC<StatProps> = ({ stats }: StatProps) => {
  return (
    <div className='mx-auto w-full px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl lg:max-w-none'>
        <dl className='mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <div key={stat.id} className='flex flex-col bg-white/5 p-8'>
              <dt className='text-sm/6 font-semibold text-gray-300'>
                {stat.name}
              </dt>
              <dd className='order-first text-3xl font-semibold tracking-tight text-white'>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default StatComponent;
