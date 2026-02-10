/**
 * CAP Pillar One: Indicator Document Data Service
 * Provides indicator metadata, component breakdowns, and document links.
 */

import { AU_MEMBER_STATES } from '../utils/countries';

// Indicator definitions with components and methodology
export const INDICATORS = {
    TOTAL_DEBT: {
        id: 'TOTAL_DEBT',
        name: 'Total External Debt',
        description: 'The total stock of external debt obligations owed by a country to non-resident creditors.',
        methodology: 'Sum of public and publicly guaranteed debt, private non-guaranteed debt, use of IMF credit, and short-term debt.',
        unit: 'USD',
        components: [
            { name: 'Public & Publicly Guaranteed Debt', description: 'Long-term debt owed by public sector or guaranteed by government', weight: 60 },
            { name: 'Private Non-Guaranteed Debt', description: 'Long-term debt owed by private sector without government guarantee', weight: 25 },
            { name: 'Short-Term Debt', description: 'Debt with original maturity of one year or less', weight: 10 },
            { name: 'IMF Credit', description: 'Use of Fund credit and loans from the IMF', weight: 5 }
        ],
        relatedDocuments: ['DSA', 'ANNUAL_REPORT']
    },
    DEBT_TO_GDP: {
        id: 'DEBT_TO_GDP',
        name: 'Debt to GDP Ratio',
        description: 'Total external debt as a percentage of Gross Domestic Product. A key solvency indicator.',
        methodology: 'External Debt Stock / Nominal GDP × 100. Thresholds: <30% (Low Risk), 30-55% (Moderate), >55% (High Risk).',
        unit: '%',
        components: [
            { name: 'External Debt Stock', description: 'Numerator: Total external debt obligations', weight: 50 },
            { name: 'Nominal GDP', description: 'Denominator: Gross Domestic Product at current prices', weight: 50 }
        ],
        relatedDocuments: ['DSA', 'MTDS', 'FISCAL_REPORT']
    },
    DEBT_TO_EXPORTS: {
        id: 'DEBT_TO_EXPORTS',
        name: 'Debt to Exports Ratio',
        description: 'External debt stock as a percentage of exports of goods, services, and primary income.',
        methodology: 'External Debt Stock / Exports × 100. Indicates capacity to service debt from export earnings.',
        unit: '%',
        components: [
            { name: 'External Debt Stock', description: 'Total external debt obligations', weight: 50 },
            { name: 'Exports of Goods & Services', description: 'Total export revenue including primary income', weight: 50 }
        ],
        relatedDocuments: ['DSA', 'TRADE_REPORT']
    },
    DEBT_SERVICE_EXPORTS: {
        id: 'DEBT_SERVICE_EXPORTS',
        name: 'Debt Service to Exports',
        description: 'Total debt service payments as a percentage of exports. A key liquidity indicator.',
        methodology: 'Debt Service / Exports × 100. Thresholds: <10% (Low), 10-21% (Moderate), >21% (High Risk).',
        unit: '%',
        components: [
            { name: 'Principal Repayments', description: 'Scheduled principal payments on long-term debt', weight: 60 },
            { name: 'Interest Payments', description: 'Interest due on all debt', weight: 40 }
        ],
        relatedDocuments: ['DSA', 'MTDS', 'ANNUAL_REPORT']
    },
    DEBT_SERVICE_REVENUE: {
        id: 'DEBT_SERVICE_REVENUE',
        name: 'Debt Service to Revenue',
        description: 'Debt service payments as a percentage of government revenue. Indicates fiscal sustainability.',
        methodology: 'Debt Service / Government Revenue × 100. Critical for assessing budgetary space.',
        unit: '%',
        components: [
            { name: 'Total Debt Service', description: 'Principal and interest payments due', weight: 50 },
            { name: 'Government Revenue', description: 'Tax and non-tax revenue collected', weight: 50 }
        ],
        relatedDocuments: ['FISCAL_REPORT', 'BUDGET', 'MTDS']
    }
};

// Document types with descriptions
export const DOCUMENT_TYPES = {
    DSA: { name: 'Debt Sustainability Analysis', description: 'IMF/World Bank joint assessment of debt sustainability' },
    MTDS: { name: 'Medium-Term Debt Strategy', description: 'Government strategy for managing public debt over 3-5 years' },
    ANNUAL_REPORT: { name: 'Annual Debt Report', description: 'Official annual public debt statistical bulletin' },
    FISCAL_REPORT: { name: 'Fiscal Report', description: 'Government fiscal outturn and budget execution report' },
    TRADE_REPORT: { name: 'Trade Statistics', description: 'Official trade and balance of payments statistics' },
    BUDGET: { name: 'Budget Document', description: 'Annual national budget and fiscal framework' }
};

// Mock country document links (sample data - would be populated with real URLs)
const COUNTRY_DOCUMENTS = {
    GH: {
        name: 'Ghana',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/05/Ghana-DSA', year: 2023 },
            MTDS: { url: 'https://mofep.gov.gh/publications/mtds', year: 2022 },
            ANNUAL_REPORT: { url: 'https://mofep.gov.gh/publications/public-debt-report', year: 2023 },
            FISCAL_REPORT: { url: 'https://mofep.gov.gh/fiscal-data', year: 2023 }
        }
    },
    NG: {
        name: 'Nigeria',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/Nigeria-DSA', year: 2023 },
            MTDS: { url: 'https://dmo.gov.ng/publications/mtds', year: 2023 },
            ANNUAL_REPORT: { url: 'https://dmo.gov.ng/publications/annual-report', year: 2023 }
        }
    },
    KE: {
        name: 'Kenya',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/Kenya-DSA', year: 2023 },
            MTDS: { url: 'https://treasury.go.ke/publications/mtds', year: 2022 },
            ANNUAL_REPORT: { url: 'https://treasury.go.ke/public-debt', year: 2023 }
        }
    },
    ZA: {
        name: 'South Africa',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/SouthAfrica-DSA', year: 2023 },
            ANNUAL_REPORT: { url: 'https://treasury.gov.za/publications/debtreview', year: 2023 },
            BUDGET: { url: 'https://treasury.gov.za/documents/budget', year: 2024 }
        }
    },
    EG: {
        name: 'Egypt',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/Egypt-DSA', year: 2023 },
            MTDS: { url: 'https://mof.gov.eg/en/publications/mtds', year: 2023 }
        }
    },
    ET: {
        name: 'Ethiopia',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/Ethiopia-DSA', year: 2023 }
        }
    },
    TZ: {
        name: 'Tanzania',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/Tanzania-DSA', year: 2023 },
            ANNUAL_REPORT: { url: 'https://treasury.go.tz/publications/debt-report', year: 2023 }
        }
    },
    UG: {
        name: 'Uganda',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/Uganda-DSA', year: 2023 },
            MTDS: { url: 'https://finance.go.ug/publications/mtds', year: 2022 }
        }
    },
    SN: {
        name: 'Senegal',
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/Senegal-DSA', year: 2023 },
            MTDS: { url: 'https://finances.gouv.sn/publications/mtds', year: 2022 }
        }
    },
    CI: {
        name: "Côte d'Ivoire",
        documents: {
            DSA: { url: 'https://www.imf.org/en/Publications/CR/Issues/2023/CotedIvoire-DSA', year: 2023 },
            MTDS: { url: 'https://budget.gouv.ci/publications/mtds', year: 2023 }
        }
    }
};

/**
 * Get indicator metadata by ID
 */
export const getIndicatorById = (indicatorId) => {
    return INDICATORS[indicatorId] || null;
};

/**
 * Get all available indicators
 */
export const getAllIndicators = () => {
    return Object.values(INDICATORS);
};

/**
 * Get documents for a specific country
 */
export const getCountryDocuments = (countryCode) => {
    return COUNTRY_DOCUMENTS[countryCode] || null;
};

/**
 * Get documents relevant to a specific indicator for a country
 */
export const getIndicatorDocuments = (indicatorId, countryCode) => {
    const indicator = INDICATORS[indicatorId];
    const countryData = COUNTRY_DOCUMENTS[countryCode];

    if (!indicator || !countryData) {
        return [];
    }

    const relevantDocs = [];

    for (const docType of indicator.relatedDocuments) {
        if (countryData.documents[docType]) {
            relevantDocs.push({
                type: docType,
                ...DOCUMENT_TYPES[docType],
                ...countryData.documents[docType]
            });
        }
    }

    return relevantDocs;
};

/**
 * Get all countries with their document availability
 */
export const getCountriesWithDocuments = () => {
    return AU_MEMBER_STATES.map(country => ({
        ...country,
        hasDocuments: !!COUNTRY_DOCUMENTS[country.code],
        documentCount: COUNTRY_DOCUMENTS[country.code]
            ? Object.keys(COUNTRY_DOCUMENTS[country.code].documents).length
            : 0
    }));
};
