import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { BarChart2, TrendingUp, Layers, X } from 'lucide-react';
import { AU_MEMBER_STATES, INDICATORS } from '../utils/countries';
import { fetchIndicatorData } from '../services/worldBankApi';

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#14b8a6', '#f97316'];

const CHART_TYPES = [
    { id: 'line', label: 'Line', icon: TrendingUp },
    { id: 'bar', label: 'Bar', icon: BarChart2 },
    { id: 'area', label: 'Area', icon: Layers }
];

const SCALE_OPTIONS = [
    { id: 'linear', label: 'Linear' },
    { id: 'log', label: 'Logarithmic' }
];

const ComparisonTool = () => {
    const [selectedCountries, setSelectedCountries] = useState([AU_MEMBER_STATES[0].code, AU_MEMBER_STATES[1].code]);
    const [metric, setMetric] = useState(INDICATORS.EXTERNAL_DEBT_GNI_PCT);
    const [chartType, setChartType] = useState('line');
    const [scale, setScale] = useState('linear');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const allData = [];

            for (const code of selectedCountries) {
                const data = await fetchIndicatorData(code, metric);
                allData.push({ code, data });
            }

            const yearMap = new Map();
            allData.forEach(({ code, data }) => {
                data.forEach(item => {
                    if (!yearMap.has(item.year)) {
                        yearMap.set(item.year, { name: item.year });
                    }
                    const entry = yearMap.get(item.year);
                    // Apply log transform if needed
                    entry[code] = scale === 'log' && item.value > 0
                        ? Math.log10(item.value)
                        : item.value;
                });
            });

            const merged = Array.from(yearMap.values()).sort((a, b) => a.name - b.name);
            setChartData(merged);
            setLoading(false);
        };

        if (selectedCountries.length > 0) {
            fetchData();
        }
    }, [selectedCountries, metric, scale]);

    const addCountry = (code) => {
        if (code && !selectedCountries.includes(code)) {
            setSelectedCountries(prev => [...prev, code]);
        }
    };

    const removeCountry = (code) => {
        setSelectedCountries(prev => prev.filter(c => c !== code));
    };

    const getMetricLabel = (m) => {
        switch (m) {
            case INDICATORS.EXTERNAL_DEBT_GNI_PCT: return 'Ext. Debt (% of GDP)';
            case INDICATORS.EXTERNAL_DEBT_EXPORTS_PCT: return 'Ext. Debt (% of Exports)';
            case INDICATORS.DEBT_SERVICE_EXPORTS_PCT: return 'Debt Service (% of Exp)';
            case INDICATORS.DEBT_SERVICE_REVENUE_PCT: return 'Debt Service (% of Rev*)';
            default: return 'Metric';
        }
    };

    const availableCountries = AU_MEMBER_STATES.filter(c => !selectedCountries.includes(c.code));

    const renderChart = () => {
        const commonProps = {
            data: chartData,
            margin: { top: 10, right: 30, left: 0, bottom: 0 }
        };

        const axisProps = {
            stroke: 'var(--color-text-secondary)',
            fontSize: 12,
            tickLine: false,
            axisLine: false
        };

        const tooltipStyle = {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderColor: 'var(--color-border)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontSize: '0.85rem'
        };

        const renderDataElements = () => {
            return selectedCountries.map((code, index) => {
                const name = AU_MEMBER_STATES.find(c => c.code === code)?.name || code;
                const color = COLORS[index % COLORS.length];

                if (chartType === 'line') {
                    return (
                        <Line
                            key={code}
                            type="monotone"
                            dataKey={code}
                            name={name}
                            stroke={color}
                            strokeWidth={3}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            dot={false}
                        />
                    );
                } else if (chartType === 'bar') {
                    return (
                        <Bar
                            key={code}
                            dataKey={code}
                            name={name}
                            fill={color}
                            radius={[4, 4, 0, 0]}
                        />
                    );
                } else {
                    return (
                        <Area
                            key={code}
                            type="monotone"
                            dataKey={code}
                            name={name}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                    );
                }
            });
        };

        const ChartComponent = chartType === 'line' ? LineChart : chartType === 'bar' ? BarChart : AreaChart;

        return (
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" {...axisProps} dy={10} />
                    <YAxis
                        {...axisProps}
                        dx={-10}
                        tickFormatter={(val) => scale === 'log' ? Math.pow(10, val).toFixed(0) : val}
                    />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        itemStyle={{ color: 'var(--color-text-primary)' }}
                        labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}
                        formatter={(val) => scale === 'log' ? [Math.pow(10, val).toFixed(1), ''] : [val?.toFixed(1), '']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    {renderDataElements()}
                </ChartComponent>
            </ResponsiveContainer>
        );
    };

    return (
        <div style={{ padding: '0 0 2rem 0' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Comparison Tool</h2>

            {/* Controls Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '1.5rem'
            }}>
                {/* Metric Selector */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.5rem'
                    }}>
                        Select Metric
                    </label>
                    <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: 12,
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-secondary)',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value={INDICATORS.EXTERNAL_DEBT_GNI_PCT}>External Debt (% of GDP)</option>
                        <option value={INDICATORS.EXTERNAL_DEBT_EXPORTS_PCT}>External Debt (% of Exports)</option>
                        <option value={INDICATORS.DEBT_SERVICE_EXPORTS_PCT}>Debt Service (% of Exports)</option>
                        <option value={INDICATORS.DEBT_SERVICE_REVENUE_PCT}>Debt Service (% of Revenue*)</option>
                    </select>
                </div>

                {/* Country Dropdown */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.5rem'
                    }}>
                        Add Country
                    </label>
                    <select
                        value=""
                        onChange={(e) => addCountry(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: 12,
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-secondary)',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">Select a country...</option>
                        {availableCountries.map(country => (
                            <option key={country.code} value={country.code}>{country.name}</option>
                        ))}
                    </select>
                </div>

                {/* Chart Type */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.5rem'
                    }}>
                        Chart Type
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {CHART_TYPES.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setChartType(type.id)}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.4rem',
                                    padding: '0.6rem',
                                    borderRadius: 10,
                                    border: chartType === type.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                    background: chartType === type.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                                    color: chartType === type.id ? '#fff' : 'var(--color-text-primary)',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <type.icon size={14} />
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scale Type */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.5rem'
                    }}>
                        Scale
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {SCALE_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setScale(opt.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.6rem',
                                    borderRadius: 10,
                                    border: scale === opt.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                    background: scale === opt.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                                    color: scale === opt.id ? '#fff' : 'var(--color-text-primary)',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selected Countries Tags */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1.5rem'
            }}>
                {selectedCountries.map((code, index) => {
                    const country = AU_MEMBER_STATES.find(c => c.code === code);
                    return (
                        <div
                            key={code}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 0.5rem 0.4rem 0.75rem',
                                background: `${COLORS[index % COLORS.length]}15`,
                                border: `1px solid ${COLORS[index % COLORS.length]}40`,
                                borderRadius: 20,
                                fontSize: '0.85rem',
                                fontWeight: 500
                            }}
                        >
                            <span style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: COLORS[index % COLORS.length]
                            }} />
                            {country?.name}
                            <button
                                onClick={() => removeCountry(code)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 18,
                                    height: 18,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Chart */}
            <div style={{
                height: '450px',
                width: '100%',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: 20,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid rgba(255,255,255,0.9)'
            }}>
                {loading ? (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Loading Data...
                    </div>
                ) : selectedCountries.length === 0 ? (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Select at least one country to compare
                    </div>
                ) : (
                    renderChart()
                )}
            </div>
        </div>
    );
};

export default ComparisonTool;
