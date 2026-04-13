export interface IndicatorValue {
  value: number | null;   // null when data is unavailable for that country/year
  year: number;
  source: string;
}

export interface Country {
  id: string;             // 3-letter ISO code lowercase (e.g., 'nga')
  name: string;           // Official AU name
  fullName: string;       // e.g., 'Federal Republic of Nigeria'
  code: string;           // 2-letter ISO code lowercase for flags (e.g., 'ng')
  auJoined: string;       // Date/year of joining OAU or AU

  // Classification
  region: string;         // 'Central Africa' | 'Eastern Africa' | 'Northern Africa' | 'Southern Africa' | 'Western Africa'
  recs: string[];         // All REC memberships (many countries belong to multiple)
  incomeLevel: string;    // World Bank classification: LIC | LMIC | UMIC | HIC
  governanceTier?: string; // Mo Ibrahim governance tier label

  // Demographics
  population: number;     // In millions

  // Indicator data — keyed by indicator ID
  indicators: Record<string, IndicatorValue[]>; // Array allows time-series per indicator

  // Computed / display fields
  afriHealthRank?: number;
  overallScore?: number;  // Computed from available indicators
}
