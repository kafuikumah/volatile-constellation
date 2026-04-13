interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number;  // time window in ms
  max: number;       // max requests per window
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60_000, max: 60 }
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + options.windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: options.max - 1, resetAt };
  }

  if (entry.count >= options.max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: options.max - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
