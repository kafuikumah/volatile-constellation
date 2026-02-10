/**
 * Debt Projection Utilities
 * Functions for forecasting debt trajectories and checking sustainability thresholds
 */

// IMF/World Bank Debt Sustainability Analysis Thresholds
export const DSA_THRESHOLDS = {
    DEBT_TO_GDP: {
        LOW_RISK: 40,      // Green
        MODERATE_RISK: 50, // Amber
        HIGH_RISK: 60      // Red
    },
    DEBT_SERVICE_TO_EXPORTS: {
        LOW_RISK: 15,
        MODERATE_RISK: 20,
        HIGH_RISK: 25
    },
    DEBT_SERVICE_TO_REVENUE: {
        LOW_RISK: 18,
        MODERATE_RISK: 22,
        HIGH_RISK: 30
    }
};

/**
 * Project debt trajectory over time
 * @param {Object} baseline - Current debt metrics
 * @param {Object} assumptions - Scenario assumptions
 * @param {number} years - Number of years to project
 * @returns {Array} Projected debt path
 */
export const projectDebtTrajectory = (baseline, assumptions, years = 10) => {
    const {
        currentDebt,        // Current debt stock (in USD)
        currentGDP,         // Current GDP (in USD)
        currentExports,     // Current exports (in USD)
        currentRevenue      // Current government revenue (in USD)
    } = baseline;

    const {
        gdpGrowthRate = 4.0,      // Annual GDP growth %
        interestRate = 5.0,        // Average interest rate on debt %
        primaryBalance = -2.0,     // Primary balance as % of GDP (negative = deficit)
        newBorrowing = 0,          // Additional annual borrowing as % of GDP
        inflationRate = 3.0,       // Annual inflation %
        exportGrowth = 3.0,        // Annual export growth %
        revenueGrowth = 4.0        // Annual revenue growth %
    } = assumptions;

    const projections = [];

    let debt = currentDebt;
    let gdp = currentGDP;
    let exports = currentExports;
    let revenue = currentRevenue;

    for (let year = 0; year <= years; year++) {
        const debtToGDP = (debt / gdp) * 100;
        const debtServiceEstimate = debt * (interestRate / 100) * 0.15; // Rough estimate
        const debtServiceToExports = (debtServiceEstimate / exports) * 100;
        const debtServiceToRevenue = (debtServiceEstimate / revenue) * 100;

        projections.push({
            year: new Date().getFullYear() + year,
            debt: debt / 1e9,  // In billions
            gdp: gdp / 1e9,
            debtToGDP,
            debtServiceToExports,
            debtServiceToRevenue,
            riskLevel: getRiskLevel(debtToGDP)
        });

        // Project next year
        const interestPayment = debt * (interestRate / 100);
        const primaryDeficit = gdp * (Math.abs(primaryBalance) / 100);
        const newDebt = gdp * (newBorrowing / 100);

        debt = debt + interestPayment + primaryDeficit + newDebt;
        gdp = gdp * (1 + gdpGrowthRate / 100);
        exports = exports * (1 + exportGrowth / 100);
        revenue = revenue * (1 + revenueGrowth / 100);
    }

    return projections;
};

/**
 * Determine risk level based on debt-to-GDP ratio
 */
export const getRiskLevel = (debtToGDP) => {
    if (debtToGDP >= DSA_THRESHOLDS.DEBT_TO_GDP.HIGH_RISK) return 'HIGH';
    if (debtToGDP >= DSA_THRESHOLDS.DEBT_TO_GDP.MODERATE_RISK) return 'MODERATE';
    return 'LOW';
};

/**
 * Check if projections breach any DSA thresholds
 * @param {Array} projections - Projected debt path
 * @returns {Array} Threshold breach alerts
 */
export const checkDSAThresholds = (projections) => {
    const alerts = [];

    projections.forEach(p => {
        // Debt-to-GDP alerts
        if (p.debtToGDP >= DSA_THRESHOLDS.DEBT_TO_GDP.HIGH_RISK) {
            alerts.push({
                year: p.year,
                type: 'CRITICAL',
                indicator: 'Debt-to-GDP',
                value: p.debtToGDP.toFixed(1),
                threshold: DSA_THRESHOLDS.DEBT_TO_GDP.HIGH_RISK,
                message: `Debt-to-GDP exceeds ${DSA_THRESHOLDS.DEBT_TO_GDP.HIGH_RISK}% threshold`
            });
        } else if (p.debtToGDP >= DSA_THRESHOLDS.DEBT_TO_GDP.MODERATE_RISK) {
            alerts.push({
                year: p.year,
                type: 'WARNING',
                indicator: 'Debt-to-GDP',
                value: p.debtToGDP.toFixed(1),
                threshold: DSA_THRESHOLDS.DEBT_TO_GDP.MODERATE_RISK,
                message: `Debt-to-GDP approaching high-risk zone`
            });
        }
    });

    return alerts;
};

/**
 * Calculate years until threshold breach
 */
export const yearsToThresholdBreach = (projections, thresholdValue = 60) => {
    const breachYear = projections.find(p => p.debtToGDP >= thresholdValue);
    if (!breachYear) return null;
    return breachYear.year - new Date().getFullYear();
};

/**
 * Generate baseline data from country debt data
 */
export const getCountryBaseline = (countryData) => {
    return {
        currentDebt: countryData.EXTERNAL_DEBT_STOCKS || 50e9,
        currentGDP: (countryData.EXTERNAL_DEBT_STOCKS || 50e9) / ((countryData.EXTERNAL_DEBT_GNI_PCT || 50) / 100),
        currentExports: (countryData.EXTERNAL_DEBT_STOCKS || 50e9) / ((countryData.EXTERNAL_DEBT_EXPORTS_PCT || 150) / 100),
        currentRevenue: (countryData.EXTERNAL_DEBT_STOCKS || 50e9) / ((countryData.DEBT_SERVICE_REVENUE_PCT || 30) / 100) * 5
    };
};
