import { ProductWithPrice } from '@/lib/types/types';
import { getServerSession } from '@/lib/auth/session';

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const { supabase } = await getServerSession();

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error);
  }

  return (data as ProductWithPrice[]) || [];
};

export default getActiveProductsWithPrices;
