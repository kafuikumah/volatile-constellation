import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertCircle, CheckCircle, TrendingUp, Eye, Bell, X, ArrowRight } from 'lucide-react';
import { AU_MEMBER_STATES } from '../utils/countries';
import { fetchCountryDebtData } from '../services/worldBankApi';
import { getCountryOverallRisk } from '../utils/debtModel';
import { DSA_THRESHOLDS } from '../utils/debtProjections';

// IMF/World Bank DSA Thresholds for reference display
const THRESHOLD_CATEGORIES = [
    {
        name: 'Debt-to-GDP Ratio',
        key: 'debtToGDP',
        thresholds: DSA_THRESHOLDS.DEBT_TO_GDP,
        description: 'Present value of external debt as % of GDP'
    },
    {
        name: 'Debt Service to Exports',
        key: 'debtServiceExports',
        thresholds: DSA_THRESHOLDS.DEBT_SERVICE_TO_EXPORTS,
        description: 'Annual debt service as % of exports'
    },
    {
        name: 'Debt Service to Revenue',
        key: 'debtServiceRevenue',
        thresholds: DSA_THRESHOLDS.DEBT_SERVICE_TO_REVENUE,
        description: 'Annual debt service as % of government revenue'
    }
];

const RiskBadge = ({ level }) => {
    const config = {
        HIGH: { color: '#ef4444', bg: '#fef2f2', icon: AlertTriangle, label: 'High Risk' },
        MODERATE: { color: '#f59e0b', bg: '#fffbeb', icon: AlertCircle, label: 'Moderate' },
        LOW: { color: '#22c55e', bg: '#f0fdf4', icon: CheckCircle, label: 'Low Risk' }
    };
    const { color, bg, icon: Icon, label } = config[level] || config.LOW;

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 20,
            background: bg,
            border: `1px solid ${color}30`,
            fontSize: 11,
            fontWeight: 600,
            color
        }}>
            <Icon size={12} />
            {label}
        </div>
    );
};

const TrafficLight = ({ level }) => {
    const colors = { HIGH: '#ef4444', MODERATE: '#f59e0b', LOW: '#22c55e' };
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: 6,
            background: '#1a1a2e',
            borderRadius: 8
        }}>
            {['HIGH', 'MODERATE', 'LOW'].map(l => (
                <div key={l} style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: l === level ? colors[l] : '#333',
                    boxShadow: l === level ? `0 0 8px ${colors[l]}` : 'none',
                    transition: 'all 0.3s'
                }} />
            ))}
        </div>
    );
};

// Threshold Analysis Modal Component
const ThresholdModal = ({ country, data, onClose }) => {
    const debtToGDP = data.EXTERNAL_DEBT_GNI_PCT || 0;
    const debtServiceExports = data.DEBT_SERVICE_EXPORTS_PCT || 0;
    const debtServiceRevenue = data.DEBT_SERVICE_REVENUE_PCT || 0;

    const getThresholdStatus = (value, thresholds) => {
        if (value >= thresholds.HIGH_RISK) return { status: 'BREACH', color: '#ef4444', bg: '#fef2f2' };
        if (value >= thresholds.MODERATE_RISK) return { status: 'WARNING', color: '#f59e0b', bg: '#fffbeb' };
        return { status: 'SAFE', color: '#22c55e', bg: '#f0fdf4' };
    };

    const metrics = [
        {
            name: 'Debt-to-GDP Ratio',
            value: debtToGDP,
            thresholds: DSA_THRESHOLDS.DEBT_TO_GDP,
            description: 'IMF/WB threshold for low-income countries'
        },
        {
            name: 'Debt Service / Exports',
            value: debtServiceExports,
            thresholds: DSA_THRESHOLDS.DEBT_SERVICE_TO_EXPORTS,
            description: 'Annual debt obligations relative to export earnings'
        },
        {
            name: 'Debt Service / Revenue',
            value: debtServiceRevenue,
            thresholds: DSA_THRESHOLDS.DEBT_SERVICE_TO_REVENUE,
            description: 'Fiscal burden of debt relative to government income'
        }
    ];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                borderRadius: 20,
                width: '100%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{country.name}</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#888' }}>
                            IMF/World Bank DSA Threshold Analysis
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 8,
                            borderRadius: 8
                        }}
                    >
                        <X size={20} color="#888" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 24 }}>
                    {/* Overall Risk */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 24,
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Overall Debt Distress Risk</div>
                        <RiskBadge level={getCountryOverallRisk(data)} />
                    </div>

                    {/* Threshold Analysis */}
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Threshold Analysis</h3>

                    {metrics.map((metric, i) => {
                        const { status, color, bg } = getThresholdStatus(metric.value, metric.thresholds);
                        const percentOfThreshold = (metric.value / metric.thresholds.HIGH_RISK) * 100;

                        return (
                            <div key={i} style={{
                                background: bg,
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 12,
                                border: `1px solid ${color}30`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{metric.name}</div>
                                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{metric.description}</div>
                                    </div>
                                    <div style={{
                                        padding: '4px 10px',
                                        borderRadius: 12,
                                        background: color,
                                        color: 'white',
                                        fontSize: 11,
                                        fontWeight: 600
                                    }}>
                                        {status}
                                    </div>
                                </div>

                                {/* Value vs Thresholds */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ fontSize: 24, fontWeight: 700, color }}>{metric.value.toFixed(1)}%</div>
                                    <div style={{ flex: 1 }}>
                                        {/* Progress bar */}
                                        <div style={{
                                            height: 8,
                                            background: '#e5e7eb',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.min(percentOfThreshold, 100)}%`,
                                                background: color,
                                                borderRadius: 4,
                                                transition: 'width 0.5s ease'
                                            }} />
                                            {/* Threshold markers */}
                                            <div style={{
                                                position: 'absolute',
                                                left: `${(metric.thresholds.LOW_RISK / metric.thresholds.HIGH_RISK) * 100}%`,
                                                top: 0,
                                                bottom: 0,
                                                width: 2,
                                                background: '#22c55e'
                                            }} />
                                            <div style={{
                                                position: 'absolute',
                                                left: `${(metric.thresholds.MODERATE_RISK / metric.thresholds.HIGH_RISK) * 100}%`,
                                                top: 0,
                                                bottom: 0,
                                                width: 2,
                                                background: '#f59e0b'
                                            }} />
                                        </div>
                                        {/* Threshold labels */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#888' }}>
                                            <span>0%</span>
                                            <span style={{ color: '#22c55e' }}>Low: {metric.thresholds.LOW_RISK}%</span>
                                            <span style={{ color: '#f59e0b' }}>Mod: {metric.thresholds.MODERATE_RISK}%</span>
                                            <span style={{ color: '#ef4444' }}>High: {metric.thresholds.HIGH_RISK}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* IMF/WB Reference */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: 12,
                        padding: 16,
                        marginTop: 20,
                        fontSize: 11,
                        color: '#666'
                    }}>
                        <strong>Source:</strong> IMF/World Bank Debt Sustainability Framework for Low-Income Countries (LIC DSF).
                        Thresholds vary based on Country Policy and Institutional Assessment (CPIA) scores.
                        Values shown are for countries with medium policy performance.
                    </div>
                </div>
            </div>
        </div>
    );
};

const CountryRiskRow = ({ country, data, rank, onDetailsClick }) => {
    const risk = getCountryOverallRisk(data);
    const debtToGDP = data.EXTERNAL_DEBT_GNI_PCT || 0;
    const debtService = data.DEBT_SERVICE_EXPORTS_PCT || 0;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 100px 80px 80px 100px',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: rank % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
            borderRadius: 8,
            transition: 'background 0.2s',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = rank % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'}
        >
            <TrafficLight level={risk} />
            <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{country.name}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{country.code}</div>
            </div>
            <RiskBadge level={risk} />
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{debtToGDP.toFixed(1)}%</div>
                <div style={{ fontSize: 10, color: '#999' }}>Debt/GDP</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{debtService.toFixed(1)}%</div>
                <div style={{ fontSize: 10, color: '#999' }}>Svc/Exp</div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDetailsClick(country, data);
                    }}
                    style={{
                        padding: '6px 12px',
                        fontSize: 11,
                        borderRadius: 6,
                        border: '1px solid var(--color-accent)',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: 'var(--color-accent)',
                        fontWeight: 500,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-accent)';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = 'var(--color-accent)';
                    }}
                >
                    <Eye size={12} /> Details
                </button>
            </div>
        </div>
    );
};

const EarlyWarningPanel = () => {
    const navigate = useNavigate();
    const [countryData, setCountryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const results = await Promise.all(
                AU_MEMBER_STATES.map(c =>
                    fetchCountryDebtData(c.code).then(d => ({ country: c, data: d }))
                )
            );
            // Sort by risk level
            results.sort((a, b) => {
                const order = { HIGH: 0, MODERATE: 1, LOW: 2 };
                return order[getCountryOverallRisk(a.data)] - order[getCountryOverallRisk(b.data)];
            });
            setCountryData(results);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleDetailsClick = (country, data) => {
        setSelectedCountry({ country, data });
    };

    const filteredData = filter === 'ALL'
        ? countryData
        : countryData.filter(c => getCountryOverallRisk(c.data) === filter);

    const stats = {
        HIGH: countryData.filter(c => getCountryOverallRisk(c.data) === 'HIGH').length,
        MODERATE: countryData.filter(c => getCountryOverallRisk(c.data) === 'MODERATE').length,
        LOW: countryData.filter(c => getCountryOverallRisk(c.data) === 'LOW').length
    };

    return (
        <div style={{ padding: '0 0 2rem 0' }}>
            {/* Modal */}
            {selectedCountry && (
                <ThresholdModal
                    country={selectedCountry.country}
                    data={selectedCountry.data}
                    onClose={() => setSelectedCountry(null)}
                />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Bell size={24} color="#ef4444" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Early Warning System</h2>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 24
            }}>
                {[
                    { level: 'HIGH', label: 'High Risk', color: '#ef4444', bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' },
                    { level: 'MODERATE', label: 'Moderate Risk', color: '#f59e0b', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' },
                    { level: 'LOW', label: 'Low Risk', color: '#22c55e', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }
                ].map(item => (
                    <div
                        key={item.level}
                        onClick={() => setFilter(filter === item.level ? 'ALL' : item.level)}
                        style={{
                            background: item.bg,
                            borderRadius: 16,
                            padding: 20,
                            cursor: 'pointer',
                            border: filter === item.level ? `2px solid ${item.color}` : '2px solid transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: 36, fontWeight: 700, color: item.color }}>
                            {stats[item.level]}
                        </div>
                        <div style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>
                            {item.label} Countries
                        </div>
                    </div>
                ))}
            </div>

            {/* Watchlist Table */}
            <div style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: 20,
                padding: 20,
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16
                }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                        Country Risk Watchlist
                        {filter !== 'ALL' && (
                            <span style={{
                                marginLeft: 8,
                                fontSize: 11,
                                color: 'var(--color-accent)',
                                cursor: 'pointer'
                            }} onClick={() => setFilter('ALL')}>
                                (Clear filter)
                            </span>
                        )}
                    </h3>
                    <div style={{ fontSize: 12, color: '#888' }}>
                        Showing {filteredData.length} of {countryData.length} countries
                    </div>
                </div>

                {/* Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 100px 80px 80px 100px',
                    gap: 12,
                    padding: '8px 16px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: '1px solid var(--color-border)'
                }}>
                    <div>Status</div>
                    <div>Country</div>
                    <div>Risk Level</div>
                    <div style={{ textAlign: 'right' }}>Debt/GDP</div>
                    <div style={{ textAlign: 'right' }}>Svc/Exp</div>
                    <div style={{ textAlign: 'right' }}>Action</div>
                </div>

                {/* Rows */}
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading...</div>
                    ) : (
                        filteredData.map((item, i) => (
                            <CountryRiskRow
                                key={item.country.code}
                                country={item.country}
                                data={item.data}
                                rank={i}
                                onDetailsClick={handleDetailsClick}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EarlyWarningPanel;
