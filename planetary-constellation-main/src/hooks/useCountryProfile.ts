'use client';

import { useMemo, useState } from 'react';
import { getCountryById } from '@/data/countries';
import { Country } from '@/types/country';
import { getLatestValue } from '@/lib/utils';

export function useCountryProfile(id: string) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const country = useMemo(() => getCountryById(id) ?? null, [id]);

  // Check for fiscal alert: debt service ratio exceeding health budget percentage
  const hasFiscalAlert = useMemo(() => {
    if (!country) return false;
    const debtService = getLatestValue(country.indicators['debt_service_revenue']);
    const healthBudget = getLatestValue(country.indicators['gghe_gge']);
    if (debtService?.value && healthBudget?.value) {
      return debtService.value > healthBudget.value;
    }
    return false;
  }, [country]);

  return {
    country,
    hasFiscalAlert,
    openCategoryId,
    setOpenCategoryId,
  };
}
