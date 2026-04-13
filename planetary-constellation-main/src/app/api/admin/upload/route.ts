import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const uploadBodySchema = z.object({
  indicatorId: z.string().min(1).max(100),
  countryId: z.string().regex(/^[a-z]{3}$/),
  value: z.number().nullable(),
  year: z.number().int().min(2000).max(2030),
  source: z.string().min(1).max(500),
});

const batchUploadSchema = z.object({
  data: z.array(uploadBodySchema).min(1).max(1000),
});

export async function POST(request: NextRequest) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`admin:${ip}`, { windowMs: 60_000, max: 100 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Support both single and batch uploads
  const singleParsed = uploadBodySchema.safeParse(body);
  if (singleParsed.success) {
    // In production: await prisma.indicatorValue.upsert(...)
    return NextResponse.json({ success: true, message: 'Data point queued for write', data: singleParsed.data });
  }

  const batchParsed = batchUploadSchema.safeParse(body);
  if (batchParsed.success) {
    // In production: await prisma.indicatorValue.createMany(...)
    return NextResponse.json({
      success: true,
      message: `${batchParsed.data.data.length} data points queued for write`,
      count: batchParsed.data.data.length,
    });
  }

  return NextResponse.json({ error: 'Validation failed', details: singleParsed.error.flatten() }, { status: 422 });
}
