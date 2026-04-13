import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

export function getAdminToken(request: NextRequest): string | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export function isValidAdminToken(token: string): boolean {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) return false;

  // Use timing-safe comparison to prevent timing attacks
  try {
    const tokenBuf = Buffer.from(token, 'utf-8');
    const secretBuf = Buffer.from(secret, 'utf-8');
    if (tokenBuf.length !== secretBuf.length) return false;
    return timingSafeEqual(tokenBuf, secretBuf);
  } catch {
    return false;
  }
}

export function requireAdmin(request: NextRequest): { authorized: boolean } {
  const token = getAdminToken(request);
  if (!token) return { authorized: false };
  return { authorized: isValidAdminToken(token) };
}
