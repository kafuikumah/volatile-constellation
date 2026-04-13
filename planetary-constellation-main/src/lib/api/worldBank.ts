const WB_BASE = 'https://api.worldbank.org/v2';

export interface WorldBankDataPoint {
  countryCode: string;
  countryName: string;
  value: number | null;
  year: number;
}

export async function fetchWorldBankIndicator(
  indicatorCode: string,
  year?: number
): Promise<WorldBankDataPoint[]> {
  const url = `${WB_BASE}/country/all/indicator/${indicatorCode}?format=json&per_page=20000${year ? `&date=${year}` : '&mrv=1'}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);

  const [, data] = (await res.json()) as [unknown, Array<{ country: { id: string; value: string }; value: number | null; date: string }>];
  if (!data) return [];

  return data
    .filter(d => d.value !== null)
    .map(d => ({
      countryCode: d.country.id.toLowerCase(),
      countryName: d.country.value,
      value: d.value,
      year: parseInt(d.date, 10),
    }));
}

export async function fetchWorldBankCountryClassifications(): Promise<
  Array<{ id: string; incomeLevel: { id: string; value: string } }>
> {
  const url = `${WB_BASE}/country/all?format=json&per_page=300`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);
  const [, data] = await res.json();
  return data ?? [];
}
