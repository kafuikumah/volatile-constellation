import { describe, it, expect } from 'vitest';
import {
  countries,
  getCountryById,
  getCountriesByRegion,
  searchCountries,
  getAllCountriesAlphabetical,
} from '@/data/countries';
import {
  ALL_INDICATORS,
  VISIBLE_INDICATORS,
  getIndicatorById,
  getIndicatorsByCategory,
} from '@/data/indicators';
import { INDICATOR_CATEGORIES, GEOGRAPHIC_REGIONS } from '@/lib/constants';

describe('countries data', () => {
  it('has 55 AU member states', () => {
    expect(countries.length).toBe(55);
  });

  it('each country has a unique 3-letter id', () => {
    const ids = countries.map(c => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(55);
    ids.forEach(id => expect(id).toMatch(/^[a-z]{3}$/));
  });

  it('each country has a 2-letter code', () => {
    countries.forEach(c => {
      expect(c.code).toMatch(/^[a-zA-Z]{2}$/);
    });
  });

  it('all countries belong to a valid region', () => {
    const regions = GEOGRAPHIC_REGIONS as unknown as string[];
    countries.forEach(c => {
      expect(regions).toContain(c.region);
    });
  });

  it('all countries have a valid income level', () => {
    const validLevels = ['LIC', 'LMIC', 'UMIC', 'HIC'];
    countries.forEach(c => {
      expect(validLevels).toContain(c.incomeLevel);
    });
  });

  it('getCountryById returns correct country', () => {
    const ng = getCountryById('nga');
    expect(ng).toBeDefined();
    expect(ng?.name).toBe('Nigeria');
  });

  it('getCountryById returns undefined for invalid id', () => {
    expect(getCountryById('zzz')).toBeUndefined();
  });

  it('getCountriesByRegion returns non-empty for each region', () => {
    GEOGRAPHIC_REGIONS.forEach(region => {
      const result = getCountriesByRegion(region);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it('searchCountries finds by name', () => {
    const results = searchCountries('nigeria');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('nga');
  });

  it('getAllCountriesAlphabetical returns sorted list', () => {
    const sorted = getAllCountriesAlphabetical();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].name.localeCompare(sorted[i - 1].name)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('indicators data', () => {
  it('has 34 indicators', () => {
    expect(ALL_INDICATORS.length).toBe(34);
  });

  it('each indicator has required fields', () => {
    ALL_INDICATORS.forEach(ind => {
      expect(ind.id).toBeTruthy();
      expect(ind.label).toBeTruthy();
      expect(ind.category).toBeTruthy();
      expect(ind.source).toBeTruthy();
      expect(ind.unit).toBeTruthy();
      expect(typeof ind.visible).toBe('boolean');
    });
  });

  it('categories match INDICATOR_CATEGORIES', () => {
    const validCategories = INDICATOR_CATEGORIES.map(c => c.id);
    ALL_INDICATORS.forEach(ind => {
      expect(validCategories).toContain(ind.category);
    });
  });

  it('getIndicatorById returns correct indicator', () => {
    const ind = getIndicatorById('gghe_per_capita');
    expect(ind).toBeDefined();
    expect(ind?.category).toBe('finances');
  });

  it('getIndicatorsByCategory returns non-empty for each category', () => {
    INDICATOR_CATEGORIES.forEach(cat => {
      const result = getIndicatorsByCategory(cat.id);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  it('VISIBLE_INDICATORS excludes hidden indicators', () => {
    expect(VISIBLE_INDICATORS.length).toBe(33);
    VISIBLE_INDICATORS.forEach(ind => expect(ind.visible).toBe(true));
  });

  it('has exactly 1 hidden indicator (outpatient_visits)', () => {
    const hidden = ALL_INDICATORS.filter(i => !i.visible);
    expect(hidden.length).toBe(1);
    expect(hidden[0].id).toBe('outpatient_visits');
  });
});

describe('indicator distribution across categories', () => {
  it('finances has 10 indicators', () => {
    expect(getIndicatorsByCategory('finances').length).toBe(10);
  });

  it('fiscal_space has 6 indicators', () => {
    expect(getIndicatorsByCategory('fiscal_space').length).toBe(6);
  });

  it('finance_utilisation has 11 indicators', () => {
    expect(getIndicatorsByCategory('finance_utilisation').length).toBe(11);
  });

  it('government_action has 4 indicators', () => {
    expect(getIndicatorsByCategory('government_action').length).toBe(4);
  });

  it('health_impact has 3 indicators', () => {
    expect(getIndicatorsByCategory('health_impact').length).toBe(3);
  });
});
