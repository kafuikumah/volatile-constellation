import { AU_MEMBER_STATES } from '../utils/countries';

/**
 * Generates realistic debt composition data for a country
 * Structure: External vs Domestic, with drill-downs
 */

const generateExternalBreakdown = () => {
    // By Creditor Type
    const bilateral = 15 + Math.random() * 25; // 15-40%
    const multilateral = 20 + Math.random() * 30; // 20-50%
    const commercial = Math.max(0, 100 - bilateral - multilateral);

    // By Instrument Type
    const bonds = 10 + Math.random() * 30; // 10-40%
    const loans = 40 + Math.random() * 35; // 40-75%
    const other = Math.max(0, 100 - bonds - loans);

    return {
        byCreditor: [
            { name: 'Bilateral', value: parseFloat(bilateral.toFixed(1)) },
            { name: 'Multilateral', value: parseFloat(multilateral.toFixed(1)) },
            { name: 'Commercial', value: parseFloat(commercial.toFixed(1)) }
        ],
        byInstrument: [
            { name: 'Bonds', value: parseFloat(bonds.toFixed(1)) },
            { name: 'Loans', value: parseFloat(loans.toFixed(1)) },
            { name: 'Other', value: parseFloat(other.toFixed(1)) }
        ]
    };
};

const generateDomesticBreakdown = () => {
    const tBills = 20 + Math.random() * 30; // 20-50%
    const bonds = 25 + Math.random() * 30; // 25-55%
    const bankBorrowing = 5 + Math.random() * 15; // 5-20%
    const other = Math.max(0, 100 - tBills - bonds - bankBorrowing);

    return [
        { name: 'Treasury Bills', value: parseFloat(tBills.toFixed(1)) },
        { name: 'Government Bonds', value: parseFloat(bonds.toFixed(1)) },
        { name: 'Bank Borrowing', value: parseFloat(bankBorrowing.toFixed(1)) },
        { name: 'Other', value: parseFloat(other.toFixed(1)) }
    ];
};

export const fetchDebtCompositionData = (countryCode) => {
    // Generate consistent data for each country using code as seed
    const seedValue = countryCode.charCodeAt(0) + countryCode.charCodeAt(1) + countryCode.charCodeAt(2);
    Math.random(); // Advance the random state

    // External vs Domestic split
    const externalPct = 40 + (seedValue % 40); // 40-80%
    const domesticPct = 100 - externalPct;

    const externalBreakdown = generateExternalBreakdown();
    const domesticBreakdown = generateDomesticBreakdown();

    return {
        countryCode,
        composition: [
            { name: 'External Debt', value: parseFloat(externalPct.toFixed(1)), color: '#3b82f6' },
            { name: 'Domestic Debt', value: parseFloat(domesticPct.toFixed(1)), color: '#22c55e' }
        ],
        external: externalBreakdown,
        domestic: domesticBreakdown
    };
};
