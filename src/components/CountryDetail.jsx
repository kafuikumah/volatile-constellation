import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, AlertCircle, Landmark, Percent, Clock, CheckCircle, Loader } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, Treemap } from 'recharts';
import { fetchCountryDebtData } from '../services/worldBankApi';
import { fetchQualitativeData, getQualitativeLevel } from '../services/qualitativeData';
import { fetchDebtCompositionData } from '../services/debtCompositionData';
import { getCountryOverallRisk, getRiskColor } from '../utils/debtModel';
import { AU_MEMBER_STATES } from '../utils/countries';
import { getCreditorData, CREDITOR_TYPES, CREDITOR_COLORS } from '../data/creditorData';
import RiskIndicator from './RiskIndicator';

const COLORS = {
    external: '#0071E3', // Apple Blue
    domestic: '#34C759', // Apple Green
    bilateral: '#5856D6', // Apple Indigo
    multilateral: '#FF9500', // Apple Orange
    commercial: '#FF3B30', // Apple Red
    bonds: '#30B0C7', // Apple Teal
    loans: '#AF52DE', // Apple Purple
    other: '#8E8E93'  // Apple Gray
};

// Creditor Analysis Section Component
const CreditorAnalysisSection = ({ countryCode }) => {
    const [chartView, setChartView] = useState('pie');
    const data = getCreditorData(countryCode);

    const pieData = data.composition.map(c => ({
        name: CREDITOR_TYPES[c.type],
        value: c.pct,
        amount: c.amount,
        color: CREDITOR_COLORS[c.type]
    }));

    const RestructuringBadge = ({ status }) => {
        if (!status) return null;
        const config = {
            IN_PROGRESS: { color: '#f59e0b', bg: '#fffbeb', icon: Loader, text: 'Restructuring In Progress' },
            COMPLETED: { color: '#22c55e', bg: '#f0fdf4', icon: CheckCircle, text: 'Restructuring Completed' }
        };
        const { color, bg, icon: Icon, text } = config[status.status] || {};
        return (
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                background: bg,
                border: `1px solid ${color}30`,
                fontSize: 12,
                fontWeight: 600,
                color
            }}>
                <Icon size={14} />
                {text}
            </div>
        );
    };

    return (
        <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Landmark size={24} color="var(--color-accent)" />
                Creditor Composition & Lending Terms
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Creditor Composition Chart */}
                <div style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Debt by Creditor Type</h3>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {['pie', 'bar'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setChartView(v)}
                                    style={{
                                        padding: '4px 12px',
                                        fontSize: 11,
                                        borderRadius: 6,
                                        border: chartView === v ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                        background: chartView === v ? 'var(--color-accent)' : 'white',
                                        color: chartView === v ? 'white' : '#666',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ResponsiveContainer width="55%" height={220}>
                            {chartView === 'pie' ? (
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={75}
                                        paddingAngle={2}
                                    >
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val, name, props) => [`${val}% ($${props.payload.amount}B)`, name]}
                                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                    />
                                </PieChart>
                            ) : (
                                <BarChart data={pieData} layout="vertical">
                                    <XAxis type="number" tickFormatter={v => `${v}%`} fontSize={10} />
                                    <YAxis type="category" dataKey="name" width={90} fontSize={9} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Bar>
                                    <Tooltip formatter={v => `${v}%`} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>

                        <div style={{ flex: 1 }}>
                            {pieData.map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 6,
                                    fontSize: 11
                                }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                                    <span style={{ flex: 1, color: '#555' }}>{item.name}</span>
                                    <span style={{ fontWeight: 600 }}>{item.value}%</span>
                                </div>
                            ))}
                            <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid var(--color-border)', fontSize: 12 }}>
                                <strong>Total: ${data.totalDebt.toFixed(1)}B</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Terms */}
                <div style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>
                        Average Lending Terms
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                        {[
                            { icon: Percent, label: 'Interest Rate', value: `${data.loanTerms.avgInterestRate}%`, color: '#ef4444' },
                            { icon: Clock, label: 'Maturity', value: `${data.loanTerms.avgMaturity} yrs`, color: '#3b82f6' },
                            { icon: Clock, label: 'Grace Period', value: `${data.loanTerms.avgGracePeriod} yrs`, color: '#22c55e' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: `${item.color}10`,
                                borderRadius: 12,
                                padding: 14,
                                textAlign: 'center'
                            }}>
                                <item.icon size={18} color={item.color} style={{ marginBottom: 6 }} />
                                <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{item.value}</div>
                                <div style={{ fontSize: 10, color: '#666' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Restructuring Status */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8 }}>
                            Debt Restructuring Status
                        </div>
                        {data.restructuringStatus ? (
                            <div>
                                <RestructuringBadge status={data.restructuringStatus} />
                                <div style={{ marginTop: 10, fontSize: 11, color: '#666' }}>
                                    <p style={{ margin: '3px 0' }}>Framework: {data.restructuringStatus.framework}</p>
                                    <p style={{ margin: '3px 0' }}>Started: {data.restructuringStatus.startDate}</p>
                                    {data.restructuringStatus.completedDate && (
                                        <p style={{ margin: '3px 0' }}>Completed: {data.restructuringStatus.completedDate}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                fontSize: 12,
                                color: '#22c55e',
                                background: '#f0fdf4',
                                padding: '8px 12px',
                                borderRadius: 8,
                                display: 'inline-block'
                            }}>
                                ✓ No active restructuring
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Unified Compact Debt Analysis Section with 2x2 grid layout
const CompactDebtAnalysisSection = ({ countryCode }) => {
    const [compositionData, setCompositionData] = useState(null);
    const creditorData = getCreditorData(countryCode);

    useEffect(() => {
        const data = fetchDebtCompositionData(countryCode);
        setCompositionData(data);
    }, [countryCode]);

    if (!compositionData) return null;

    // Treemap data for creditor types
    const creditorTreeData = creditorData.composition.map(c => ({
        name: CREDITOR_TYPES[c.type],
        size: c.pct,
        amount: c.amount,
        fill: CREDITOR_COLORS[c.type]
    }));

    // Instrument type data from composition
    const instrumentTreeData = (compositionData.external?.byInstrument || [
        { name: 'Bonds', value: 45 },
        { name: 'Loans', value: 40 },
        { name: 'Other', value: 15 }
    ]).map((d, i) => ({
        name: d.name,
        size: d.value,
        fill: [COLORS.bonds, COLORS.loans, COLORS.other][i]
    }));

    const cardStyle = {
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    };

    const titleStyle = {
        margin: '0 0 0.75rem 0',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#1a1a2e'
    };

    const SmallPieChart = ({ data, colors, height = 140 }) => (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                >
                    {data.map((entry, i) => (
                        <Cell key={i} fill={colors[i % colors.length] || entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11, borderRadius: 6 }} />
            </PieChart>
        </ResponsiveContainer>
    );

    const Legend = ({ items }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color || item.fill, flexShrink: 0 }} />
                    <span style={{ flex: 1, color: '#555' }}>{item.name}</span>
                    <span style={{ fontWeight: 600 }}>{item.value || item.size}%</span>
                </div>
            ))}
        </div>
    );

    // Custom Treemap content renderer
    const CustomTreemapContent = ({ x, y, width, height, name, size, fill }) => {
        if (width < 30 || height < 25) return null;
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} style={{ fill, stroke: '#fff', strokeWidth: 2 }} rx={4} />
                <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>
                    {name?.length > 12 ? name.slice(0, 10) + '...' : name}
                </text>
                <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={11} fontWeight={700}>
                    {size}%
                </text>
            </g>
        );
    };

    return (
        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
                marginBottom: '1rem',
                fontSize: '1.25rem',
                borderBottom: '2px solid var(--color-border)',
                paddingBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10
            }}>
                <Landmark size={22} color="var(--color-accent)" />
                Debt Composition & Creditor Analysis
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Card 1: External vs Domestic - PIE CHART */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>External vs Domestic Debt</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <SmallPieChart
                            data={compositionData.composition}
                            colors={[COLORS.external, COLORS.domestic]}
                        />
                        <Legend items={compositionData.composition.map((c, i) => ({
                            ...c,
                            color: i === 0 ? COLORS.external : COLORS.domestic
                        }))} />
                    </div>
                </div>

                {/* Card 2: Creditor Type Breakdown - TREEMAP */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>By Creditor Type</h3>
                    <ResponsiveContainer width="100%" height={140}>
                        <Treemap
                            data={creditorTreeData}
                            dataKey="size"
                            aspectRatio={4 / 3}
                            content={<CustomTreemapContent />}
                        />
                    </ResponsiveContainer>
                </div>

                {/* Card 3: Instrument Type Breakdown - TREEMAP */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>By Instrument Type</h3>
                    <ResponsiveContainer width="100%" height={140}>
                        <Treemap
                            data={instrumentTreeData}
                            dataKey="size"
                            aspectRatio={4 / 3}
                            content={<CustomTreemapContent />}
                        />
                    </ResponsiveContainer>
                </div>

                {/* Card 4: Average Lending Terms */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>Average Lending Terms (External)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                        {[
                            { icon: Percent, label: 'Interest', value: `${creditorData.loanTerms.avgInterestRate}%`, color: '#ef4444' },
                            { icon: Clock, label: 'Maturity', value: `${creditorData.loanTerms.avgMaturity}yr`, color: '#3b82f6' },
                            { icon: Clock, label: 'Grace', value: `${creditorData.loanTerms.avgGracePeriod}yr`, color: '#22c55e' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: `${item.color}10`,
                                borderRadius: 8,
                                padding: '8px 6px',
                                textAlign: 'center'
                            }}>
                                <item.icon size={14} color={item.color} style={{ marginBottom: 4 }} />
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{item.value}</div>
                                <div style={{ fontSize: 9, color: '#666' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Restructuring Status */}
                    <div style={{
                        fontSize: 10,
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: creditorData.restructuringStatus ? '#fffbeb' : '#f0fdf4',
                        color: creditorData.restructuringStatus ? '#92400e' : '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        {creditorData.restructuringStatus ? (
                            <>
                                <Loader size={12} />
                                Restructuring: {creditorData.restructuringStatus.framework}
                            </>
                        ) : (
                            <>
                                <CheckCircle size={12} />
                                No active restructuring
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};


const CountryDetail = () => {
    const { countryCode } = useParams();
    const navigate = useNavigate();
    const [quantData, setQuantData] = useState(null);
    const [qualData, setQualData] = useState(null);
    const [loading, setLoading] = useState(true);

    const country = AU_MEMBER_STATES.find(c => c.code === countryCode);
    const countryName = country?.name || countryCode;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            // Load quantitative data
            const quant = await fetchCountryDebtData(countryCode);
            setQuantData(quant);

            // Load qualitative data
            const allQual = await fetchQualitativeData();
            const qual = allQual.find(c => c.countryCode === countryCode);
            setQualData(qual);

            setLoading(false);
        };

        if (countryCode) {
            loadData();
        }
    }, [countryCode]);

    if (loading || !quantData) {
        return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading country data...</div>;
    }

    const overallRisk = getCountryOverallRisk(quantData);
    const riskColor = getRiskColor(overallRisk);

    const formatCurrency = (val) => {
        if (!val) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 2
        }).format(val);
    };

    const formatPercent = (val) => {
        if (!val && val !== 0) return 'N/A';
        return `${val.toFixed(1)}%`;
    };

    const RatingCell = ({ rating, indicatorId }) => {
        const level = getQualitativeLevel(rating);
        const color = getRiskColor(level);

        const content = (
            <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                backgroundColor: `${color}20`,
                color: color,
                fontWeight: '600',
                fontSize: '0.95rem',
                border: `2px solid ${color}`,
                cursor: indicatorId ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
            }}
                onMouseEnter={(e) => {
                    if (indicatorId) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
                    }
                }}
                onMouseLeave={(e) => {
                    if (indicatorId) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                    }
                }}
            >
                {rating}
                {indicatorId && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>→</span>}
            </div>
        );

        if (indicatorId) {
            return (
                <Link to={`/qualitative-indicator/${indicatorId}/${countryCode}`} style={{ textDecoration: 'none' }}>
                    {content}
                </Link>
            );
        }

        return content;
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>{countryName}</h1>
                </div>
                <RiskIndicator riskLevel={overallRisk} size="large" />
            </div>

            {/* Quantitative Indicators Section - NOW ON TOP */}
            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    Debt Indicators (Quantitative)
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div className="stat-card border-blue">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <DollarSign size={20} color="var(--color-accent)" />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                                Total Debt Stock
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                            {formatCurrency(quantData.EXTERNAL_DEBT_STOCKS)}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            Year: {quantData.EXTERNAL_DEBT_STOCKS_YEAR || 'N/A'}
                        </span>
                    </div>

                    <div className="stat-card border-blue">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <TrendingUp size={20} color="var(--color-accent)" />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                                Debt to GDP
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'var(--color-accent)' }}>
                            {formatPercent(quantData.EXTERNAL_DEBT_GNI_PCT)}
                        </p>
                    </div>

                    <div className="stat-card border-yellow">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <TrendingUp size={20} color="var(--color-warning)" />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                                Debt to Exports
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'var(--color-warning)' }}>
                            {formatPercent(quantData.EXTERNAL_DEBT_EXPORTS_PCT)}
                        </p>
                    </div>

                    <div className="stat-card border-orange">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <TrendingDown size={20} color="var(--color-orange)" />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                                Debt Svc / Exports
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'var(--color-orange)' }}>
                            {formatPercent(quantData.DEBT_SERVICE_EXPORTS_PCT)}
                        </p>
                    </div>

                    <div className="stat-card border-red">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <AlertCircle size={20} color="var(--color-danger)" />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                                Debt Svc / Revenue*
                            </h3>
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'var(--color-danger)' }}>
                            {formatPercent(quantData.DEBT_SERVICE_REVENUE_PCT)}
                        </p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                            *Simulated data
                        </span>
                    </div>
                </div>
            </section>

            {/* Debt Composition & Creditor Analysis - Compact 2x2 Grid */}
            <CompactDebtAnalysisSection countryCode={countryCode} />

            {/* Qualitative Metrics Section */}
            <section>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    CAP Pillar 2: Debt Management Quality
                </h2>

                {qualData ? (
                    <div style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '12px',
                        padding: '2rem',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div>
                                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    Data Dissemination
                                </h4>
                                <RatingCell rating={qualData.dataDissemination} indicatorId="DATA_DISSEMINATION" />
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Click for methodology</div>
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    Debt Strategy (MTDS)
                                </h4>
                                <RatingCell rating={qualData.debtStrategy} indicatorId="DEBT_STRATEGY" />
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Click for methodology</div>
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    Borrowing Plan
                                </h4>
                                <RatingCell rating={qualData.borrowingPlan} indicatorId="BORROWING_PLAN" />
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Click for methodology</div>
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                    Domestic Market Dev.
                                </h4>
                                <RatingCell rating={qualData.domesticMarket} indicatorId="DOMESTIC_MARKET" />
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Click for methodology</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        No qualitative data available
                    </div>
                )}
            </section>
        </div>
    );
};

export default CountryDetail;
