import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { countries } from '@/data/countries';

const querySchema = z.object({
  region: z.string().optional(),
  rec: z.string().optional(),
  income: z.enum(['LIC', 'LMIC', 'UMIC', 'HIC']).optional(),
  q: z.string().max(100).optional(),
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

  const { region, rec, income, q } = parsed.data;
  let result = countries;

  if (region) result = result.filter(c => c.region === region);
  if (rec) result = result.filter(c => c.recs.includes(rec));
  if (income) result = result.filter(c => c.incomeLevel === income);
  if (q) {
    const qLower = q.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(qLower) || c.fullName.toLowerCase().includes(qLower));
  }

  // Strip heavy indicator data for list view
  const lightweight = result.map(({ indicators: _i, ...rest }) => rest);

  return NextResponse.json(
    { data: lightweight, total: lightweight.length },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
