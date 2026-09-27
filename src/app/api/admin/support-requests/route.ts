import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'edge';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('support_requests')
    .select('*, orders(order_number)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ requests: data });
}