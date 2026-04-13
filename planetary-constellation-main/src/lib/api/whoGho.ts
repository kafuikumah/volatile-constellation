const GHO_BASE = 'https://ghoapi.azureedge.net/api';

export interface GhoDataPoint {
  countryCode: string;
  value: number | null;
  year: number;
  sex?: string;
}

export async function fetchGhoIndicator(indicatorCode: string): Promise<GhoDataPoint[]> {
  const url = `${GHO_BASE}/${indicatorCode}?$filter=SpatialDimType eq 'COUNTRY'&$select=SpatialDim,NumericValue,TimeDim,Dim1`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`WHO GHO API error: ${res.status}`);

  const { value } = await res.json() as { value: Array<{ SpatialDim: string; NumericValue: number | null; TimeDim: number; Dim1?: string }> };

  return (value ?? []).map(d => ({
    countryCode: (d.SpatialDim ?? '').toLowerCase(),
    value: d.NumericValue,
    year: d.TimeDim,
    sex: d.Dim1,
  }));
}
