import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_id, order_number, type, reason, description, image_url } = body;

    if (!customer_id || !reason || !type) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    let order_id = null;
    if (order_number) {
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', order_number)
        .maybeSingle();
      order_id = order?.id || null;
    }

    const { error } = await supabase.from('support_requests').insert({
      customer_id,
      order_id,
      type,
      reason,
      description: description || null,
      image_url: image_url || null,
      status: 'open',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}