import { BenchmarkDimension } from '@/types/benchmark';
import type { Country } from '@/types/country';

export const BENCHMARK_DIMENSIONS: BenchmarkDimension[] = [
  {
    id: 'geographic_region',
    label: 'Geographic Region',
    type: 'static',
    values: ['Central Africa', 'Eastern Africa', 'Northern Africa', 'Southern Africa', 'Western Africa'],
    source: 'African Union',
    sourceUrl: 'https://au.int/en/member_states/countryprofiles2',
  },
  {
    id: 'rec',
    label: 'Regional Economic Community (REC)',
    type: 'static',
    values: ['UMA', 'COMESA', 'CEN-SAD', 'EAC', 'ECCAS', 'ECOWAS', 'IGAD', 'SADC'],
    source: 'African Union',
    sourceUrl: 'https://au.int/en/recs',
  },
  {
    id: 'income_level',
    label: 'World Bank Income Classification',
    type: 'api',
    values: ['LIC', 'LMIC', 'UMIC', 'HIC'],
    labels: ['Low Income', 'Lower-Middle Income', 'Upper-Middle Income', 'High Income'],
    source: 'World Bank',
    apiUrl: 'https://api.worldbank.org/v2/country/all?format=json',
    apiField: 'incomeLevel.id',
    updatedAnnually: true,
    latestRevision: 'July 2025 (FY2026)',
  },
  {
    id: 'governance_tier',
    label: 'Mo Ibrahim Index of African Governance (IIAG)',
    type: 'manual_upload',
    values: ['Q1', 'Q2', 'Q3', 'Q4'],
    labels: ['Top Quartile', 'Second Quartile', 'Third Quartile', 'Bottom Quartile'],
    source: 'Mo Ibrahim Foundation',
    sourceUrl: 'https://iiag.online/data-download/',
    latest: 2023,
    note: 'No public REST API. Data must be downloaded as CSV/Excel and uploaded via the admin panel. The IIAG overall governance score is used to group countries into tiers for benchmarking (e.g., quartiles).',
  },
];

export const INCOME_LEVEL_LABELS: Record<string, string> = {
  LIC: 'Low Income',
  LMIC: 'Lower-Middle Income',
  UMIC: 'Upper-Middle Income',
  HIC: 'High Income',
};

export function getBenchmarkDimension(id: string): BenchmarkDimension | undefined {
  return BENCHMARK_DIMENSIONS.find(d => d.id === id);
}

export function getPeerGroup(
  allCountries: Country[],
  focus: Country,
  dimension: string,
): Country[] {
  switch (dimension) {
    case 'geographic_region':
      return allCountries.filter(c => c.region === focus.region && c.id !== focus.id);
    case 'rec':
      return allCountries.filter(c => c.id !== focus.id && c.recs.some(r => focus.recs.includes(r)));
    case 'income_level':
      return allCountries.filter(c => c.incomeLevel === focus.incomeLevel && c.id !== focus.id);
    case 'governance_tier':
      return allCountries.filter(c => c.governanceTier === focus.governanceTier && c.id !== focus.id);
    default:
      return [];
  }
}
