import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Country, IndicatorValue } from '@/types/country';
import { Indicator } from '@/types/indicator';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Score color helpers ──────────────────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-green-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
}

export function getScoreBg(score: number): string {
  if (score >= 70) return 'bg-green-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getScoreHex(score: number): string {
  if (score >= 70) return '#22C55E';
  if (score >= 60) return '#84CC16';
  if (score >= 50) return '#F97316';
  if (score >= 40) return '#EF4444';
  return '#991B1B';
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 40) return 'Weak';
  return 'Critical';
}

// ── Benchmark helpers ────────────────────────────────────────────────────────

/**
 * Determine whether a value meets its benchmark target.
 * Returns 'meets' | 'below' | 'above' | 'no_benchmark'
 */
export function getIndicatorStatus(
  value: number | null,
  indicator: Indicator
): 'meets' | 'below' | 'above' | 'no_data' | 'no_benchmark' {
  if (value === null || value === undefined) return 'no_data';
  if (!indicator.benchmarkValue || !indicator.benchmarkDirection) return 'no_benchmark';

  if (indicator.benchmarkDirection === 'above') {
    return value >= indicator.benchmarkValue ? 'meets' : 'below';
  } else {
    return value <= indicator.benchmarkValue ? 'meets' : 'above';
  }
}

/**
 * Get a color for an indicator value based on its benchmark.
 */
export function getBenchmarkColor(value: number | null, indicator: Indicator): string {
  const status = getIndicatorStatus(value, indicator);
  switch (status) {
    case 'meets': return '#22C55E';    // green
    case 'below': return '#EF4444';    // red
    case 'above': return '#EF4444';    // red (exceeding a 'below' benchmark means bad)
    case 'no_data': return '#CBD5E1';  // grey
    case 'no_benchmark': return '#64748B'; // slate
  }
}

/**
 * Get the latest value from a time-series of indicator values.
 */
export function getLatestValue(values: IndicatorValue[] | undefined): IndicatorValue | null {
  if (!values || values.length === 0) return null;
  return values.reduce((latest, v) => (v.year > latest.year ? v : latest), values[0]);
}

/**
 * Compute a trend from time-series values: 'up' | 'down' | 'stable' | null
 */
export function computeTrend(values: IndicatorValue[] | undefined): 'up' | 'down' | 'stable' | null {
  if (!values || values.length < 2) return null;
  const sorted = [...values].filter(v => v.value !== null).sort((a, b) => a.year - b.year);
  if (sorted.length < 2) return null;
  const recent = sorted[sorted.length - 1].value!;
  const prev = sorted[sorted.length - 2].value!;
  const diff = recent - prev;
  if (Math.abs(diff) < 0.5) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

// ── Formatting helpers ───────────────────────────────────────────────────────

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

export function formatRank(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatPopulation(millions: number): string {
  if (millions >= 1) return `${millions.toFixed(1)}M`;
  return `${(millions * 1000).toFixed(0)}K`;
}

export function getFlagUrl(code: string): string {
  return `https://flagcdn.com/w160/${code.toLowerCase()}.png`;
}

export function formatIndicatorValue(value: number | null, unit: string): string {
  if (value === null || value === undefined) return 'Not available';
  if (unit === '%') return formatPercent(value);
  if (unit === 'USD') return formatCurrency(value);
  if (unit === 'Yes/No') return value >= 1 ? 'Yes' : 'No';
  if (unit.includes('per 10,000') || unit.includes('per 100,000') || unit.includes('per 1,000')) {
    return formatNumber(value, 1);
  }
  if (unit === 'ratio') return value.toFixed(2);
  if (unit.startsWith('index')) return formatNumber(value, 1);
  return formatNumber(value, 1);
}

// ── General utilities ────────────────────────────────────────────────────────

export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  }) as T;
}

// ── Choropleth helpers ───────────────────────────────────────────────────────

/** 5-tier color palette from worst → best */
const CHOROPLETH_COLORS = ['#991B1B', '#EF4444', '#F97316', '#84CC16', '#22C55E'];

export interface LegendBand {
  color: string;
  min: number;
  max: number;
  label: string;
}

/**
 * Build 5 evenly-spaced legend bands from an array of real values.
 * Respects benchmarkDirection: 'above' → higher is better (green),
 * 'below' → lower is better (green).
 */
export function computeIndicatorBands(
  allValues: number[],
  benchmarkDirection?: 'above' | 'below',
  unit?: string
): LegendBand[] {
  if (allValues.length === 0) return [];

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  if (min === max) {
    return [{ color: CHOROPLETH_COLORS[4], min, max, label: formatBandLabel(min, unit) }];
  }

  const range = max - min;
  const bandSize = range / 5;

  // 'below' means lower is better → lowest band gets green
  const colors =
    benchmarkDirection === 'below'
      ? [...CHOROPLETH_COLORS].reverse()
      : CHOROPLETH_COLORS;

  const bands: LegendBand[] = [];
  for (let i = 0; i < 5; i++) {
    const bandMin = min + i * bandSize;
    const bandMax = i === 4 ? max : min + (i + 1) * bandSize;
    bands.push({
      color: colors[i],
      min: bandMin,
      max: bandMax,
      label: `${formatBandLabel(bandMin, unit)} – ${formatBandLabel(bandMax, unit)}`,
    });
  }

  return bands;
}

function formatBandLabel(value: number, unit?: string): string {
  if (unit === 'USD') return `$${Math.round(value).toLocaleString()}`;
  if (unit === '%') return `${value.toFixed(1)}%`;
  if (unit?.includes('per 10,000')) return value.toFixed(1);
  if (unit?.includes('per 100,000')) return Math.round(value).toLocaleString();
  if (unit?.includes('per 1,000')) return value.toFixed(1);
  if (unit === 'ratio') return value.toFixed(2);
  if (unit?.startsWith('index')) return value.toFixed(0);
  return value.toFixed(1);
}

/** Look up the colour a value falls in. */
export function getColorFromBands(value: number, bands: LegendBand[]): string {
  for (let i = 0; i < bands.length; i++) {
    if (i === bands.length - 1) {
      if (value >= bands[i].min && value <= bands[i].max) return bands[i].color;
    } else {
      if (value >= bands[i].min && value < bands[i].max) return bands[i].color;
    }
  }
  return bands[bands.length - 1]?.color ?? '#CBD5E1';
}
