import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'edge';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const allowedFields = [
      'name',
      'description',
      'price',
      'compare_at_price',
      'image_url',
      'images',
      'category',
      'stock',
      'is_active',
    ];
    const updates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in body) updates[key] = body[key];
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: 'Could not update product.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Also remove the product's images from storage if hosted on Supabase Storage
  const { data: product } = await supabase
    .from('products')
    .select('image_url, images')
    .eq('id', params.id)
    .single();

  const allImages = [
    ...(product?.images || []),
    ...(product?.image_url ? [product.image_url] : []),
  ];
  const pathsToRemove = allImages
    .filter((url: string) => url.includes('product-images'))
    .map((url: string) => url.split('/product-images/')[1])
    .filter(Boolean);

  if (pathsToRemove.length > 0) {
    await supabase.storage.from('product-images').remove(pathsToRemove);
  }

  const { error } = await supabase.from('products').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
