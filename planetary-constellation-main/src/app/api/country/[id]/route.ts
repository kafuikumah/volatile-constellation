import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { getCountryById } from '@/data/countries';

const idSchema = z.string().regex(/^[a-z]{3}$/, 'Country ID must be a 3-letter ISO code');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const limit = rateLimit(ip, { windowMs: 60_000, max: 120 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { id } = await params;
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid country ID' }, { status: 400 });
  }

  const country = getCountryById(parsed.data);
  if (!country) {
    return NextResponse.json({ error: 'Country not found' }, { status: 404 });
  }

  return NextResponse.json(
    { data: country },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  );
}
