#!/usr/bin/env node
/**
 * Expanded WHO GHO fetch — covers health expenditure indicators that
 * World Bank API is currently returning 502 for.
 * Also fetches UHC index and other indicators from GHO.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AU_COUNTRIES = [
  'BDI','CMR','CAF','TCD','COG','COD','GNQ','GAB','STP',
  'COM','DJI','ERI','ETH','KEN','MDG','MUS','RWA','SYC','SOM','SSD','SDN','TZA','UGA',
  'DZA','EGY','LBY','MRT','MAR','TUN',
  'AGO','BWA','SWZ','LSO','MWI','MOZ','NAM','ZAF','ZMB','ZWE',
  'BEN','BFA','CPV','CIV','GMB','GHA','GIN','GNB','LBR','MLI','NER','NGA','SEN','SLE','TGO',
];

// WHO GHO indicator codes mapped to our indicator IDs
// See: https://ghoapi.azureedge.net/api/Indicator for full list
const WHO_INDICATORS = {
  // Health expenditure (from WHO GHED via GHO)
  'GHED_GGHE-DPCUSD_SHA2011': 'gghe_per_capita',           // GGHE-D per capita USD
  'GHED_GGHE-DPERGDP_SHA2011': 'gghe_gdp',                 // GGHE-D as % GDP
  'GHED_GGHE-DPERGGHE_SHA2011': 'gghe_gge',                // GGHE-D as % GGE
  'GHED_GGHE-DPERCHE_SHA2011': 'gghe_the',                 // GGHE-D as % CHE
  'GHED_EXTPERCHE_SHA2011': 'external_resources_che',       // External as % CHE
  'GHED_OOPSPERCHE_SHA2011': 'oop_che',                     // OOP as % CHE

  // UHC and financial protection
  'UHC_INDEX_REPORTED': 'uhc_service_coverage',
  'FINPROTECTION_CATA_TOT_10_POP': 'uhc_financial_hardship_10',
  'FINPROTECTION_CATA_TOT_25_POP': 'uhc_financial_hardship_25',

  // Service delivery
  'HWF_0001': 'health_workers_density',
  'MDG_0000000025': 'skilled_birth_attendance',
  'HOSPITAL_BED_DENSITY': 'hospital_beds_density',          // Hospital beds per 10k
  'HWF_0006': 'physicians_density',                         // Medical doctors per 10k

  // Health impact
  'MDG_0000000026': 'maternal_mortality',
  'MDG_0000000007': 'under5_mortality',
  'RMNCH_INDEX': 'rmnch_coverage',                         // RMNCH coverage index
};

async function fetchWithRetry(url, retries = 3, timeoutMs = 45000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (!res.ok) {
        console.warn(`    HTTP ${res.status} (attempt ${i + 1})`);
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      return await res.json();
    } catch (e) {
      console.warn(`    Error (attempt ${i + 1}): ${e.message}`);
      if (i < retries - 1) await new Promise(r => setTimeout(r, 3000));
    }
  }
  return null;
}

async function fetchGHOIndicator(ghoCode) {
  const indicatorId = WHO_INDICATORS[ghoCode];
  console.log(`Fetching: ${ghoCode} → ${indicatorId}`);

  // Use filter and select for efficiency
  const url = `https://ghoapi.azureedge.net/api/${ghoCode}?$filter=SpatialDimType eq 'COUNTRY'`;
  const data = await fetchWithRetry(url);

  if (!data || !data.value || data.value.length === 0) {
    console.warn(`  ✗ No data for ${ghoCode}`);
    return {};
  }

  const result = {};
  let count = 0;

  for (const entry of data.value) {
    const val = entry.NumericValue;
    if (val === null || val === undefined) continue;
    const iso3 = entry.SpatialDim?.toUpperCase();
    if (!iso3 || !AU_COUNTRIES.includes(iso3)) continue;
    const year = parseInt(entry.TimeDim);
    if (isNaN(year) || year < 2010) continue;

    const countryId = iso3.toLowerCase();
    if (!result[countryId]) result[countryId] = [];
    result[countryId].push({
      value: Math.round(val * 100) / 100,
      year,
      source: 'WHO GHO',
    });
    count++;
  }

  const countries = Object.keys(result).length;
  console.log(`  ✓ ${count} data points, ${countries} countries`);
  return result;
}

async function main() {
  const dataPath = join(__dirname, '..', 'src', 'data', 'indicator-data.json');
  let allData;
  try {
    allData = JSON.parse(readFileSync(dataPath, 'utf-8'));
  } catch {
    allData = {};
    AU_COUNTRIES.forEach(c => { allData[c.toLowerCase()] = {}; });
  }

  function mergeData(indicatorId, fetchedData) {
    for (const [countryId, values] of Object.entries(fetchedData)) {
      if (!allData[countryId]) allData[countryId] = {};
      const existing = allData[countryId][indicatorId] || [];
      const existingYears = new Set(existing.map(v => v.year));
      const merged = [...existing];
      for (const v of values) {
        if (!existingYears.has(v.year)) {
          merged.push(v);
          existingYears.add(v.year);
        }
      }
      allData[countryId][indicatorId] = merged.sort((a, b) => a.year - b.year);
    }
  }

  console.log('Fetching expanded WHO GHO data...\n');

  const codes = Object.keys(WHO_INDICATORS);
  for (const code of codes) {
    const result = await fetchGHOIndicator(code);
    mergeData(WHO_INDICATORS[code], result);
    await new Promise(r => setTimeout(r, 1500));
  }

  // Summary
  console.log('\n=== Updated Summary ===');
  let totalValues = 0;
  const indicatorCoverage = {};
  for (const indicators of Object.values(allData)) {
    for (const [indId, values] of Object.entries(indicators)) {
      totalValues += values.length;
      if (!indicatorCoverage[indId]) indicatorCoverage[indId] = 0;
      indicatorCoverage[indId]++;
    }
  }
  console.log(`Total data points: ${totalValues}`);
  console.log(`Indicators with data: ${Object.keys(indicatorCoverage).length}`);
  console.log(`Coverage:`);
  for (const [indId, count] of Object.entries(indicatorCoverage).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${indId}: ${count}/55 countries`);
  }

  writeFileSync(dataPath, JSON.stringify(allData, null, 2));
  console.log(`\nWrote data to ${dataPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
