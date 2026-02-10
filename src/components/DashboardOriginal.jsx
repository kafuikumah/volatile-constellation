import React, { useEffect, useState } from 'react';
import { AU_MEMBER_STATES } from '../utils/countries';
import { fetchCountryDebtData } from '../services/worldBankApi';
import { getCountryOverallRisk } from '../utils/debtModel';
import MapVisualization from './MapVisualization';
import { useCountUp } from '../hooks/useCountUp';

// Original Animated Stat Card Component with Hover Effects
const AnimatedStatCard = ({ title, value, suffix = '', prefix = '', color, borderClass, formatAsCurrency = false, loading }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Use CountUp hook for animation - starts when value changes from 0
    const animatedValue = useCountUp(loading ? 0 : value, 2000);

    // Format the displayed value
    const displayValue = formatAsCurrency
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(animatedValue)
        : `${prefix}${animatedValue.toFixed(1)}${suffix}`;

    return (
        <div
            className={`stat-card ${borderClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: isHovered ? 'scale(1.03) translateY(-2px)' : 'scale(1) translateY(0)',
                boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-md)',
                transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease',
                cursor: 'pointer'
            }}
        >
            <h3 style={{
                margin: 0,
                color: 'var(--color-text-secondary)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0.5rem 0 0 0',
                color: color,
                transition: 'transform 0.2s ease',
                fontFamily: 'var(--font-display)'
            }}>
                {loading ? '...' : displayValue}
            </p>
        </div>
    );
};

/**
 * ORIGINAL DASHBOARD - 2-Column Layout
 * Left: Map (2/3 width)
 * Right: Stat cards stacked vertically (1/3 width)
 */
const DashboardOriginal = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            const results = await Promise.all(AU_MEMBER_STATES.map(c =>
                fetchCountryDebtData(c.code).then(d => ({ ...d, countryName: c.name }))
            ));

            setData(results);
            setLoading(false);
        };

        loadAllData();
    }, []);

    // Aggregated Stats
    const totalDebt = data.reduce((acc, curr) => acc + (curr.EXTERNAL_DEBT_STOCKS || 0), 0);
    const avgDebtGNI = data.reduce((acc, curr) => acc + (curr.EXTERNAL_DEBT_GNI_PCT || 0), 0) / (data.length || 1);
    const avgDebtService = data.reduce((acc, curr) => acc + (curr.DEBT_SERVICE_EXPORTS_PCT || 0), 0) / (data.length || 1);
    const avgDebtRevenue = data.reduce((acc, curr) => acc + (curr.DEBT_SERVICE_REVENUE_PCT || 0), 0) / (data.length || 1);

    return (
        <div className="dashboard" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>

            <div style={{ flex: 1, display: 'flex', gap: '2rem', height: '100%', overflow: 'hidden' }}>

                {/* LEFT COLUMN: Map (2/3) */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                    <div style={{
                        flex: 1,
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                        padding: '1.5rem',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                        position: 'relative'
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontWeight: 600 }}>Sovereign Debt Risk Map</h3>
                        <div style={{ height: 'calc(100% - 40px)', width: '100%' }}>
                            <MapVisualization />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Indicators (1/3) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>

                    <AnimatedStatCard
                        title="Total External Debt"
                        value={totalDebt}
                        color="var(--color-text-primary)"
                        borderClass="border-blue"
                        formatAsCurrency={true}
                        loading={loading}
                    />

                    <AnimatedStatCard
                        title="Avg. Debt % GDP"
                        value={avgDebtGNI}
                        suffix="%"
                        color="var(--color-warning)"
                        borderClass="border-yellow"
                        loading={loading}
                    />

                    <AnimatedStatCard
                        title="Avg. Service / Exports"
                        value={avgDebtService}
                        suffix="%"
                        color="var(--color-orange)"
                        borderClass="border-orange"
                        loading={loading}
                    />

                    <AnimatedStatCard
                        title="Debt Svc / Revenue"
                        value={avgDebtRevenue}
                        suffix="%"
                        color="var(--color-danger)"
                        borderClass="border-red"
                        loading={loading}
                    />

                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.85rem'
                    }}>
                        <strong>Note:</strong> Risk classification based on IMF/WB thresholds. "Debt Svc / Revenue" is simulated data.
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DashboardOriginal;
