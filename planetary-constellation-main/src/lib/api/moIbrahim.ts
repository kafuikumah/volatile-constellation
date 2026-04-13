import { Country } from '@/types/country';

// Mo Ibrahim IIAG — no public API. CSV must be manually downloaded and uploaded.
// https://iiag.online/data-download/

// Name normalisation map for matching CSV country names to internal IDs
const NAME_TO_ID: Record<string, string> = {
  'Algeria': 'dza', 'Angola': 'ago', 'Benin': 'ben', 'Botswana': 'bwa',
  'Burkina Faso': 'bfa', 'Burundi': 'bdi', 'Cameroon': 'cmr', 'Cabo Verde': 'cpv',
  'Cape Verde': 'cpv', 'Central African Republic': 'caf', 'Chad': 'tcd',
  'Comoros': 'com', 'Congo': 'cog', 'Congo, Dem. Rep.': 'cod', 'DR Congo': 'cod',
  'Côte d\'Ivoire': 'civ', 'Ivory Coast': 'civ', 'Djibouti': 'dji',
  'Egypt': 'egy', 'Equatorial Guinea': 'gnq', 'Eritrea': 'eri', 'Eswatini': 'swz',
  'Swaziland': 'swz', 'Ethiopia': 'eth', 'Gabon': 'gab', 'Gambia': 'gmb',
  'Ghana': 'gha', 'Guinea': 'gin', 'Guinea-Bissau': 'gnb', 'Kenya': 'ken',
  'Lesotho': 'lso', 'Liberia': 'lbr', 'Libya': 'lby', 'Madagascar': 'mdg',
  'Malawi': 'mwi', 'Mali': 'mli', 'Mauritania': 'mrt', 'Mauritius': 'mus',
  'Morocco': 'mar', 'Mozambique': 'moz', 'Namibia': 'nam', 'Niger': 'ner',
  'Nigeria': 'nga', 'Rwanda': 'rwa', 'São Tomé and Príncipe': 'stp',
  'Sao Tome and Principe': 'stp', 'Senegal': 'sen', 'Seychelles': 'syc',
  'Sierra Leone': 'sle', 'Somalia': 'som', 'South Africa': 'zaf',
  'South Sudan': 'ssd', 'Sudan': 'sdn', 'Tanzania': 'tza', 'Togo': 'tgo',
  'Tunisia': 'tun', 'Uganda': 'uga', 'Zambia': 'zmb', 'Zimbabwe': 'zwe',
};

export interface IiagRow {
  country: string;
  year: number;
  score: number;
}

export function parseIiagCsv(csvText: string): IiagRow[] {
  const lines = csvText.trim().split('\n');
  const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const countryIdx = header.findIndex(h => h.toLowerCase().includes('country'));
  const yearIdx = header.findIndex(h => h.toLowerCase().includes('year'));
  const scoreIdx = header.findIndex(h => h.toLowerCase().includes('overall') || h.toLowerCase().includes('score'));

  if (countryIdx === -1 || scoreIdx === -1) {
    throw new Error('IIAG CSV: cannot find country or score columns');
  }

  return lines
    .slice(1)
    .map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      return {
        country: cols[countryIdx] ?? '',
        year: yearIdx !== -1 ? parseInt(cols[yearIdx] ?? '0', 10) : 2023,
        score: parseFloat(cols[scoreIdx] ?? '0'),
      };
    })
    .filter(r => r.country && !isNaN(r.score));
}

export function mapIiagToCountryIds(
  rows: IiagRow[]
): Array<{ countryId: string; year: number; score: number }> {
  return rows
    .map(r => ({
      countryId: NAME_TO_ID[r.country] ?? '',
      year: r.year,
      score: r.score,
    }))
    .filter(r => r.countryId !== '');
}

export function assignGovernanceTiers(
  scores: Array<{ countryId: string; score: number }>
): Record<string, number> {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const n = sorted.length;
  const tiers: Record<string, number> = {};
  sorted.forEach((s, i) => {
    const percentile = (i / n) * 100;
    if (percentile < 25) tiers[s.countryId] = 1;
    else if (percentile < 50) tiers[s.countryId] = 2;
    else if (percentile < 75) tiers[s.countryId] = 3;
    else tiers[s.countryId] = 4;
  });
  return tiers;
}
