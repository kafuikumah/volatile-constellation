'use client';

import { useState, useMemo } from 'react';
import { countries, getCountriesByRegion, getCountriesByRec, getCountriesByIncome } from '@/data/countries';
import { Country } from '@/types/country';
import { BenchmarkDimensionType } from '@/types/benchmark';
import { INDICATOR_CATEGORIES } from '@/lib/constants';
import { average, getLatestValue } from '@/lib/utils';
import { VISIBLE_INDICATORS } from '@/data/indicators';

export function useBenchmark() {
  const [focusCountryId, setFocusCountryId] = useState<string | null>(null);
  const [dimension, setDimension] = useState<BenchmarkDimensionType>('geographic_region');

  const focusCountry = useMemo(
    () => countries.find(c => c.id === focusCountryId) ?? null,
    [focusCountryId]
  );

  // Get peer group based on selected dimension
  const peerGroup = useMemo((): Country[] => {
    if (!focusCountry) return [];

    switch (dimension) {
      case 'geographic_region':
        return getCountriesByRegion(focusCountry.region);
      case 'rec':
        return focusCountry.recs.length > 0
          ? getCountriesByRec(focusCountry.recs[0])
          : [];
      case 'income_level':
        return getCountriesByIncome(focusCountry.incomeLevel);
      case 'governance_tier':
        return focusCountry.governanceTier
          ? countries.filter(c => c.governanceTier === focusCountry.governanceTier)
          : [];
      default:
        return [];
    }
  }, [focusCountry, dimension]);

  // Calculate category scores for a country (average of latest values, normalized 0-100)
  const getCategoryScore = (country: Country, categoryId: string): number | null => {
    const categoryIndicators = VISIBLE_INDICATORS.filter(i => i.category === categoryId);
    const values = categoryIndicators
      .map(ind => {
        const latest = getLatestValue(country.indicators[ind.id]);
        return latest?.value;
      })
      .filter((v): v is number => v !== null && v !== undefined);
    
    if (values.length === 0) return null;
    return average(values);
  };

  // Compute gap analysis
  const gapAnalysis = useMemo(() => {
    if (!focusCountry || peerGroup.length === 0) return [];

    return INDICATOR_CATEGORIES.map(cat => {
      const countryScore = getCategoryScore(focusCountry, cat.id);
      const peerScores = peerGroup
        .map(c => getCategoryScore(c, cat.id))
        .filter((s): s is number => s !== null);
      const peerAvg = peerScores.length > 0 ? average(peerScores) : null;

      return {
        category: cat.label,
        categoryId: cat.id,
        color: cat.color,
        countryScore,
        peerAverage: peerAvg,
        delta: countryScore !== null && peerAvg !== null ? countryScore - peerAvg : null,
      };
    });
  }, [focusCountry, peerGroup]);

  return {
    focusCountryId,
    setFocusCountryId,
    dimension,
    setDimension,
    focusCountry,
    peerGroup,
    gapAnalysis,
    getCategoryScore,
  };
}
