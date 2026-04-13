#!/usr/bin/env node
/**
 * Fetches World Bank WDI data with smaller page sizes and sequential requests
 * to avoid 502 errors from the WB API.
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

// Use semicolon-separated country codes for targeted requests
const COUNTRY_LIST = AU_COUNTRIES.join(';');

const WB_INDICATORS = {
  'SH.XPD.GHED.PC.CD': 'gghe_per_capita',
  'SH.XPD.GHED.GD.ZS': 'gghe_gdp',
  'SH.XPD.GHED.GE.ZS': 'gghe_gge',
  'SH.XPD.GHED.CH.ZS': 'gghe_the',
  'SH.XPD.EXTR.ZS': 'external_resources_che',
  'SH.XPD.OOPC.CH.ZS': 'oop_che',
  'GC.DOD.TOTL.GD.ZS': 'debt_gdp',
  'DT.TDS.DECT.CD': 'debt_service_total',
  'DT.TDS.DECT.GN.ZS': 'debt_service_revenue',
  'GC.XPN.INTP.RV.ZS': 'interest_payments_revenue',
  'GC.TAX.TOTL.GD.ZS': 'tax_gdp',
  'NY.GDP.PCAP.CD': 'gdp_per_capita',
  'SH.UHC.SRVS.CV.XD': 'uhc_service_coverage',
  'SH.MED.BEDS.ZS': 'hospital_beds_density',
  'SH.STA.BRTC.ZS': 'skilled_birth_attendance',
  'SH.MED.PHYS.ZS': 'physicians_density',
  'SH.STA.MMRT': 'maternal_mortality',
  'SH.DYN.MORT': 'under5_mortality',
};

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, (i + 1) * 5000));
        continue;
      }
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

async function fetchWBIndicator(wbCode) {
  const indicatorId = WB_INDICATORS[wbCode];
  console.log(`Fetching: ${wbCode} → ${indicatorId}`);

  // Use targeted country list to get smaller response
  const url = `https://api.worldbank.org/v2/country/${COUNTRY_LIST}/indicator/${wbCode}?format=json&per_page=2000&date=2015:2024`;
  const data = await fetchWithRetry(url);

  if (!data || !Array.isArray(data) || data.length < 2 || !data[1]) {
    console.warn(`  ✗ No data for ${wbCode}`);
    return {};
  }

  const entries = data[1];
  const result = {};
  let count = 0;

  for (const entry of entries) {
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

  const countries = Object.keys(result).length;
  console.log(`  ✓ ${count} data points, ${countries} countries`);
  return result;
}

async function main() {
  // Load existing data from previous fetch
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

  console.log('Fetching World Bank data (sequential, targeted country list)...\n');

  const wbCodes = Object.keys(WB_INDICATORS);
  for (const wbCode of wbCodes) {
    const result = await fetchWBIndicator(wbCode);
    mergeData(WB_INDICATORS[wbCode], result);
    // 1.5s delay between requests
    await new Promise(r => setTimeout(r, 1500));
  }

  // Summary
  console.log('\n=== Updated Summary ===');
  let totalValues = 0;
  const indicatorCoverage = {};
  for (const [countryId, indicators] of Object.entries(allData)) {
    for (const [indId, values] of Object.entries(indicators)) {
      totalValues += values.length;
      if (!indicatorCoverage[indId]) indicatorCoverage[indId] = 0;
      indicatorCoverage[indId]++;
    }
  }
  console.log(`Total data points: ${totalValues}`);
  console.log(`Indicator coverage:`);
  for (const [indId, count] of Object.entries(indicatorCoverage).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${indId}: ${count}/55 countries`);
  }

  writeFileSync(dataPath, JSON.stringify(allData, null, 2));
  console.log(`\nWrote updated data to ${dataPath}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
