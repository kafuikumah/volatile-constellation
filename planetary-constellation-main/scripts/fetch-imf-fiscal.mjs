#!/usr/bin/env node
/**
 * Fetches remaining fiscal indicators from IMF WEO DataMapper API.
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

// IMF WEO DataMapper codes
const IMF_INDICATORS = {
  'GGR_NGDP': 'tax_gdp',              // General govt revenue % GDP (proxy for tax/GDP)
  'GGXWDN_NGDP': 'debt_service_revenue', // Govt net debt % GDP (proxy)
  'GGSB_NPGDP': 'interest_payments_revenue', // Primary balance % GDP (related to interest)
  'BCA_NGDPD': 'debt_service_total',   // Current account balance % GDP
};

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
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

async function fetchIMFIndicator(imfCode, indicatorId) {
  console.log(`Fetching IMF: ${imfCode} → ${indicatorId}`);

  const url = `https://www.imf.org/external/datamapper/api/v1/${imfCode}`;
  const data = await fetchWithRetry(url);

  if (!data || !data.values || !data.values[imfCode]) {
    console.warn(`  ✗ No data for ${imfCode}`);
    return {};
  }

  const countryData = data.values[imfCode];
  const result = {};
  let count = 0;

  for (const [iso3, yearValues] of Object.entries(countryData)) {
    if (!AU_COUNTRIES.includes(iso3.toUpperCase())) continue;
    const countryId = iso3.toLowerCase();
    if (!result[countryId]) result[countryId] = [];

    for (const [yearStr, value] of Object.entries(yearValues)) {
      const year = parseInt(yearStr);
      const val = parseFloat(value);
      if (isNaN(year) || year < 2015 || year > 2025 || isNaN(val)) continue;
      result[countryId].push({
        value: Math.round(val * 100) / 100,
        year,
        source: 'IMF WEO',
      });
      count++;
    }
  }

  console.log(`  ✓ ${count} data points, ${Object.keys(result).length} countries`);
  return result;
}

async function main() {
  const dataPath = join(__dirname, '..', 'src', 'data', 'indicator-data.json');
  const allData = JSON.parse(readFileSync(dataPath, 'utf-8'));

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

  console.log('Fetching IMF WEO fiscal indicators...\n');

  for (const [imfCode, indId] of Object.entries(IMF_INDICATORS)) {
    const result = await fetchIMFIndicator(imfCode, indId);
    mergeData(indId, result);
    await new Promise(r => setTimeout(r, 1500));
  }

  // Summary
  console.log('\n=== Final Summary ===');
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
  for (const [indId, count] of Object.entries(indicatorCoverage).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${indId}: ${count}/55 countries`);
  }

  writeFileSync(dataPath, JSON.stringify(allData, null, 2));
  console.log(`\nWrote data to ${dataPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
