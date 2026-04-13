import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const VALID_SOURCES = ['who', 'worldbank', 'imf'] as const;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ source: string }> }
) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`sync:${ip}`, { windowMs: 300_000, max: 5 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Sync rate limit exceeded — wait 5 minutes between syncs' }, { status: 429 });
  }

  const { source } = await params;
  if (!(VALID_SOURCES as readonly string[]).includes(source)) {
    return NextResponse.json(
      { error: `Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}` },
      { status: 400 }
    );
  }

  // In production: enqueue background sync job
  return NextResponse.json({
    success: true,
    message: `Sync job for ${source} has been queued`,
    source,
    timestamp: new Date().toISOString(),
  });
}
