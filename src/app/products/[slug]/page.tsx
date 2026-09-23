import { createClient } from '@/lib/supabase-browser';
import { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const runtime = 'edge';
export const revalidate = 0;

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as Product;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
