/**
 * CAP Pillar 2: Qualitative Indicator Methodology Data
 * Provides scoring criteria, justifications, and assessment methodology for each qualitative indicator.
 */

// Qualitative indicator definitions with methodology
export const QUALITATIVE_INDICATORS = {
    DATA_DISSEMINATION: {
        id: 'DATA_DISSEMINATION',
        name: 'Data Dissemination',
        category: 'Transparency & Reporting',
        description: 'Measures the completeness, timeliness, and public availability of government debt statistics.',
        methodology: `
Assessment is based on the following criteria:
1. **Publication Frequency**: Monthly, quarterly, or annual debt bulletins
2. **Data Completeness**: Coverage of external and domestic debt by creditor, instrument, and currency
3. **Timeliness**: Publication lag from period end (< 3 months is optimal)
4. **Accessibility**: Public availability through Ministry of Finance or Central Bank websites
5. **Standards Compliance**: Adherence to IMF SDDS/GDSS or World Bank DeMPA standards
        `.trim(),
        scoringCriteria: [
            { rating: 'Strong', description: 'Publishes monthly/quarterly bulletins with comprehensive breakdown within 3 months. Adheres to SDDS standards. Data is easily accessible online.' },
            { rating: 'Adequate', description: 'Publishes at least annual debt reports. Some gaps in coverage or timeliness (3-6 month lag). Basic online presence.' },
            { rating: 'Weak', description: 'Irregular or no public debt reporting. Significant data gaps. Publication lag exceeds 6 months or no online availability.' }
        ],
        keyQuestions: [
            'Does the country publish regular debt statistical bulletins?',
            'Is there a centralized debt database accessible to the public?',
            'What is the typical publication lag?',
            'Does the data cover both external and domestic debt comprehensively?'
        ],
        referenceFramework: 'World Bank Debt Management Performance Assessment (DeMPA) - DPI 1.1'
    },
    DEBT_STRATEGY: {
        id: 'DEBT_STRATEGY',
        name: 'Debt Strategy (MTDS)',
        category: 'Strategic Planning',
        description: 'Evaluates the existence, quality, and implementation of a Medium-Term Debt Management Strategy.',
        methodology: `
Assessment is based on:
1. **Existence**: Formal MTDS document developed and approved
2. **Quality**: Use of quantitative models, scenario analysis, and cost-risk trade-off frameworks
3. **Publication**: Strategy is publicly available
4. **Alignment**: Linked to macroeconomic/fiscal framework
5. **Implementation**: Evidence of actual borrowing decisions aligned with strategy
        `.trim(),
        scoringCriteria: [
            { rating: 'Strong', description: 'Published MTDS covering 3-5 years with quantitative cost-risk analysis. Regular updates (at least every 2 years). Clear link between strategy and borrowing decisions.' },
            { rating: 'Adequate', description: 'MTDS exists but may lack rigorous quantitative analysis. Updates are irregular. Some disconnect between strategy and actual borrowing.' },
            { rating: 'Weak', description: 'No formal MTDS or outdated strategy (>5 years). Borrowing decisions appear ad-hoc without strategic framework.' }
        ],
        keyQuestions: [
            'Does the country have a published MTDS document?',
            'When was it last updated?',
            'Does it include quantitative cost-risk analysis?',
            'Is there evidence of implementation in borrowing patterns?'
        ],
        referenceFramework: 'IMF/World Bank Medium-Term Debt Management Strategy Framework'
    },
    BORROWING_PLAN: {
        id: 'BORROWING_PLAN',
        name: 'Borrowing Plan',
        category: 'Operational Planning',
        description: 'Assesses the publication and quality of an Annual Borrowing Plan that guides debt issuance.',
        methodology: `
Assessment is based on:
1. **Publication**: Annual Borrowing Plan made public before fiscal year
2. **Comprehensiveness**: Covers domestic and external borrowing, instruments, maturities
3. **Consistency**: Aligned with budget financing needs and MTDS
4. **Transparency**: Includes auction calendar for domestic securities
5. **Execution Reporting**: Comparison of planned vs. actual borrowing
        `.trim(),
        scoringCriteria: [
            { rating: 'Strong', description: 'Published ABP with detailed instrument breakdown. Auction calendar provided. Regular reporting on execution against plan.' },
            { rating: 'Adequate', description: 'ABP exists but with limited detail. Auction schedules may be published but not comprehensively. Limited execution reporting.' },
            { rating: 'Weak', description: 'No formal ABP or not publicly available. Borrowing appears opportunistic without clear advance planning.' }
        ],
        keyQuestions: [
            'Is an Annual Borrowing Plan published?',
            'Does it include an auction calendar?',
            'Is there reporting on actual vs. planned borrowing?',
            'Is the plan aligned with the MTDS?'
        ],
        referenceFramework: 'World Bank DeMPA - DPI 2.2 and DPI 3.1'
    },
    DOMESTIC_MARKET: {
        id: 'DOMESTIC_MARKET',
        name: 'Domestic Market Development',
        category: 'Market Infrastructure',
        description: 'Evaluates efforts to develop a deep, liquid, and efficient domestic government securities market.',
        methodology: `
Assessment is based on:
1. **Market Infrastructure**: Primary dealers, benchmark issuance, yield curve development
2. **Instrument Diversity**: T-bills, bonds of various tenors, inflation-linked securities
3. **Investor Base**: Diversification beyond captive investors (banks, pension funds, retail, foreign)
4. **Secondary Market**: Liquidity, turnover ratio, repo market development
5. **Transparency**: Regular communication with market participants
        `.trim(),
        scoringCriteria: [
            { rating: 'Strong', description: 'Well-developed primary dealer system. Regular benchmark issuance across the yield curve. Active secondary market with diverse investor base.' },
            { rating: 'Adequate', description: 'Some market infrastructure in place. Limited tenor range. Secondary market exists but with low liquidity. Investor base concentrated.' },
            { rating: 'Weak', description: 'Underdeveloped market. Irregular issuance. No formal primary dealer system. Secondary market inactive or non-existent.' }
        ],
        keyQuestions: [
            'Is there a primary dealer system?',
            'What is the longest domestic maturity regularly issued?',
            'How active is the secondary market?',
            'How diversified is the investor base?'
        ],
        referenceFramework: 'World Bank/IMF Guidelines for Public Debt Management'
    }
};

/**
 * Get country-specific justification for a rating
 * In a real system, this would come from a database of assessments
 */
export const getCountryJustification = (countryCode, indicatorId, rating) => {
    // Mock justifications based on rating level
    const justifications = {
        Strong: {
            DATA_DISSEMINATION: `${countryCode} publishes comprehensive quarterly debt bulletins within 2 months of period end. Data is available on the Ministry of Finance website and adheres to SDDS standards.`,
            DEBT_STRATEGY: `${countryCode} has a well-developed MTDS (2022-2026) with sophisticated cost-risk modeling. The strategy is regularly reviewed and updated.`,
            BORROWING_PLAN: `${countryCode} publishes an Annual Borrowing Plan with detailed auction calendar. Execution reports are provided quarterly.`,
            DOMESTIC_MARKET: `${countryCode} has an active primary dealer system with 15+ dealers. Regular benchmark issuance out to 20-year maturity with liquid secondary trading.`
        },
        Adequate: {
            DATA_DISSEMINATION: `${countryCode} publishes annual debt reports with some delays (4-5 months). Coverage is reasonable but lacks detailed breakdown by creditor.`,
            DEBT_STRATEGY: `${countryCode} has an MTDS document but it was last updated 3 years ago. Quantitative analysis is limited.`,
            BORROWING_PLAN: `${countryCode} has a borrowing plan but it lacks detail on external borrowing. Auction calendar is published but irregularly updated.`,
            DOMESTIC_MARKET: `${countryCode} has basic market infrastructure. Most issuance is short-term (< 5 years). Secondary market liquidity is limited.`
        },
        Weak: {
            DATA_DISSEMINATION: `${countryCode} does not publish regular debt statistics. Last available data is over 18 months old.`,
            DEBT_STRATEGY: `${countryCode} does not have a formal MTDS. Borrowing decisions appear to be made on an ad-hoc basis.`,
            BORROWING_PLAN: `${countryCode} does not publish an Annual Borrowing Plan. No auction calendar is available.`,
            DOMESTIC_MARKET: `${countryCode} has an underdeveloped domestic market. Most financing comes from external sources or central bank advances.`
        }
    };

    return justifications[rating]?.[indicatorId] || `Assessment based on latest available information for ${countryCode}.`;
};

/**
 * Get indicator by ID
 */
export const getQualitativeIndicatorById = (indicatorId) => {
    return QUALITATIVE_INDICATORS[indicatorId] || null;
};

/**
 * Get all qualitative indicators
 */
export const getAllQualitativeIndicators = () => {
    return Object.values(QUALITATIVE_INDICATORS);
};

/**
 * Map field names to indicator IDs
 */
export const FIELD_TO_INDICATOR_MAP = {
    dataDissemination: 'DATA_DISSEMINATION',
    debtStrategy: 'DEBT_STRATEGY',
    borrowingPlan: 'BORROWING_PLAN',
    domesticMarket: 'DOMESTIC_MARKET'
};
