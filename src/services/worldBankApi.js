import { INDICATORS } from '../utils/countries';

const BASE_URL = 'https://api.worldbank.org/v2';

/**
 * Validates if the response from World Bank API is valid
 */
const isValidResponse = (data) => {
    return data && data.length === 2 && Array.isArray(data[1]);
};

/**
 * Fetches data for a specific country and indicator
 * @param {string} countryCode - ISO 3-letter country code
 * @param {string} indicator - World Bank Indicator Code
 * @returns {Promise<Array>} - Array of data points
 */
export const fetchIndicatorData = async (countryCode, indicator) => {
    const cacheKey = `wb_data_${countryCode}_${indicator}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    // Intercept Dummy Data Request
    if (indicator === 'DUMMY_REVENUE_DATA') {
        // Generate deterministic value based on country code hash
        // This ensures same country always shows same value
        const hashCode = countryCode.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0);
        }, 0);
        // Use absolute value and normalize to range 15-45%
        const normalizedHash = Math.abs(hashCode % 30);
        const dummyValue = parseFloat((15 + normalizedHash).toFixed(1));

        return [{
            year: 2022, // Assuming latest common data year
            value: dummyValue,
            country: { value: countryCode }
        }];
    }

    try {
        // Determine user's local year (approx) to limit range if needed, 
        // but WB defaults are usually fine. Let's fetch last 10 years.
        const response = await fetch(
            `${BASE_URL}/country/${countryCode}/indicator/${indicator}?format=json&per_page=10&mrnev=1`
        );

        // mrnev=1 gets most recent non-empty value. 
        // To get time series, use date range or per_page.
        // For the dashboard, we probably want the latest value for the "Status", 
        // and time series for the "Comparison".

        // Let's create a separate function for time series.

        // For this generic fetch, let's just get the last 20 years
        const timeSeriesResponse = await fetch(
            `${BASE_URL}/country/${countryCode}/indicator/${indicator}?format=json&per_page=20`
        );

        const data = await timeSeriesResponse.json();

        if (isValidResponse(data)) {
            const cleanData = data[1].map(item => ({
                year: item.date,
                value: item.value,
                country: item.country.value
            })).filter(item => item.value !== null).reverse(); // Sort by year asc

            sessionStorage.setItem(cacheKey, JSON.stringify(cleanData));
            return cleanData;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching data for ${countryCode} ${indicator}:`, error);
        return [];
    }
};

/**
 * Fetches latest available data for all defined indicators for a country
 */
export const fetchCountryDebtData = async (countryCode) => {
    const promises = Object.entries(INDICATORS).map(async ([key, indicatorCode]) => {
        const data = await fetchIndicatorData(countryCode, indicatorCode);
        // Get latest value
        const latest = data.length > 0 ? data[data.length - 1] : null;
        return {
            [key]: latest ? latest.value : null,
            [`${key}_YEAR`]: latest ? latest.year : null,
            [`${key}_SERIES`]: data
        };
    });

    const results = await Promise.all(promises);
    return results.reduce((acc, curr) => ({ ...acc, ...curr }), { countryCode });
};
