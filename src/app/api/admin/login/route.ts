import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionValue, COOKIE_NAME } from '@/lib/admin-auth';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const sessionValue = await createAdminSessionValue();
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, sessionValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
