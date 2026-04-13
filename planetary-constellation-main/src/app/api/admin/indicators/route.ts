import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { ALL_INDICATORS } from '@/data/indicators';

const updateSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(500).optional(),
  benchmark: z.string().max(500).optional(),
  benchmarkValue: z.number().optional(),
  visible: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ data: ALL_INDICATORS });
}

export async function PUT(request: NextRequest) {
  const { authorized } = requireAdmin(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = rateLimit(`admin:${ip}`, { windowMs: 60_000, max: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 422 });
  }

  const { id, ...updates } = parsed.data;
  // In production: await prisma.indicator.update({ where: { id }, data: updates })
  return NextResponse.json({ success: true, id, updates });
}
