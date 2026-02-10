import { AU_MEMBER_STATES } from '../utils/countries';

const RATINGS = ['Strong', 'Adequate', 'Weak'];

/**
 * Generates deterministic assessment based on country code and indicator
 */
const getDeterministicRating = (seedString) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        const char = seedString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Normalize to 0-1
    const rand = (Math.abs(hash) % 100) / 100;

    if (rand > 0.6) return 'Strong';
    if (rand > 0.3) return 'Adequate';
    return 'Weak';
};

export const getQualitativeLevel = (rating) => {
    switch (rating) {
        case 'Strong': return 'LOW'; // Low Risk / Green
        case 'Adequate': return 'MODERATE'; // Yellow
        case 'Weak': return 'HIGH'; // Red
        default: return 'UNKNOWN';
    }
}

export const fetchQualitativeData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return AU_MEMBER_STATES.map(country => ({
        countryName: country.name,
        countryCode: country.code,
        dataDissemination: getDeterministicRating(country.code + 'DATA_DISSEMINATION'),
        debtStrategy: getDeterministicRating(country.code + 'DEBT_STRATEGY'),
        borrowingPlan: getDeterministicRating(country.code + 'BORROWING_PLAN'),
        domesticMarket: getDeterministicRating(country.code + 'DOMESTIC_MARKET')
    }));
};
