#!/usr/bin/env node
/**
 * Fetches remaining indicators from WHO GHED (via GHO) and other sources.
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

// Correct WHO GHO indicator codes
const INDICATORS = {
  // GHED indicators (health expenditure)
  'GHED_GGHE-D_pc_US_SHA2011': 'gghe_per_capita',
  'GHED_GGHE-DGDP_SHA2011': 'gghe_gdp',
  'GHED_GGHE-DGGE_SHA2011': 'gghe_gge',
  'GHED_GGHE-DCHE_SHA2011': 'gghe_the',
  'GHED_EXTCHE_SHA2011': 'external_resources_che',
  'GHED_OOPSCHE_SHA2011': 'oop_che',

  // Service delivery
  'WHS6_102': 'hospital_beds_density',
  'UHC_SCI_RMNCH': 'rmnch_coverage',

  // PHC spending
  'GHED_PHC_GGHE-D_PHC_SHA2011': 'phc_spending',
};

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45000) });
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
  const indicatorId = INDICATORS[ghoCode];
  console.log(`Fetching: ${ghoCode} → ${indicatorId}`);

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
      source: 'WHO GHED',
    });
    count++;
  }

  const countries = Object.keys(result).length;
  console.log(`  ✓ ${count} data points, ${countries} countries`);
  return result;
}

// Also try World Bank one more time for fiscal indicators
async function fetchWBIndicator(wbCode, indicatorId) {
  console.log(`Fetching WB: ${wbCode} → ${indicatorId}`);
  const countryList = AU_COUNTRIES.join(';');
  const url = `https://api.worldbank.org/v2/country/${countryList}/indicator/${wbCode}?format=json&per_page=2000&date=2015:2024`;
  const data = await fetchWithRetry(url);

  if (!data || !Array.isArray(data) || data.length < 2 || !data[1]) {
    console.warn(`  ✗ No data for WB ${wbCode}`);
    return {};
  }

  const result = {};
  let count = 0;
  for (const entry of data[1]) {
    if (entry.value === null || entry.value === undefined) continue;
    const iso3 = entry.countryiso3code?.toUpperCase();
    if (!iso3 || !AU_COUNTRIES.includes(iso3)) continue;
    const countryId = iso3.toLowerCase();
    if (!result[countryId]) result[countryId] = [];
    result[countryId].push({
      value: Math.round(entry.value * 100) / 100,
      year: parseInt(entry.date),
      source: 'World Bank WDI',
    });
    count++;
  }
  console.log(`  ✓ ${count} data points, ${Object.keys(result).length} countries`);
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

  // Fetch WHO GHED indicators
  console.log('=== WHO GHED & GHO ===\n');
  for (const [code, indId] of Object.entries(INDICATORS)) {
    const result = await fetchGHOIndicator(code);
    mergeData(indId, result);
    await new Promise(r => setTimeout(r, 1500));
  }

  // Try World Bank for fiscal indicators
  console.log('\n=== World Bank (retry) ===\n');
  const wbFiscal = {
    'GC.DOD.TOTL.GD.ZS': 'debt_gdp',
    'DT.TDS.DECT.CD': 'debt_service_total',
    'DT.TDS.DECT.GN.ZS': 'debt_service_revenue',
    'GC.XPN.INTP.RV.ZS': 'interest_payments_revenue',
    'GC.TAX.TOTL.GD.ZS': 'tax_gdp',
    'NY.GDP.PCAP.CD': 'gdp_per_capita',
    'SH.XPD.GHED.PC.CD': 'gghe_per_capita',
    'SH.XPD.GHED.GD.ZS': 'gghe_gdp',
    'SH.XPD.GHED.GE.ZS': 'gghe_gge',
    'SH.XPD.GHED.CH.ZS': 'gghe_the',
    'SH.XPD.EXTR.ZS': 'external_resources_che',
    'SH.XPD.OOPC.CH.ZS': 'oop_che',
    'SH.MED.BEDS.ZS': 'hospital_beds_density',
    'SH.STA.MMRT': 'maternal_mortality',
    'SH.DYN.MORT': 'under5_mortality',
  };

  for (const [wbCode, indId] of Object.entries(wbFiscal)) {
    // Skip if we already have good coverage from GHED
    const hasGoodCoverage = Object.values(allData).filter(c => c[indId] && c[indId].length > 0).length >= 40;
    if (hasGoodCoverage) {
      console.log(`Skipping WB ${wbCode} → ${indId} (already have good coverage)`);
      continue;
    }
    const result = await fetchWBIndicator(wbCode, indId);
    mergeData(indId, result);
    await new Promise(r => setTimeout(r, 2000));
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
