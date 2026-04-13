'use client';

import { useState, useMemo } from 'react';
import { countries } from '@/data/countries';
import { Country } from '@/types/country';

export function useCountryFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [recFilter, setRecFilter] = useState('');
  const [incomeLevelFilter, setIncomeLevelFilter] = useState('');

  const filtered = useMemo(() => {
    let result: Country[] = countries;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q)
      );
    }

    if (regionFilter) {
      result = result.filter(c => c.region === regionFilter);
    }

    if (recFilter) {
      result = result.filter(c => c.recs.includes(recFilter));
    }

    if (incomeLevelFilter) {
      result = result.filter(c => c.incomeLevel === incomeLevelFilter);
    }

    return result;
  }, [searchQuery, regionFilter, recFilter, incomeLevelFilter]);

  return {
    searchQuery,
    setSearchQuery,
    regionFilter,
    setRegionFilter,
    recFilter,
    setRecFilter,
    incomeLevelFilter,
    setIncomeLevelFilter,
    filtered,
  };
}
