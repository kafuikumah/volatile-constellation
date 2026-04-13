#!/usr/bin/env node
/**
 * Generates src/data/countries.ts with indicator data populated from indicator-data.json.
 * Keeps only the latest 5 years of data per indicator to manage file size.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'src', 'data', 'indicator-data.json');
const countriesPath = join(__dirname, '..', 'src', 'data', 'countries.ts');

const indicatorData = JSON.parse(readFileSync(dataPath, 'utf-8'));
const countriesSource = readFileSync(countriesPath, 'utf-8');

// Parse the existing countries array to get metadata
// We'll regex-replace the `indicators: {}` with actual data
let output = countriesSource;

let populated = 0;
let empty = 0;

for (const [countryId, indicators] of Object.entries(indicatorData)) {
  const indCount = Object.keys(indicators).length;
  if (indCount === 0) {
    empty++;
    continue;
  }

  // Filter out future projections, then trim to latest 5 data points per indicator
  const trimmed = {};
  for (const [indId, values] of Object.entries(indicators)) {
    const actual = values.filter(v => v.year <= 2025);
    if (actual.length === 0) continue;
    const sorted = actual.sort((a, b) => b.year - a.year).slice(0, 5).reverse();
    trimmed[indId] = sorted;
  }

  // Build the replacement string
  const indStr = JSON.stringify(trimmed);

  // Find the pattern for this country: { id: 'xxx', ... indicators: {} }
  const regex = new RegExp(
    `(\\{ id: '${countryId}',.*?)indicators: \\{\\}`,
    's'
  );

  if (regex.test(output)) {
    output = output.replace(regex, `$1indicators: ${indStr}`);
    populated++;
  } else {
    console.warn(`Could not find country ${countryId} in source`);
  }
}

writeFileSync(countriesPath, output);
console.log(`Populated ${populated} countries with indicator data (${empty} had no data)`);

// Check file size
const size = Buffer.byteLength(output, 'utf-8');
console.log(`Output file size: ${(size / 1024).toFixed(0)} KB`);
