// WHO GHED does not have a clean REST API — data is accessed via the GHED portal.
// For now we document the URL and provide a typed placeholder.
export const GHED_BASE = 'https://apps.who.int/nha/database/Select/Indicators/en';

export const GHED_INDICATOR_CODES: Record<string, string> = {
  gghe_per_capita: 'gghe-d_pc_usd',
  gghe_gdp: 'gghe-d_gdp',
  gghe_gge: 'gghe-d_che',
  gghe_the: 'gghe-d_che',
  external_resources_che: 'ext_che',
  oop_che: 'oops_che',
  public_medicines_per_capita: 'fs_pharm_pc',
  private_medicines_per_capita: 'pnfp_pharm_pc',
  gghe_salaries: 'gghe-d_sal',
  phc_spending: 'gghe-d_phc',
};

export async function fetchGhedIndicator(
  indicatorCode: string
): Promise<Array<{ countryCode: string; value: number | null; year: number }>> {
  const ghedCode = GHED_INDICATOR_CODES[indicatorCode];
  if (!ghedCode) return [];

  // GHED does not have a clean machine-readable API for all indicators.
  // Data must be downloaded from the GHED portal and uploaded via admin.
  // This client is a placeholder for future integration.
  console.warn(`GHED sync for ${indicatorCode} (${ghedCode}) requires manual data export from ${GHED_BASE}`);
  return [];
}
