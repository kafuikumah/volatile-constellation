import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { countries, getCountryById } from '@/data/countries';
import { getPeerGroup } from '@/data/benchmarkGroups';

const querySchema = z.object({
  country: z.string().regex(/^[a-z]{3}$/),
  dimension: z.enum(['geographic_region', 'rec', 'income_level', 'governance_tier']),
});

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(ip, { windowMs: 60_000, max: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  const { country: countryId, dimension } = parsed.data;
  const focus = getCountryById(countryId);
  if (!focus) {
    return NextResponse.json({ error: 'Country not found' }, { status: 404 });
  }

  const peers = getPeerGroup(countries, focus, dimension);
  const peerSummary = peers.map(({ indicators: _indicators, ...rest }) => rest);

  return NextResponse.json(
    { focus: { id: focus.id, name: focus.name, region: focus.region }, peers: peerSummary, dimension },
    { headers: { 'Cache-Control': 'public, s-maxage=300' } }
  );
}
