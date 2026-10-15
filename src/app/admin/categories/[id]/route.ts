import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthenticated } from '@/lib/admin-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const { data, error } = await supabase
    .from('categories')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase.from('categories').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}