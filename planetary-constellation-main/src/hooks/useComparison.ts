'use client';

import { useState, useMemo } from 'react';
import { getCountryById } from '@/data/countries';
import { Country } from '@/types/country';

export function useComparison() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleCountry = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addCountry = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeCountry = (id: string) => {
    setSelectedIds(prev => prev.filter(x => x !== id));
  };

  const clearAll = () => setSelectedIds([]);

  const selectedCountries = useMemo(
    () => selectedIds.map(id => getCountryById(id)).filter(Boolean) as Country[],
    [selectedIds]
  );

  return {
    selectedIds,
    setSelectedIds,
    toggleCountry,
    addCountry,
    removeCountry,
    clearAll,
    selectedCountries,
  };
}
