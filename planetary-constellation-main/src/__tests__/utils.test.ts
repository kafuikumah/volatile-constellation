import { describe, it, expect } from 'vitest';
import {
  getLatestValue,
  getScoreColor,
  formatPercent,
  formatCurrency,
  formatRank,
  average,
  getScoreLabel,
  formatIndicatorValue,
  computeTrend,
} from '@/lib/utils';
import type { IndicatorValue } from '@/types/country';

describe('getLatestValue', () => {
  it('returns null when values are undefined', () => {
    expect(getLatestValue(undefined)).toBeNull();
  });

  it('returns null when values array is empty', () => {
    expect(getLatestValue([])).toBeNull();
  });

  it('returns latest year entry', () => {
    const vals: IndicatorValue[] = [
      { value: 50, year: 2020, source: 'WHO' },
      { value: 75, year: 2022, source: 'WHO' },
      { value: 60, year: 2021, source: 'WHO' },
    ];
    const result = getLatestValue(vals);
    expect(result).toEqual({ value: 75, year: 2022, source: 'WHO' });
  });
});

describe('getScoreColor', () => {
  it('returns green for high scores', () => {
    expect(getScoreColor(70)).toBe('text-green-500');
    expect(getScoreColor(100)).toBe('text-green-500');
  });

  it('returns orange for mid scores', () => {
    expect(getScoreColor(50)).toBe('text-orange-500');
    expect(getScoreColor(69)).toBe('text-orange-500');
  });

  it('returns red for low scores', () => {
    expect(getScoreColor(49)).toBe('text-red-500');
    expect(getScoreColor(0)).toBe('text-red-500');
  });
});

describe('formatRank', () => {
  it('handles 1st, 2nd, 3rd', () => {
    expect(formatRank(1)).toBe('1st');
    expect(formatRank(2)).toBe('2nd');
    expect(formatRank(3)).toBe('3rd');
  });

  it('handles teens', () => {
    expect(formatRank(11)).toBe('11th');
    expect(formatRank(12)).toBe('12th');
    expect(formatRank(13)).toBe('13th');
  });

  it('handles 21st, 22nd, 23rd', () => {
    expect(formatRank(21)).toBe('21st');
    expect(formatRank(22)).toBe('22nd');
    expect(formatRank(23)).toBe('23rd');
  });
});

describe('average', () => {
  it('returns 0 for empty array', () => {
    expect(average([])).toBe(0);
  });

  it('computes correct average', () => {
    expect(average([10, 20, 30])).toBe(20);
    expect(average([100])).toBe(100);
  });
});

describe('formatIndicatorValue', () => {
  it('returns N/A for null values', () => {
    expect(formatIndicatorValue(null, '%')).toBe('Not available');
  });

  it('formats percentages', () => {
    expect(formatIndicatorValue(5.678, '%')).toBe('5.7%');
  });

  it('formats currency', () => {
    expect(formatIndicatorValue(1234, 'USD')).toBe('$1,234');
  });
});

describe('getScoreLabel', () => {
  it('returns correct labels', () => {
    expect(getScoreLabel(75)).toBe('Strong');
    expect(getScoreLabel(65)).toBe('Good');
    expect(getScoreLabel(55)).toBe('Moderate');
    expect(getScoreLabel(45)).toBe('Weak');
    expect(getScoreLabel(30)).toBe('Critical');
  });
});

describe('computeTrend', () => {
  it('returns null for insufficient data', () => {
    expect(computeTrend(undefined)).toBeNull();
    expect(computeTrend([])).toBeNull();
    expect(computeTrend([{ value: 10, year: 2022, source: 'WHO' }])).toBeNull();
  });

  it('detects upward trend', () => {
    const vals: IndicatorValue[] = [
      { value: 10, year: 2020, source: 'WHO' },
      { value: 15, year: 2021, source: 'WHO' },
    ];
    expect(computeTrend(vals)).toBe('up');
  });

  it('detects downward trend', () => {
    const vals: IndicatorValue[] = [
      { value: 15, year: 2020, source: 'WHO' },
      { value: 10, year: 2021, source: 'WHO' },
    ];
    expect(computeTrend(vals)).toBe('down');
  });

  it('detects stable', () => {
    const vals: IndicatorValue[] = [
      { value: 10, year: 2020, source: 'WHO' },
      { value: 10.3, year: 2021, source: 'WHO' },
    ];
    expect(computeTrend(vals)).toBe('stable');
  });
});
