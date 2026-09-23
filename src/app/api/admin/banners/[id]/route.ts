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

    const allowedFields = ['image_url', 'title', 'subtitle', 'product_id', 'sort_order', 'is_active'];
    const updates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in body) updates[key] = body[key];
    }

    const { data, error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ banner: data });
  } catch (err) {
    return NextResponse.json({ error: 'Could not update banner.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: banner } = await supabase
    .from('banners')
    .select('image_url')
    .eq('id', params.id)
    .single();

  if (banner?.image_url && banner.image_url.includes('product-images')) {
    const path = banner.image_url.split('/product-images/')[1];
    if (path) {
      await supabase.storage.from('product-images').remove([path]);
    }
  }

  const { error } = await supabase.from('banners').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
