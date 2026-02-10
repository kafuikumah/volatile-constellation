import React from 'react';
import RiskIndicator from './RiskIndicator';
import { getRiskLevel, getCountryOverallRisk } from '../utils/debtModel';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const CountryCard = ({ countryData, onClick }) => {
    const { countryCode, countryName } = countryData;
    // Fallback to name if not provided in data (data object structure to be defined in Dashboard)
    const name = countryData.countryName || countryCode;

    // Determine overall risk
    const overallRisk = getCountryOverallRisk(countryData);

    // Format Helpers
    const formatCurrency = (val) => {
        if (!val) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(val);
    };

    const formatPercent = (val) => {
        if (!val) return 'N/A';
        return `${val.toFixed(1)}%`;
    };

    return (
        <div
            className="country-card clickable-card"
            onClick={onClick}
            style={{
                position: 'relative'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{name}</h3>
                <RiskIndicator riskLevel={overallRisk} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', rowGap: '1.5rem' }}>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Debt / GDP</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', fontWeight: '600' }}>
                        <DollarSign size={14} />
                        {countryData.EXTERNAL_DEBT_GNI_PCT ? formatPercent(countryData.EXTERNAL_DEBT_GNI_PCT) : 'N/A'}
                    </div>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Debt / Exports</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', fontWeight: '600', color: 'var(--color-warning)' }}>
                        <TrendingUp size={14} />
                        {countryData.EXTERNAL_DEBT_EXPORTS_PCT ? formatPercent(countryData.EXTERNAL_DEBT_EXPORTS_PCT) : 'N/A'}
                    </div>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Svc / Exports</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', fontWeight: '600', color: 'var(--color-orange)' }}>
                        <TrendingUp size={14} />
                        {countryData.DEBT_SERVICE_EXPORTS_PCT ? formatPercent(countryData.DEBT_SERVICE_EXPORTS_PCT) : 'N/A'}
                    </div>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.25rem 0' }}>Svc / Rev*</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', fontWeight: '600', color: 'var(--color-danger)' }}>
                        <TrendingDown size={14} />
                        {countryData.DEBT_SERVICE_REVENUE_PCT ? formatPercent(countryData.DEBT_SERVICE_REVENUE_PCT) : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountryCard;
