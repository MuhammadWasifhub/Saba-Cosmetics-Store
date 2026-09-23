import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/admin-auth';

export const runtime = 'edge';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}
