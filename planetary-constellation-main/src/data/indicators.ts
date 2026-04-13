import { Indicator } from '@/types/indicator';

// ============================================================================
// Category 1 — Finances
// How much funding is available, and from what source?
// ============================================================================

export const FINANCE_INDICATORS: Indicator[] = [
  {
    id: 'gghe_per_capita',
    label: 'Government Health Expenditure per Capita (USD)',
    category: 'finances',
    benchmark: '> USD 86 per capita',
    benchmarkValue: 86,
    benchmarkDirection: 'above',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'gghe-d_pc_usd',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.XPD.GHED.PC.CD',
    },
    framework: ['Africa Scorecard'],
    unit: 'USD',
    visible: true,
  },
  {
    id: 'gghe_gdp',
    label: 'General Government Health Expenditure as % of GDP',
    category: 'finances',
    benchmark: '> 5% of GDP',
    benchmarkValue: 5,
    benchmarkDirection: 'above',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'gghe-d_gdp',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.XPD.GHED.GD.ZS',
    },
    framework: ['Africa Scorecard', 'HBB_Finance'],
    unit: '%',
    visible: true,
  },
  {
    id: 'gghe_gge',
    label: 'Government Health Expenditure as % of General Government Expenditure',
    category: 'finances',
    benchmark: '> 15% (Abuja Declaration)',
    benchmarkValue: 15,
    benchmarkDirection: 'above',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'gghe-d_che',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.XPD.GHED.GE.ZS',
    },
    framework: ['Africa Scorecard', 'HBB_Finance', 'ALM_MMH'],
    unit: '%',
    visible: true,
  },
  {
    id: 'gghe_the',
    label: 'Government Health Expenditure as % of Total Health Expenditure',
    category: 'finances',
    benchmark: '>= 50% (domestic public majority)',
    benchmarkValue: 50,
    benchmarkDirection: 'above',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'gghe-d_che',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.XPD.GHED.CH.ZS',
    },
    framework: ['Africa Scorecard', 'HBB_Finance'],
    unit: '%',
    visible: true,
  },
  {
    id: 'external_resources_che',
    label: 'External Resources for Health as % of Current Health Expenditure',
    category: 'finances',
    benchmark: '<= 20% (lower aid reliance)',
    benchmarkValue: 20,
    benchmarkDirection: 'below',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'ext_che',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.XPD.EXTR.ZS',
    },
    framework: ['Africa Scorecard'],
    unit: '%',
    visible: true,
  },
  {
    id: 'oop_che',
    label: 'Out-of-Pocket Expenditure as % of Current Health Expenditure',
    category: 'finances',
    benchmark: '<= 25%',
    benchmarkValue: 25,
    benchmarkDirection: 'below',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'oops_che',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.XPD.OOPC.CH.ZS',
    },
    framework: ['Africa Scorecard', 'HBB_Finance', 'ALM_Equity'],
    unit: '%',
    visible: true,
  },
  {
    id: 'uhc_financial_hardship_10',
    label: 'UHC Financial Hardship — Catastrophic Spending (10% threshold) (SDG 3.8.2)',
    category: 'finances',
    benchmark: 'Target: 0%; track both 10% and 25% thresholds',
    benchmarkValue: 0,
    benchmarkDirection: 'below',
    source: 'WHO GHO',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/FINPROTECTION_CATA_TOT_10PC_POP',
      latest: 2022,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.UHC.NOP1.ZS',
    },
    framework: ['SDG', 'ALM_Equity'],
    unit: '%',
    visible: true,
  },
  {
    id: 'uhc_financial_hardship_25',
    label: 'UHC Financial Hardship — Catastrophic Spending (25% threshold)',
    category: 'finances',
    benchmark: 'Target: 0%',
    benchmarkValue: 0,
    benchmarkDirection: 'below',
    source: 'WHO GHO',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/FINPROTECTION_CATA_TOT_25PC_POP',
      latest: 2022,
    },
    framework: ['SDG', 'ALM_Equity'],
    unit: '%',
    visible: true,
  },
  {
    id: 'public_medicines_per_capita',
    label: 'Public Per Capita Expenditure on Medicines',
    category: 'finances',
    benchmark: 'Track trend',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'fs_pharm_pc',
      latest: 2023,
      note: 'Coverage varies by country. Supplement with national budget execution data.',
    },
    framework: ['HBB_Medicine'],
    unit: 'USD',
    visible: true,
  },
  {
    id: 'private_medicines_per_capita',
    label: 'Private Per Capita Expenditure on Medicines',
    category: 'finances',
    benchmark: 'Track trend',
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'pnfp_pharm_pc',
      latest: 2023,
      note: 'Coverage varies. Supplement with DHS/MICS household survey modules.',
    },
    framework: ['HBB_Medicine'],
    unit: 'USD',
    visible: true,
  },
];

// ============================================================================
// Category 2 — General Fiscal Space
// What is the government's room for policy making?
// ============================================================================

export const FISCAL_SPACE_INDICATORS: Indicator[] = [
  {
    id: 'debt_gdp',
    label: 'Debt to GDP',
    category: 'fiscal_space',
    benchmark: null,
    source: 'IMF WEO',
    apiPrimary: {
      url: 'https://www.imf.org/external/datamapper/api/v1/GGXWDG_NGDP',
      latest: 2024,
      note: 'Projections available to 2030',
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/GC.DOD.TOTL.GD.ZS',
    },
    framework: ['Development Indicators'],
    unit: '%',
    visible: true,
  },
  {
    id: 'debt_service_total',
    label: 'Debt Service on External Debt, Total (USD)',
    category: 'fiscal_space',
    benchmark: null,
    source: 'World Bank IDS / WDI',
    apiPrimary: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/DT.TDS.DECT.CD',
      latest: 2024,
    },
    apiCrossCheck: {
      url: 'https://www.imf.org/external/datamapper/api/v1/BM_GS_TOTL_BD_ZS',
    },
    framework: ['Development Indicators'],
    unit: 'USD',
    visible: true,
  },
  {
    id: 'debt_service_revenue',
    label: 'Debt Service to Revenue',
    category: 'fiscal_space',
    benchmark: null,
    source: 'IMF WEO + World Bank IDS',
    apiPrimary: {
      url: 'https://www.imf.org/external/datamapper/api/v1/GGXWDN_NGDP',
      note: 'Compute as TDS / General Govt Revenue. Supplement with WB IDS.',
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/DT.TDS.DECT.GN.ZS',
    },
    framework: ['Development Indicators'],
    unit: '%',
    visible: true,
  },
  {
    id: 'interest_payments_revenue',
    label: 'Interest Payments as % of Revenue',
    category: 'fiscal_space',
    benchmark: null,
    source: 'IMF WEO',
    apiPrimary: {
      url: 'https://www.imf.org/external/datamapper/api/v1/GGXWDN_NGDP',
      code: 'GGSB_NPGDP',
      latest: 2024,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/GC.XPN.INTP.RV.ZS',
    },
    framework: ['Development Indicators'],
    unit: '%',
    visible: true,
  },
  {
    id: 'tax_gdp',
    label: 'Tax to GDP Ratio',
    category: 'fiscal_space',
    benchmark: '> 15% (minimum threshold for basic state capacity)',
    benchmarkValue: 15,
    benchmarkDirection: 'above',
    source: 'World Bank WDI',
    apiPrimary: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/GC.TAX.TOTL.GD.ZS',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://www.imf.org/external/datamapper/api/v1/GGR_NGDP',
    },
    framework: ['ALM_MMH', 'Africa Scorecard', 'Development Indicators'],
    unit: '%',
    visible: true,
  },
  {
    id: 'gdp_per_capita',
    label: 'GDP per Capita (USD)',
    category: 'fiscal_space',
    benchmark: null,
    source: 'World Bank WDI',
    apiPrimary: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD',
      latest: 2024,
    },
    apiCrossCheck: {
      url: 'https://www.imf.org/external/datamapper/api/v1/NGDPDPC',
    },
    framework: ['Development Indicators'],
    unit: 'USD',
    visible: true,
  },
];

// ============================================================================
// Category 3 — Finance Utilisation
// What does 1 USD buy?
// ============================================================================

export const FINANCE_UTILISATION_INDICATORS: Indicator[] = [
  {
    id: 'uhc_service_coverage',
    label: 'UHC Service Coverage Index (SDG 3.8.1)',
    category: 'finance_utilisation',
    benchmark: '>= 80 (high coverage)',
    benchmarkValue: 80,
    benchmarkDirection: 'above',
    source: 'WHO GHO',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/UHC_INDEX_REPORTED',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.UHC.SRVS.CV.XD',
    },
    framework: ['SDG'],
    unit: 'index (0-100)',
    visible: true,
  },
  {
    id: 'health_facilities_density',
    label: 'Health Facilities per 10,000 Population',
    category: 'finance_utilisation',
    benchmark: '2 per 10,000 (SARA reference)',
    benchmarkValue: 2,
    benchmarkDirection: 'above',
    source: 'WHO GHO',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/DEVICES_DENSITY_HealthFacilities',
      note: 'Supplement with country HMIS and SARA survey data.',
    },
    framework: ['HBB_Service'],
    unit: 'per 10,000',
    visible: true,
  },
  {
    id: 'hospital_beds_density',
    label: 'Inpatient Beds per 10,000 Population',
    category: 'finance_utilisation',
    benchmark: 'Track trend; global average ~27 per 10,000',
    benchmarkValue: 27,
    benchmarkDirection: 'above',
    source: 'WHO GHO',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/HWF_0001',
      code: 'HOSPITAL_BED_DENSITY',
      latest: 2021,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.MED.BEDS.ZS',
    },
    framework: ['HBB_Service'],
    unit: 'per 10,000',
    visible: true,
  },
  {
    // DEFERRED — excluded from Phase 1 UI by client request
    id: 'outpatient_visits',
    label: 'Outpatient Department Visits per 10,000 Population per Year',
    category: 'finance_utilisation',
    benchmark: '~3 visits per capita/year (SARA example)',
    benchmarkValue: 30000,
    benchmarkDirection: 'above',
    source: 'WHO GHO',
    apiPrimary: {
      url: "https://ghoapi.azureedge.net/api/Indicator?$filter=contains(IndicatorName,'outpatient')",
      note: 'Limited global comparability. Supplement with DHIS2 / national HMIS.',
    },
    framework: ['HBB_Service'],
    unit: 'per 10,000',
    visible: false, // ← DEFERRED. Do NOT render in UI. Keep in DB schema.
  },
  {
    id: 'skilled_birth_attendance',
    label: 'Births Attended by Skilled Health Personnel (%)',
    category: 'finance_utilisation',
    benchmark: '>= 90% by 2030',
    benchmarkValue: 90,
    benchmarkDirection: 'above',
    source: 'WHO/UNICEF Joint Database',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/MDG_0000000025',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.STA.BRTC.ZS',
    },
    framework: ['SDG indicator 3.1.2'],
    unit: '%',
    visible: true,
  },
  {
    id: 'health_workers_density',
    label: 'Health Workers per 10,000 Population (Doctors + Nurses + Midwives)',
    category: 'finance_utilisation',
    benchmark: '>= 44.5 per 10,000 (WHO SDG threshold)',
    benchmarkValue: 44.5,
    benchmarkDirection: 'above',
    source: 'WHO NHWA',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/HWF_0001',
      code: 'HWF_0001',
      latest: 2023,
    },
    framework: ['HBB_Workforce'],
    unit: 'per 10,000',
    visible: true,
  },
  {
    id: 'physicians_density',
    label: 'Physicians per 10,000 Population',
    category: 'finance_utilisation',
    benchmark: 'Track trend and compare with regional peers',
    source: 'WHO GHO',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/HWF_0001',
      code: 'physician density per 10,000',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.MED.PHYS.ZS',
    },
    framework: ['HBB_Workforce'],
    unit: 'per 10,000',
    visible: true,
  },
  {
    id: 'health_worker_distribution',
    label: 'Distribution of Health Workers by Geography/Region',
    category: 'finance_utilisation',
    benchmark: 'National HRH database updated within past 2 years',
    source: 'WHO NHWA',
    apiPrimary: {
      url: 'https://apps.who.int/nhwaportal/Home/Index',
      note: 'No global API for sub-national distribution. Country HMIS/iHRIS data required.',
      latest: 2023,
    },
    framework: ['HBB_Workforce'],
    unit: 'qualitative',
    visible: true,
  },
  {
    id: 'health_graduates',
    label: 'Annual Health Profession Graduates per 100,000 Population',
    category: 'finance_utilisation',
    benchmark: 'Track trend',
    source: 'WHO NHWA',
    apiPrimary: {
      url: 'https://apps.who.int/nhwaportal/Home/Index',
      latest: 2022,
    },
    framework: ['HBB_Workforce'],
    unit: 'per 100,000',
    visible: true,
  },
  {
    id: 'essential_medicines_availability',
    label: 'Average Availability of 14 Selected Essential Medicines (%)',
    category: 'finance_utilisation',
    benchmark: '>= 80% availability (WHO reference)',
    benchmarkValue: 80,
    benchmarkDirection: 'above',
    source: 'WHO/HAI Medicine Availability Database',
    apiPrimary: {
      url: "https://ghoapi.azureedge.net/api/Indicator?$filter=contains(IndicatorName,'medicine availability')",
      note: 'Country-survey-based. Varies by country.',
    },
    framework: ['HBB_Medicine'],
    unit: '%',
    visible: true,
  },
  {
    id: 'essential_medicines_price_ratio',
    label: 'Median Consumer Price Ratio of 14 Selected Essential Medicines',
    category: 'finance_utilisation',
    benchmark: 'MPR < 2.5 considered acceptable',
    benchmarkValue: 2.5,
    benchmarkDirection: 'below',
    source: 'WHO/HAI Medicine Prices Database',
    apiPrimary: {
      url: "https://ghoapi.azureedge.net/api/Indicator?$filter=contains(IndicatorName,'price ratio')",
      note: 'Survey-based; no real-time API. Country-survey-based.',
    },
    framework: ['HBB_Medicine'],
    unit: 'ratio',
    visible: true,
  },
];

// ============================================================================
// Category 4 — Government Action
// Policy and strategy
// ============================================================================

export const GOVERNMENT_ACTION_INDICATORS: Indicator[] = [
  {
    id: 'national_health_strategy',
    label: 'Existence of an Up-to-Date National Health Strategy',
    category: 'government_action',
    benchmark: 'Strategy updated within last 5 years and costed',
    source: 'WHO HIS/HSSPX',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/HSSPX_03',
      note: 'Binary/qualitative. Supplement with country MoH strategy documents.',
      latest: 2023,
    },
    framework: ['HBB_Governance'],
    unit: 'Yes/No',
    visible: true,
  },
  {
    id: 'moh_budget_utilisation',
    label: 'Ministry of Health Budget Utilisation / Execution Rate',
    category: 'government_action',
    benchmark: null,
    source: 'PEFA Framework',
    apiPrimary: {
      url: 'https://www.pefa.org/assessments',
      note: 'Download country PEFA reports (PI-21). No machine-readable API. Supplement with IMF Article IV and national budget execution reports.',
    },
    framework: ['ALM_MMH'],
    unit: '%',
    visible: true,
  },
  {
    id: 'gghe_salaries',
    label: 'Government Health Expenditure Spent on Salaries / Wages (%)',
    category: 'government_action',
    benchmark: null,
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'gghe-d_sal',
      latest: 2023,
      note: 'Coverage varies. Supplement with national budget execution data.',
    },
    framework: ['ALM_MHM'],
    unit: '%',
    visible: true,
  },
  {
    id: 'phc_spending',
    label: 'Total Public Health Spending Allocated to Primary Health Care (%)',
    category: 'government_action',
    benchmark: null,
    source: 'WHO GHED',
    apiPrimary: {
      url: 'https://apps.who.int/nha/database/Select/Indicators/en',
      code: 'gghe-d_phc',
      latest: 2023,
      note: 'Limited country coverage. Supplement with USAID/GFF PHC expenditure country briefs.',
    },
    framework: ['ALM_MHM'],
    unit: '%',
    visible: true,
  },
];

// ============================================================================
// Category 5 — Health Impact
// ============================================================================

export const HEALTH_IMPACT_INDICATORS: Indicator[] = [
  {
    id: 'rmnch_coverage',
    label: 'RMNCH Coverage Index',
    category: 'health_impact',
    benchmark: null,
    source: 'WHO GHO',
    apiPrimary: {
      url: "https://ghoapi.azureedge.net/api/Indicator?$filter=contains(IndicatorName,'RMNCH')",
      latest: 2023,
    },
    apiCrossCheck: {
      note: 'Cross-check: UNICEF MICS / DHS Programme data',
    },
    framework: ['ALM_Equity'],
    unit: 'index',
    visible: true,
  },
  {
    id: 'maternal_mortality',
    label: 'Maternal Mortality Ratio (MMR)',
    category: 'health_impact',
    benchmark: '< 70 deaths per 100,000 live births',
    benchmarkValue: 70,
    benchmarkDirection: 'below',
    source: 'WHO GHO',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/MDG_0000000026',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.STA.MMRT',
    },
    framework: ['SDG 3.1.1'],
    unit: 'per 100,000 live births',
    visible: true,
  },
  {
    id: 'under5_mortality',
    label: 'Under-Five Mortality Rate (U5MR)',
    category: 'health_impact',
    benchmark: '< 25 deaths per 1,000 live births',
    benchmarkValue: 25,
    benchmarkDirection: 'below',
    source: 'UN IGME (UNICEF/WHO/WB/UN DESA)',
    apiPrimary: {
      url: 'https://ghoapi.azureedge.net/api/MDG_0000000007',
      latest: 2023,
    },
    apiCrossCheck: {
      url: 'https://api.worldbank.org/v2/country/all/indicator/SH.DYN.MORT',
    },
    framework: ['SDG 3.2.1'],
    unit: 'per 1,000 live births',
    visible: true,
  },
];

// ============================================================================
// Combined exports
// ============================================================================

export const ALL_INDICATORS: Indicator[] = [
  ...FINANCE_INDICATORS,
  ...FISCAL_SPACE_INDICATORS,
  ...FINANCE_UTILISATION_INDICATORS,
  ...GOVERNMENT_ACTION_INDICATORS,
  ...HEALTH_IMPACT_INDICATORS,
];

/** All visible indicators (excludes deferred indicators like outpatient_visits) */
export const VISIBLE_INDICATORS = ALL_INDICATORS.filter(i => i.visible);

/** Get indicators by category */
export function getIndicatorsByCategory(category: string): Indicator[] {
  return ALL_INDICATORS.filter(i => i.category === category);
}

/** Get a single indicator by ID */
export function getIndicatorById(id: string): Indicator | undefined {
  return ALL_INDICATORS.find(i => i.id === id);
}

/** Get visible indicators by category */
export function getVisibleIndicatorsByCategory(category: string): Indicator[] {
  return VISIBLE_INDICATORS.filter(i => i.category === category);
}
