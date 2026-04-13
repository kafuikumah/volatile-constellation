const IMF_BASE = 'https://www.imf.org/external/datamapper/api/v1';

export interface ImfDataPoint {
  countryCode: string;
  values: Record<string, number | null>;
}

export async function fetchImfIndicator(indicatorCode: string): Promise<ImfDataPoint[]> {
  const url = `${IMF_BASE}/${indicatorCode}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`IMF API error: ${res.status}`);

  const data = await res.json() as { values: Record<string, Record<string, Record<string, number | null>>> };
  const indicatorData = data.values?.[indicatorCode] ?? {};

  return Object.entries(indicatorData).map(([country, yearData]) => ({
    countryCode: country.toLowerCase(),
    values: yearData as Record<string, number | null>,
  }));
}
