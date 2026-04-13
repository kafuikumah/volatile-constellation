export type IndicatorCategory =
  | 'finances'
  | 'fiscal_space'
  | 'finance_utilisation'
  | 'government_action'
  | 'health_impact';

export type BenchmarkDirection = 'above' | 'below';

export interface ApiSource {
  url?: string;
  code?: string;
  latest?: number;
  note?: string;
}

export interface Indicator {
  id: string;
  label: string;
  category: IndicatorCategory;
  benchmark: string | null;
  benchmarkValue?: number;
  benchmarkDirection?: BenchmarkDirection;
  source: string;
  apiPrimary: ApiSource;
  apiCrossCheck?: ApiSource;
  framework: string[];
  unit: string;
  visible: boolean;
}

export interface IndicatorCategoryDef {
  id: IndicatorCategory;
  label: string;
  color: string;
  description: string;
}
