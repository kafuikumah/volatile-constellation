import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { countries } from '@/data/countries';
import { ALL_INDICATORS, VISIBLE_INDICATORS } from '@/data/indicators';

// Sanitize CSV cells to prevent formula injection (DDE attacks)
function csvSafe(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `"'${value.replace(/"/g, '""')}"`;
  }
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const querySchema = z.object({
  countries: z.string().optional(),
  indicators: z.string().optional(),
  format: z.enum(['csv', 'json']).default('csv'),
  yearFrom: z.coerce.number().int().min(2000).max(2030).optional(),
  yearTo: z.coerce.number().int().min(2000).max(2030).optional(),
});

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(ip, { windowMs: 60_000, max: 10 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  const { countries: countriesParam, indicators: indicatorsParam, format, yearFrom, yearTo } = parsed.data;

  const selectedCountries = countriesParam
    ? countries.filter(c => countriesParam.split(',').map(s => s.trim()).includes(c.id))
    : countries;

  const selectedIndicators = indicatorsParam
    ? ALL_INDICATORS.filter(i => indicatorsParam.split(',').map(s => s.trim()).includes(i.id) && i.visible)
    : VISIBLE_INDICATORS;

  if (format === 'json') {
    const data = selectedCountries.map(c => ({
      id: c.id,
      name: c.name,
      region: c.region,
      incomeLevel: c.incomeLevel,
      indicators: Object.fromEntries(
        selectedIndicators.map(ind => [
          ind.id,
          (c.indicators[ind.id] ?? []).filter(v =>
            (!yearFrom || v.year >= yearFrom) && (!yearTo || v.year <= yearTo)
          ),
        ])
      ),
    }));
    return NextResponse.json({
      data,
      metadata: { indicators: selectedIndicators.map(i => ({ id: i.id, label: i.label, unit: i.unit })) },
    });
  }

  // CSV format
  const rows: string[] = [];
  const header = [
    'country_id', 'country_name', 'region', 'income_level',
    ...selectedIndicators.map(i => `${i.id}_value`),
    ...selectedIndicators.map(i => `${i.id}_year`),
  ];
  rows.push(header.join(','));

  for (const c of selectedCountries) {
    const values = selectedIndicators.map(ind => {
      const vals = (c.indicators[ind.id] ?? []).filter(v =>
        (!yearFrom || v.year >= yearFrom) && (!yearTo || v.year <= yearTo)
      );
      const latest = vals.sort((a, b) => b.year - a.year)[0];
      return latest?.value ?? '';
    });
    const years = selectedIndicators.map(ind => {
      const vals = (c.indicators[ind.id] ?? []).filter(v =>
        (!yearFrom || v.year >= yearFrom) && (!yearTo || v.year <= yearTo)
      );
      const latest = vals.sort((a, b) => b.year - a.year)[0];
      return latest?.year ?? '';
    });
    rows.push([c.id, csvSafe(c.name), csvSafe(c.region), c.incomeLevel, ...values, ...years].join(','));
  }

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="africa-health-financing-data.csv"',
      'Cache-Control': 'no-cache',
    },
  });
}
