export type BenchmarkDimensionType = 'geographic_region' | 'rec' | 'income_level' | 'governance_tier';

export interface BenchmarkDimension {
  id: BenchmarkDimensionType;
  label: string;
  type: 'static' | 'api' | 'manual_upload';
  values: string[];
  labels?: string[];
  source: string;
  sourceUrl?: string;
  apiUrl?: string;
  apiField?: string;
  updatedAnnually?: boolean;
  latestRevision?: string;
  latest?: number;
  note?: string;
}

export interface BenchmarkResult {
  focusCountry: {
    id: string;
    name: string;
    score: number;
    rank: number;
  };
  peerGroup: {
    dimension: BenchmarkDimensionType;
    groupName: string;
    averageScore: number;
    countries: {
      id: string;
      name: string;
      score: number;
      rank: number;
    }[];
  };
  categoryScores: {
    category: string;
    countryScore: number;
    peerAverage: number;
    delta: number;
  }[];
}
