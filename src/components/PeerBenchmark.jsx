import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Users, TrendingUp, Globe } from 'lucide-react';
import { AU_MEMBER_STATES } from '../utils/countries';
import { fetchCountryDebtData } from '../services/worldBankApi';

// Income group classifications
const INCOME_GROUPS = {
    LOW: { label: 'Low Income', countries: ['ETH', 'MOZ', 'TZA', 'UGA', 'MDG', 'MWI', 'BFA', 'MLI', 'NER', 'TCD'] },
    LOWER_MIDDLE: { label: 'Lower-Middle', countries: ['NGA', 'KEN', 'GHA', 'SEN', 'CIV', 'CMR', 'ZMB', 'ZWE', 'AGO', 'COG'] },
    UPPER_MIDDLE: { label: 'Upper-Middle', countries: ['ZAF', 'EGY', 'TUN', 'BWA', 'NAM', 'GAB', 'MUS', 'GNQ'] }
};

const REGIONS = {
    WEST: { label: 'West Africa', countries: ['NGA', 'GHA', 'SEN', 'CIV', 'MLI', 'BFA', 'NER', 'TGO', 'BEN', 'GIN'] },
    EAST: { label: 'East Africa', countries: ['KEN', 'ETH', 'TZA', 'UGA', 'RWA', 'BDI', 'SSD', 'SOM', 'ERI', 'DJI'] },
    SOUTHERN: { label: 'Southern Africa', countries: ['ZAF', 'BWA', 'NAM', 'ZMB', 'ZWE', 'MOZ', 'MWI', 'LSO', 'SWZ', 'AGO'] },
    NORTH: { label: 'North Africa', countries: ['EGY', 'TUN', 'MAR', 'DZA', 'LBY', 'SDN'] },
    CENTRAL: { label: 'Central Africa', countries: ['CMR', 'COG', 'COD', 'GAB', 'TCD', 'CAF', 'GNQ'] }
};

const PeerBenchmark = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState('NGA');
    const [comparisonType, setComparisonType] = useState('income');
    const [metric, setMetric] = useState('EXTERNAL_DEBT_GNI_PCT');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const results = await Promise.all(
                AU_MEMBER_STATES.map(c =>
                    fetchCountryDebtData(c.code).then(d => ({ code: c.code, name: c.name, data: d }))
                )
            );
            setData(results);
            setLoading(false);
        };
        loadData();
    }, []);

    const selectedData = data.find(d => d.code === selectedCountry);

    // Get peer group
    const peerGroup = useMemo(() => {
        if (comparisonType === 'income') {
            const group = Object.entries(INCOME_GROUPS).find(([_, g]) => g.countries.includes(selectedCountry));
            return group ? { name: group[1].label, countries: group[1].countries } : null;
        } else {
            const region = Object.entries(REGIONS).find(([_, r]) => r.countries.includes(selectedCountry));
            return region ? { name: region[1].label, countries: region[1].countries } : null;
        }
    }, [selectedCountry, comparisonType]);

    const peerData = useMemo(() => {
        if (!peerGroup) return [];
        return data
            .filter(d => peerGroup.countries.includes(d.code))
            .map(d => ({
                name: d.name,
                code: d.code,
                value: d.data[metric] || 0,
                isSelected: d.code === selectedCountry
            }))
            .sort((a, b) => b.value - a.value);
    }, [data, peerGroup, metric, selectedCountry]);

    // Calculate percentile
    const percentile = useMemo(() => {
        if (!peerData.length) return 0;
        const rank = peerData.findIndex(d => d.code === selectedCountry) + 1;
        return Math.round((1 - rank / peerData.length) * 100);
    }, [peerData, selectedCountry]);

    const metricLabels = {
        EXTERNAL_DEBT_GNI_PCT: 'Debt-to-GDP (%)',
        DEBT_SERVICE_EXPORTS_PCT: 'Debt Service/Exports (%)',
        EXTERNAL_DEBT_EXPORTS_PCT: 'Debt/Exports (%)'
    };

    return (
        <div style={{ padding: '0 0 2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Users size={24} color="var(--color-accent)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Peer Benchmarking</h2>
            </div>

            {/* Controls */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                marginBottom: 24
            }}>
                <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                        Country
                    </label>
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }}
                    >
                        {AU_MEMBER_STATES.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                        Compare By
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {['income', 'region'].map(t => (
                            <button
                                key={t}
                                onClick={() => setComparisonType(t)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: 10,
                                    border: comparisonType === t ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                    background: comparisonType === t ? 'var(--color-accent)' : 'white',
                                    color: comparisonType === t ? 'white' : '#666',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {t === 'income' ? 'Income Group' : 'Region'}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                        Metric
                    </label>
                    <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }}
                    >
                        <option value="EXTERNAL_DEBT_GNI_PCT">Debt-to-GDP</option>
                        <option value="DEBT_SERVICE_EXPORTS_PCT">Debt Service / Exports</option>
                        <option value="EXTERNAL_DEBT_EXPORTS_PCT">Debt / Exports</option>
                    </select>
                </div>
                <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                        Percentile Rank
                    </label>
                    <div style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        background: percentile > 50 ? '#fef2f2' : '#f0fdf4',
                        border: `1px solid ${percentile > 50 ? '#fecaca' : '#bbf7d0'}`,
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: percentile > 50 ? '#ef4444' : '#22c55e' }}>
                            {percentile}th
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Peer Comparison Bar Chart */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>
                        {peerGroup?.name || 'Peer'} Comparison: {metricLabels[metric]}
                    </h3>

                    {loading ? (
                        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            Loading...
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={peerData} layout="vertical">
                                <XAxis type="number" fontSize={10} tickFormatter={v => `${v}%`} />
                                <YAxis type="category" dataKey="name" width={80} fontSize={10} />
                                <Tooltip formatter={v => `${v.toFixed(1)}%`} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {peerData.map((entry, i) => (
                                        <Cell
                                            key={i}
                                            fill={entry.isSelected ? '#3b82f6' : '#e5e7eb'}
                                            stroke={entry.isSelected ? '#2563eb' : 'none'}
                                            strokeWidth={entry.isSelected ? 2 : 0}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Summary Stats */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>
                        {selectedData?.name || 'Country'} vs Peers
                    </h3>

                    {peerData.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { label: 'Selected Country', value: selectedData?.data[metric]?.toFixed(1) || '0', color: '#3b82f6' },
                                { label: 'Peer Average', value: (peerData.reduce((a, c) => a + c.value, 0) / peerData.length).toFixed(1), color: '#8b5cf6' },
                                { label: 'Peer Median', value: peerData[Math.floor(peerData.length / 2)]?.value.toFixed(1), color: '#f59e0b' },
                                { label: 'Best in Group', value: peerData[peerData.length - 1]?.value.toFixed(1), color: '#22c55e' },
                                { label: 'Worst in Group', value: peerData[0]?.value.toFixed(1), color: '#ef4444' }
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px 12px',
                                    background: `${stat.color}08`,
                                    borderRadius: 10,
                                    border: `1px solid ${stat.color}20`
                                }}>
                                    <span style={{ fontSize: 12, color: '#555' }}>{stat.label}</span>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: stat.color }}>{stat.value}%</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PeerBenchmark;
