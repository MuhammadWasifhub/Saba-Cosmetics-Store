import { createClient } from '@/lib/supabase-browser';

export type Category = {
  id: string;
  name: string;
  slug: string;
  tag: string;
  icon_url: string;
  sort_order: number;
  is_active: boolean;
};

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as Category[];
  } catch {
    return [];
  }
}

export const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Makeup', slug: 'Makeup', tag: 'Everyday glow', icon_url: '/icons/makeup.png', sort_order: 1, is_active: true },
  { id: '2', name: 'Skincare', slug: 'Skincare', tag: 'Glow rituals', icon_url: '/icons/skincare.png', sort_order: 2, is_active: true },
  { id: '3', name: 'Nail Paints', slug: 'Nail Paints', tag: 'Colour story', icon_url: '/icons/nail-paints.png', sort_order: 3, is_active: true },
  { id: '4', name: 'Hand Bags', slug: 'Hand Bags', tag: 'Carry it well', icon_url: '/icons/hand-bags.png', sort_order: 4, is_active: true },
  { id: '5', name: 'Fragrance', slug: 'Fragrance', tag: 'Signature scent', icon_url: '/icons/fragrance.png', sort_order: 5, is_active: true },
  { id: '6', name: 'New In', slug: 'New In', tag: 'Freshly picked', icon_url: '/icons/new-in.png', sort_order: 6, is_active: true },
];