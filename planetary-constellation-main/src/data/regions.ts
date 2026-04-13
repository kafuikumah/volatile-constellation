// src/data/regions.ts
// Geographic regions and RECs for all 55 AU Member States

export const GEOGRAPHIC_REGIONS = {
  'Central Africa': [
    { id: 'bdi', name: 'Burundi', code: 'bi' },
    { id: 'cmr', name: 'Cameroon', code: 'cm' },
    { id: 'caf', name: 'Central African Republic', code: 'cf' },
    { id: 'tcd', name: 'Chad', code: 'td' },
    { id: 'cog', name: 'Republic of the Congo', code: 'cg' },
    { id: 'cod', name: 'DR Congo', code: 'cd' },
    { id: 'gnq', name: 'Equatorial Guinea', code: 'gq' },
    { id: 'gab', name: 'Gabon', code: 'ga' },
    { id: 'stp', name: 'São Tomé and Príncipe', code: 'st' },
  ],
  'Eastern Africa': [
    { id: 'com', name: 'Comoros', code: 'km' },
    { id: 'dji', name: 'Djibouti', code: 'dj' },
    { id: 'eri', name: 'Eritrea', code: 'er' },
    { id: 'eth', name: 'Ethiopia', code: 'et' },
    { id: 'ken', name: 'Kenya', code: 'ke' },
    { id: 'mdg', name: 'Madagascar', code: 'mg' },
    { id: 'mus', name: 'Mauritius', code: 'mu' },
    { id: 'rwa', name: 'Rwanda', code: 'rw' },
    { id: 'syc', name: 'Seychelles', code: 'sc' },
    { id: 'som', name: 'Somalia', code: 'so' },
    { id: 'ssd', name: 'South Sudan', code: 'ss' },
    { id: 'sdn', name: 'Sudan', code: 'sd' },
    { id: 'tza', name: 'Tanzania', code: 'tz' },
    { id: 'uga', name: 'Uganda', code: 'ug' },
  ],
  'Northern Africa': [
    { id: 'dza', name: 'Algeria', code: 'dz' },
    { id: 'egy', name: 'Egypt', code: 'eg' },
    { id: 'lby', name: 'Libya', code: 'ly' },
    { id: 'mrt', name: 'Mauritania', code: 'mr' },
    { id: 'mar', name: 'Morocco', code: 'ma' },
    { id: 'shr', name: 'Sahrawi Arab Democratic Republic', code: 'eh' },
    { id: 'tun', name: 'Tunisia', code: 'tn' },
  ],
  'Southern Africa': [
    { id: 'ago', name: 'Angola', code: 'ao' },
    { id: 'bwa', name: 'Botswana', code: 'bw' },
    { id: 'swz', name: 'Eswatini', code: 'sz' },
    { id: 'lso', name: 'Lesotho', code: 'ls' },
    { id: 'mwi', name: 'Malawi', code: 'mw' },
    { id: 'moz', name: 'Mozambique', code: 'mz' },
    { id: 'nam', name: 'Namibia', code: 'na' },
    { id: 'zaf', name: 'South Africa', code: 'za' },
    { id: 'zmb', name: 'Zambia', code: 'zm' },
    { id: 'zwe', name: 'Zimbabwe', code: 'zw' },
  ],
  'Western Africa': [
    { id: 'ben', name: 'Benin', code: 'bj' },
    { id: 'bfa', name: 'Burkina Faso', code: 'bf' },
    { id: 'cpv', name: 'Cabo Verde', code: 'cv' },
    { id: 'civ', name: "Côte d'Ivoire", code: 'ci' },
    { id: 'gmb', name: 'Gambia', code: 'gm' },
    { id: 'gha', name: 'Ghana', code: 'gh' },
    { id: 'gin', name: 'Guinea', code: 'gn' },
    { id: 'gnb', name: 'Guinea-Bissau', code: 'gw' },
    { id: 'lbr', name: 'Liberia', code: 'lr' },
    { id: 'mli', name: 'Mali', code: 'ml' },
    { id: 'ner', name: 'Niger', code: 'ne' },
    { id: 'nga', name: 'Nigeria', code: 'ng' },
    { id: 'sen', name: 'Senegal', code: 'sn' },
    { id: 'sle', name: 'Sierra Leone', code: 'sl' },
    { id: 'tgo', name: 'Togo', code: 'tg' },
  ],
} as const;

export type GeographicRegion = keyof typeof GEOGRAPHIC_REGIONS;

export const AU_RECS = [
  { id: 'UMA', name: 'Arab Maghreb Union' },
  { id: 'COMESA', name: 'Common Market for Eastern and Southern Africa' },
  { id: 'CEN-SAD', name: 'Community of Sahel-Saharan States' },
  { id: 'EAC', name: 'East African Community' },
  { id: 'ECCAS', name: 'Economic Community of Central African States' },
  { id: 'ECOWAS', name: 'Economic Community of West African States' },
  { id: 'IGAD', name: 'Intergovernmental Authority on Development' },
  { id: 'SADC', name: 'Southern African Development Community' },
] as const;

export type RecId = (typeof AU_RECS)[number]['id'];

// Helper: get all countries as a flat array
export function getAllRegionCountries() {
  return Object.entries(GEOGRAPHIC_REGIONS).flatMap(([region, countries]) =>
    countries.map(c => ({ ...c, region }))
  );
}

// Helper: find which region a country belongs to
export function getCountryRegion(countryId: string): string | undefined {
  for (const [region, countries] of Object.entries(GEOGRAPHIC_REGIONS)) {
    if (countries.some(c => c.id === countryId)) return region;
  }
  return undefined;
}
