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

import { getCategories } from '@/lib/categories';

export default async function AllProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  return <AllProductsClient products={products} categories={categories} />;
}