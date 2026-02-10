/**
 * Sample Creditor Data
 * Represents debt composition by creditor type for African countries
 */

export const CREDITOR_TYPES = {
    MULTILATERAL: 'Multilateral',
    BILATERAL_PARIS: 'Paris Club (Bilateral)',
    BILATERAL_CHINA: 'China (Bilateral)',
    BILATERAL_OTHER: 'Other Bilateral',
    PRIVATE_BANKS: 'Commercial Banks',
    BONDHOLDERS: 'Eurobond Holders',
    OTHER: 'Other Private'
};

export const CREDITOR_COLORS = {
    MULTILATERAL: '#3b82f6',
    BILATERAL_PARIS: '#8b5cf6',
    BILATERAL_CHINA: '#ef4444',
    BILATERAL_OTHER: '#f59e0b',
    PRIVATE_BANKS: '#14b8a6',
    BONDHOLDERS: '#ec4899',
    OTHER: '#6b7280'
};

// Sample creditor breakdown data by country
export const CREDITOR_DATA = {
    NGA: {
        name: 'Nigeria',
        totalDebt: 103.3,
        composition: [
            { type: 'MULTILATERAL', amount: 18.6, pct: 18 },
            { type: 'BILATERAL_CHINA', amount: 14.5, pct: 14 },
            { type: 'BILATERAL_PARIS', amount: 8.3, pct: 8 },
            { type: 'BONDHOLDERS', amount: 41.3, pct: 40 },
            { type: 'PRIVATE_BANKS', amount: 15.5, pct: 15 },
            { type: 'OTHER', amount: 5.1, pct: 5 }
        ],
        loanTerms: {
            avgInterestRate: 5.8,
            avgMaturity: 12,
            avgGracePeriod: 3
        },
        restructuringStatus: null
    },
    KEN: {
        name: 'Kenya',
        totalDebt: 72.4,
        composition: [
            { type: 'MULTILATERAL', amount: 23.2, pct: 32 },
            { type: 'BILATERAL_CHINA', amount: 21.7, pct: 30 },
            { type: 'BILATERAL_PARIS', amount: 5.8, pct: 8 },
            { type: 'BONDHOLDERS', amount: 14.5, pct: 20 },
            { type: 'PRIVATE_BANKS', amount: 4.3, pct: 6 },
            { type: 'OTHER', amount: 2.9, pct: 4 }
        ],
        loanTerms: {
            avgInterestRate: 4.2,
            avgMaturity: 15,
            avgGracePeriod: 4
        },
        restructuringStatus: null
    },
    GHA: {
        name: 'Ghana',
        totalDebt: 55.2,
        composition: [
            { type: 'MULTILATERAL', amount: 13.8, pct: 25 },
            { type: 'BILATERAL_CHINA', amount: 8.8, pct: 16 },
            { type: 'BILATERAL_PARIS', amount: 2.8, pct: 5 },
            { type: 'BONDHOLDERS', amount: 22.1, pct: 40 },
            { type: 'PRIVATE_BANKS', amount: 5.5, pct: 10 },
            { type: 'OTHER', amount: 2.2, pct: 4 }
        ],
        loanTerms: {
            avgInterestRate: 7.2,
            avgMaturity: 10,
            avgGracePeriod: 2
        },
        restructuringStatus: {
            status: 'IN_PROGRESS',
            startDate: '2022-12',
            framework: 'Common Framework',
            creditors: ['Paris Club', 'China']
        }
    },
    ZAF: {
        name: 'South Africa',
        totalDebt: 158.7,
        composition: [
            { type: 'MULTILATERAL', amount: 11.1, pct: 7 },
            { type: 'BILATERAL_PARIS', amount: 6.3, pct: 4 },
            { type: 'BONDHOLDERS', amount: 95.2, pct: 60 },
            { type: 'PRIVATE_BANKS', amount: 39.7, pct: 25 },
            { type: 'OTHER', amount: 6.4, pct: 4 }
        ],
        loanTerms: {
            avgInterestRate: 8.5,
            avgMaturity: 8,
            avgGracePeriod: 0
        },
        restructuringStatus: null
    },
    ETH: {
        name: 'Ethiopia',
        totalDebt: 28.9,
        composition: [
            { type: 'MULTILATERAL', amount: 14.4, pct: 50 },
            { type: 'BILATERAL_CHINA', amount: 8.7, pct: 30 },
            { type: 'BILATERAL_PARIS', amount: 2.9, pct: 10 },
            { type: 'PRIVATE_BANKS', amount: 2.0, pct: 7 },
            { type: 'OTHER', amount: 0.9, pct: 3 }
        ],
        loanTerms: {
            avgInterestRate: 2.1,
            avgMaturity: 25,
            avgGracePeriod: 7
        },
        restructuringStatus: {
            status: 'COMPLETED',
            startDate: '2021-01',
            completedDate: '2023-11',
            framework: 'Common Framework',
            reliefAmount: 3.4
        }
    },
    EGY: {
        name: 'Egypt',
        totalDebt: 165.4,
        composition: [
            { type: 'MULTILATERAL', amount: 33.1, pct: 20 },
            { type: 'BILATERAL_PARIS', amount: 16.5, pct: 10 },
            { type: 'BILATERAL_OTHER', amount: 24.8, pct: 15 },
            { type: 'BONDHOLDERS', amount: 57.9, pct: 35 },
            { type: 'PRIVATE_BANKS', amount: 24.8, pct: 15 },
            { type: 'OTHER', amount: 8.3, pct: 5 }
        ],
        loanTerms: {
            avgInterestRate: 6.8,
            avgMaturity: 11,
            avgGracePeriod: 2
        },
        restructuringStatus: null
    }
};

// Get creditor data for a country (with fallback)
export const getCreditorData = (countryCode) => {
    return CREDITOR_DATA[countryCode] || {
        name: countryCode,
        totalDebt: 20,
        composition: [
            { type: 'MULTILATERAL', amount: 8, pct: 40 },
            { type: 'BILATERAL_CHINA', amount: 4, pct: 20 },
            { type: 'BILATERAL_PARIS', amount: 3, pct: 15 },
            { type: 'BONDHOLDERS', amount: 3, pct: 15 },
            { type: 'OTHER', amount: 2, pct: 10 }
        ],
        loanTerms: {
            avgInterestRate: 4.0,
            avgMaturity: 15,
            avgGracePeriod: 4
        },
        restructuringStatus: null
    };
};
