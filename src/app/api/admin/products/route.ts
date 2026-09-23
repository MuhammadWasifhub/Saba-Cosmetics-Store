import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'edge';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, price, compare_at_price, image_url, images, category, stock, is_active } =
      body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    let slug = slugify(name);

    // Ensure slug uniqueness
    const { data: existing } = await supabase.from('products').select('slug').eq('slug', slug);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description: description || '',
        price,
        compare_at_price: compare_at_price || null,
        image_url: image_url || null,
        images: images || [],
        category: category || 'General',
        stock: stock ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: 'Could not create product.' }, { status: 500 });
  }
}
