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

    const updates: Record<string, any> = {};
    if (body.order_status) updates.order_status = body.order_status;
    if (body.payment_status) updates.payment_status = body.payment_status;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json({ error: 'Could not update order.' }, { status: 500 });
  }
}
