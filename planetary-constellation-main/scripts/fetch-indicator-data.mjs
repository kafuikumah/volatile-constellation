#!/usr/bin/env node
/**
 * Fetches indicator data from World Bank WDI and WHO GHO APIs
 * for all 55 AU member states and outputs a JSON file.
 *
 * Usage: node scripts/fetch-indicator-data.mjs
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// AU member state ISO3 codes (uppercase for API matching)
const AU_COUNTRIES = [
  'BDI','CMR','CAF','TCD','COG','COD','GNQ','GAB','STP', // Central
  'COM','DJI','ERI','ETH','KEN','MDG','MUS','RWA','SYC','SOM','SSD','SDN','TZA','UGA', // Eastern
  'DZA','EGY','LBY','MRT','MAR','TUN', // Northern (skip SADR - no int'l data)
  'AGO','BWA','SWZ','LSO','MWI','MOZ','NAM','ZAF','ZMB','ZWE', // Southern
  'BEN','BFA','CPV','CIV','GMB','GHA','GIN','GNB','LBR','MLI','NER','NGA','SEN','SLE','TGO', // Western
];

// ── World Bank indicators ──────────────────────────────────────────────────
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

// ── WHO GHO indicators ────────────────────────────────────────────────────
const WHO_GHO_INDICATORS = {
  'FINPROTECTION_CATA_TOT_10_POP': 'uhc_financial_hardship_10',
  'FINPROTECTION_CATA_TOT_25_POP': 'uhc_financial_hardship_25',
  'MDG_0000000025': 'skilled_birth_attendance',  // cross-check
  'HWF_0001': 'health_workers_density',
  'MDG_0000000026': 'maternal_mortality',  // cross-check
  'MDG_0000000007': 'under5_mortality',  // cross-check
};

// ── Fetch helpers ──────────────────────────────────────────────────────────

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.status === 429) {
        console.warn(`  Rate limited, waiting ${(i + 1) * 5}s...`);
        await new Promise(r => setTimeout(r, (i + 1) * 5000));
        continue;
      }
      if (!res.ok) {
        console.warn(`  HTTP ${res.status} for ${url}`);
        return null;
      }
      return await res.json();
    } catch (e) {
      console.warn(`  Attempt ${i + 1} failed for ${url}: ${e.message}`);
      if (i < retries - 1) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

// ── World Bank fetcher ─────────────────────────────────────────────────────

async function fetchWorldBankIndicator(wbCode) {
  const indicatorId = WB_INDICATORS[wbCode];
  console.log(`  Fetching WB: ${wbCode} → ${indicatorId}`);

  // Fetch African countries data for years 2015-2024
  const url = `https://api.worldbank.org/v2/country/all/indicator/${wbCode}?format=json&per_page=10000&date=2015:2024`;
  const data = await fetchWithRetry(url);

  if (!data || !Array.isArray(data) || data.length < 2 || !data[1]) {
    console.warn(`  No data returned for ${wbCode}`);
    return {};
  }

  const entries = data[1];
  const result = {};

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
  }

  return result;
}

// ── WHO GHO fetcher ────────────────────────────────────────────────────────

async function fetchWHOGHOIndicator(ghoCode) {
  const indicatorId = WHO_GHO_INDICATORS[ghoCode];
  console.log(`  Fetching WHO GHO: ${ghoCode} → ${indicatorId}`);

  const url = `https://ghoapi.azureedge.net/api/${ghoCode}?$filter=SpatialDimType eq 'COUNTRY'&$select=SpatialDim,TimeDim,NumericValue`;
  const data = await fetchWithRetry(url);

  if (!data || !data.value) {
    console.warn(`  No data returned for ${ghoCode}`);
    return {};
  }

  const result = {};

  for (const entry of data.value) {
    if (entry.NumericValue === null || entry.NumericValue === undefined) continue;
    const iso3 = entry.SpatialDim?.toUpperCase();
    if (!iso3 || !AU_COUNTRIES.includes(iso3)) continue;
    const year = parseInt(entry.TimeDim);
    if (isNaN(year) || year < 2010) continue;

    const countryId = iso3.toLowerCase();
    if (!result[countryId]) result[countryId] = [];
    result[countryId].push({
      value: Math.round(entry.NumericValue * 100) / 100,
      year,
      source: 'WHO GHO',
    });
  }

  return result;
}

// ── IMF WEO fetcher ────────────────────────────────────────────────────────

async function fetchIMFIndicator(imfCode, indicatorId) {
  console.log(`  Fetching IMF WEO: ${imfCode} → ${indicatorId}`);

  const url = `https://www.imf.org/external/datamapper/api/v1/${imfCode}`;
  const data = await fetchWithRetry(url);

  if (!data || !data.values || !data.values[imfCode]) {
    console.warn(`  No data returned for IMF ${imfCode}`);
    return {};
  }

  const countryData = data.values[imfCode];
  const result = {};

  for (const [iso3, yearValues] of Object.entries(countryData)) {
    if (!AU_COUNTRIES.includes(iso3.toUpperCase())) continue;
    const countryId = iso3.toLowerCase();
    if (!result[countryId]) result[countryId] = [];

    for (const [yearStr, value] of Object.entries(yearValues)) {
      const year = parseInt(yearStr);
      if (isNaN(year) || year < 2015 || value === null || value === undefined) continue;
      result[countryId].push({
        value: Math.round(parseFloat(value) * 100) / 100,
        year,
        source: 'IMF WEO',
      });
    }
  }

  return result;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Starting data fetch for 55 AU member states...\n');

  // Collect all indicator data: { countryId: { indicatorId: IndicatorValue[] } }
  const allData = {};
  AU_COUNTRIES.forEach(c => { allData[c.toLowerCase()] = {}; });

  // Helper to merge fetched data
  function mergeData(indicatorId, fetchedData) {
    for (const [countryId, values] of Object.entries(fetchedData)) {
      if (!allData[countryId]) continue;
      // If we already have data for this indicator, prefer the source with more recent data
      const existing = allData[countryId][indicatorId] || [];
      // Merge and deduplicate by year (prefer the first source fetched)
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

  // ── Fetch World Bank indicators (batch of 4 at a time to be polite) ──
  console.log('=== World Bank WDI ===');
  const wbCodes = Object.keys(WB_INDICATORS);
  for (let i = 0; i < wbCodes.length; i += 4) {
    const batch = wbCodes.slice(i, i + 4);
    const results = await Promise.all(batch.map(fetchWorldBankIndicator));
    for (let j = 0; j < batch.length; j++) {
      mergeData(WB_INDICATORS[batch[j]], results[j]);
    }
    // Small delay between batches
    if (i + 4 < wbCodes.length) await new Promise(r => setTimeout(r, 1000));
  }

  // ── Fetch WHO GHO indicators ──
  console.log('\n=== WHO GHO ===');
  const ghoCodes = Object.keys(WHO_GHO_INDICATORS);
  for (let i = 0; i < ghoCodes.length; i += 3) {
    const batch = ghoCodes.slice(i, i + 3);
    const results = await Promise.all(batch.map(fetchWHOGHOIndicator));
    for (let j = 0; j < batch.length; j++) {
      mergeData(WHO_GHO_INDICATORS[batch[j]], results[j]);
    }
    if (i + 3 < ghoCodes.length) await new Promise(r => setTimeout(r, 1000));
  }

  // ── Fetch IMF WEO indicators ──
  console.log('\n=== IMF WEO ===');
  const imfIndicators = [
    ['GGXWDG_NGDP', 'debt_gdp'],
    ['NGDPDPC', 'gdp_per_capita'],
  ];
  for (const [imfCode, indicatorId] of imfIndicators) {
    const result = await fetchIMFIndicator(imfCode, indicatorId);
    mergeData(indicatorId, result);
    await new Promise(r => setTimeout(r, 1000));
  }

  // ── Summary ──
  console.log('\n=== Summary ===');
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
  console.log(`Indicator coverage (countries with data):`);
  for (const [indId, count] of Object.entries(indicatorCoverage).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${indId}: ${count}/55 countries`);
  }

  // ── Write output ──
  const outPath = join(__dirname, '..', 'src', 'data', 'indicator-data.json');
  writeFileSync(outPath, JSON.stringify(allData, null, 2));
  console.log(`\nWrote data to ${outPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
