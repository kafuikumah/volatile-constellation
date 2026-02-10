/**
 * Debt Sustainability Analysis (DSA) Model
 * Based on standard WB/IMF thresholds for Low-Income Countries (LICs) and Market Access Countries (MACs).
 * Simplified for demonstration purposes.
 */

// Thresholds for "Strong" vs "Weak" performers or broad generalized thresholds.
// Using conservative thresholds for "Red" flags.
const THRESHOLDS = {
    // Solvency Metrics
    PV_DEBT_TO_GDP: {
        low: 30,    // Green < 30
        medium: 40, // Yellow 30-40
        high: 55    // Red > 55 (Generalized)
    },
    PV_DEBT_TO_EXPORTS: {
        low: 140,
        medium: 180,
        high: 240
    },
    // Liquidity Metrics
    DEBT_SERVICE_TO_EXPORTS: {
        low: 10,
        medium: 15,
        high: 21
    },
    DEBT_SERVICE_TO_REVENUE: {
        low: 14,
        medium: 18,
        high: 23
    }
};

export const getRiskLevel = (value, indicatorType) => {
    if (value === null || value === undefined) return 'UNKNOWN';

    let limits;
    switch (indicatorType) {
        case 'DEBT_TO_GDP': // Using PV_DEBT_TO_GDP as proxy
            limits = THRESHOLDS.PV_DEBT_TO_GDP;
            break;
        case 'DEBT_SERVICE_EXPORTS':
            limits = THRESHOLDS.DEBT_SERVICE_TO_EXPORTS;
            break;
        default:
            return 'UNKNOWN';
    }

    if (value < limits.low) return 'LOW'; // Green
    if (value < limits.high) return 'MODERATE'; // Yellow
    return 'HIGH'; // Red
};

export const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
        case 'LOW': return 'var(--color-success)';
        case 'MODERATE': return 'var(--color-warning)';
        case 'HIGH': return 'var(--color-danger)';
        default: return 'var(--color-text-secondary)';
    }
};

export const getCountryOverallRisk = (debtData) => {
    if (!debtData) return 'UNKNOWN';

    // Weights could be applied here. For now, if Solvency OR Liquidity is High, it's High.
    const debtGdpRisk = getRiskLevel(debtData.EXTERNAL_DEBT_GNI_PCT, 'DEBT_TO_GDP');
    const serviceExpRisk = getRiskLevel(debtData.DEBT_SERVICE_EXPORTS_PCT, 'DEBT_SERVICE_EXPORTS');

    if (debtGdpRisk === 'HIGH' || serviceExpRisk === 'HIGH') return 'HIGH';
    if (debtGdpRisk === 'MODERATE' || serviceExpRisk === 'MODERATE') return 'MODERATE';
    if (debtGdpRisk === 'LOW' && serviceExpRisk === 'LOW') return 'LOW';

    return 'UNKNOWN';
};
