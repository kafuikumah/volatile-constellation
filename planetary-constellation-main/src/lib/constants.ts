import { IndicatorCategory } from '@/types/indicator';

// Score thresholds
export const SCORE_HIGH_THRESHOLD = 70;
export const SCORE_MID_THRESHOLD = 50;

// Score colors (hex)
export const SCORE_COLORS = {
  high: '#22C55E',
  mid: '#F97316',
  low: '#EF4444',
} as const;

// Indicator category colors
export const INDICATOR_CATEGORY_COLORS: Record<IndicatorCategory, string> = {
  finances: '#F59E0B',           // amber
  fiscal_space: '#3B82F6',       // blue
  finance_utilisation: '#10B981', // emerald
  government_action: '#8B5CF6',  // violet
  health_impact: '#EF4444',      // red
};

// Indicator categories
export const INDICATOR_CATEGORIES = [
  { id: 'finances' as const, label: 'Finances', color: '#F59E0B', description: 'How much funding is available, and from what source?' },
  { id: 'fiscal_space' as const, label: 'General Fiscal Space', color: '#3B82F6', description: "What is the government's room for policy making?" },
  { id: 'finance_utilisation' as const, label: 'Finance Utilisation', color: '#10B981', description: 'What does 1 USD buy?' },
  { id: 'government_action' as const, label: 'Government Action', color: '#8B5CF6', description: 'Policy and strategy' },
  { id: 'health_impact' as const, label: 'Health Impact', color: '#EF4444', description: 'Outcomes and impact on population health' },
] as const;

// AU Geographic Regions (5 official regions)
export const GEOGRAPHIC_REGIONS = [
  'Central Africa',
  'Eastern Africa',
  'Northern Africa',
  'Southern Africa',
  'Western Africa',
] as const;

// AU Regional Economic Communities (8 recognised RECs)
export const RECS = [
  'UMA',
  'COMESA',
  'CEN-SAD',
  'EAC',
  'ECCAS',
  'ECOWAS',
  'IGAD',
  'SADC',
] as const;

export const REC_LABELS: Record<string, string> = {
  'UMA': 'Arab Maghreb Union',
  'COMESA': 'Common Market for Eastern and Southern Africa',
  'CEN-SAD': 'Community of Sahel-Saharan States',
  'EAC': 'East African Community',
  'ECCAS': 'Economic Community of Central African States',
  'ECOWAS': 'Economic Community of West African States',
  'IGAD': 'Intergovernmental Authority on Development',
  'SADC': 'Southern African Development Community',
};

// World Bank income levels
export const INCOME_LEVELS = [
  { id: 'LIC', label: 'Low Income' },
  { id: 'LMIC', label: 'Lower-Middle Income' },
  { id: 'UMIC', label: 'Upper-Middle Income' },
  { id: 'HIC', label: 'High Income' },
] as const;

// Map legend items (5-tier + no data)
export const MAP_LEGEND_ITEMS = [
  { color: '#22C55E', label: 'Strong (≥70)' },
  { color: '#84CC16', label: 'Good (60–69)' },
  { color: '#F97316', label: 'Moderate (50–59)' },
  { color: '#EF4444', label: 'Weak (40–49)' },
  { color: '#991B1B', label: 'Critical (<40)' },
  { color: '#CBD5E1', label: 'No data' },
];

// Bottom bar indicator category labels
export const BOTTOM_BAR_CATEGORIES = [
  { key: 'finances', label: 'FINANCES' },
  { key: 'fiscal_space', label: 'FISCAL SPACE' },
  { key: 'finance_utilisation', label: 'UTILISATION' },
  { key: 'government_action', label: 'GOV. ACTION' },
  { key: 'health_impact', label: 'HEALTH IMPACT' },
] as const;

// Benchmark dimensions
export const BENCHMARK_DIMENSION_LABELS = [
  'Geographic Region',
  'REC',
  'Income Level',
  'Governance Tier (Mo Ibrahim)',
] as const;

// App branding
export const APP_NAME = 'Africa Health Financing Dashboard';
export const APP_VERSION = 'v2.0';
export const APP_ORG = 'African Renaissance Trust';
export const APP_FOOTER = `${APP_NAME} — ${APP_ORG} © ${new Date().getFullYear()}`;
