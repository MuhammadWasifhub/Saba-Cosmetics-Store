import { cookies } from 'next/headers';

const COOKIE_NAME = 'saba_admin_session';

// Simple HMAC-like signing using Web Crypto (works on Cloudflare edge runtime)
async function sign(value: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(value));
  const sigArray = Array.from(new Uint8Array(sigBuffer));
  return sigArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createAdminSessionValue(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const payload = `admin:${Date.now()}`;
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionValue(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET!;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;
    const expected = await sign(payload, secret);
    if (expected !== signature) return false;
    // Session valid for 7 days
    const timestamp = parseInt(payload.split(':')[1], 10);
    const age = Date.now() - timestamp;
    return age < 7 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function getAdminSessionCookieName() {
  return COOKIE_NAME;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSessionValue(token);
}

export { COOKIE_NAME };
