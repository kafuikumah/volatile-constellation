import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { ALL_INDICATORS, getIndicatorsByCategory } from '@/data/indicators';

const querySchema = z.object({
  category: z.enum(['finances', 'fiscal_space', 'finance_utilisation', 'government_action', 'health_impact'] as const).optional(),
  visible: z.enum(['true', 'false']).optional(),
});

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(ip, { windowMs: 60_000, max: 120 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  const { category, visible } = parsed.data;
  let result = ALL_INDICATORS;
  if (category) result = getIndicatorsByCategory(category);
  if (visible === 'true') result = result.filter(i => i.visible);
  if (visible === 'false') result = result.filter(i => !i.visible);

  return NextResponse.json(
    { data: result, total: result.length },
    { headers: { 'Cache-Control': 'public, s-maxage=3600' } }
  );
}
