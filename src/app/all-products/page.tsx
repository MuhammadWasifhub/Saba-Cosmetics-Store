import { createClient } from '@/lib/supabase-browser';
import { Product } from '@/lib/types';
import AllProductsClient from './AllProductsClient';

export const runtime = 'edge';
export const revalidate = 0;

async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data as Product[];
}

export default async function AllProductsPage() {
  const products = await getProducts();
  return <AllProductsClient products={products} />;
}