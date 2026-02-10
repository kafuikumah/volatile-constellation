import React, { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, TrendingUp, Settings, Play } from 'lucide-react';
import { projectDebtTrajectory, DSA_THRESHOLDS, checkDSAThresholds, getCountryBaseline } from '../utils/debtProjections';
import { AU_MEMBER_STATES } from '../utils/countries';

const ScenarioModeler = () => {
    const [selectedCountry, setSelectedCountry] = useState('NGA');
    const [assumptions, setAssumptions] = useState({
        gdpGrowthRate: 4.0,
        interestRate: 5.0,
        primaryBalance: -2.0,
        newBorrowing: 1.0,
        exportGrowth: 3.0
    });

    // Simulated baseline data
    const baseline = useMemo(() => ({
        currentDebt: 90e9,
        currentGDP: 450e9,
        currentExports: 60e9,
        currentRevenue: 50e9
    }), [selectedCountry]);

    const projections = useMemo(() =>
        projectDebtTrajectory(baseline, assumptions, 10),
        [baseline, assumptions]
    );

    const alerts = useMemo(() =>
        checkDSAThresholds(projections),
        [projections]
    );

    const SliderInput = ({ label, value, onChange, min, max, step = 0.5, unit = '%', color }) => (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>{label}</span>
                <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: color || 'var(--color-accent)',
                    background: `${color || 'var(--color-accent)'}15`,
                    padding: '2px 8px',
                    borderRadius: 6
                }}>
                    {value > 0 ? '+' : ''}{value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{
                    width: '100%',
                    accentColor: color || 'var(--color-accent)',
                    height: 6,
                    cursor: 'pointer'
                }}
            />
        </div>
    );

    return (
        <div style={{ padding: '0 0 2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Settings size={24} color="var(--color-accent)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Debt Sustainability Projections</h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                gap: 24
            }}>
                {/* Controls Panel */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                            marginBottom: 8
                        }}>
                            Select Country
                        </label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: 10,
                                border: '1px solid var(--color-border)',
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                        >
                            {AU_MEMBER_STATES.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 16
                    }}>
                        Scenario Assumptions
                    </div>

                    <SliderInput
                        label="GDP Growth Rate"
                        value={assumptions.gdpGrowthRate}
                        onChange={(v) => setAssumptions(a => ({ ...a, gdpGrowthRate: v }))}
                        min={-5} max={12}
                        color="#22c55e"
                    />
                    <SliderInput
                        label="Average Interest Rate"
                        value={assumptions.interestRate}
                        onChange={(v) => setAssumptions(a => ({ ...a, interestRate: v }))}
                        min={1} max={15}
                        color="#f59e0b"
                    />
                    <SliderInput
                        label="Primary Balance (% GDP)"
                        value={assumptions.primaryBalance}
                        onChange={(v) => setAssumptions(a => ({ ...a, primaryBalance: v }))}
                        min={-10} max={5}
                        color="#ef4444"
                    />
                    <SliderInput
                        label="New Borrowing (% GDP)"
                        value={assumptions.newBorrowing}
                        onChange={(v) => setAssumptions(a => ({ ...a, newBorrowing: v }))}
                        min={0} max={10}
                        color="#8b5cf6"
                    />

                    {/* Risk Summary */}
                    <div style={{
                        marginTop: 20,
                        padding: 16,
                        background: alerts.some(a => a.type === 'CRITICAL') ? '#fef2f2' : '#fefce8',
                        borderRadius: 12,
                        border: `1px solid ${alerts.some(a => a.type === 'CRITICAL') ? '#fecaca' : '#fef08a'}`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <AlertTriangle size={16} color={alerts.some(a => a.type === 'CRITICAL') ? '#ef4444' : '#eab308'} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
                                Projection Risk Assessment
                            </span>
                        </div>
                        <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.5 }}>
                            {alerts.filter(a => a.type === 'CRITICAL').length > 0
                                ? `⚠️ High risk projected in ${alerts[0]?.year || 'future years'}`
                                : '✓ Debt remains within sustainable thresholds'}
                        </p>
                    </div>
                </div>

                {/* Chart Section */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20
                    }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                            Debt-to-GDP Trajectory (10-Year Projection)
                        </h3>
                        <div style={{
                            display: 'flex',
                            gap: 16,
                            fontSize: 11,
                            color: '#666'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 12, height: 3, background: '#22c55e', borderRadius: 2 }} />
                                Low Risk (&lt;40%)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 12, height: 3, background: '#f59e0b', borderRadius: 2 }} />
                                Moderate (40-60%)
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 12, height: 3, background: '#ef4444', borderRadius: 2 }} />
                                High Risk (&gt;60%)
                            </span>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={projections}>
                            <defs>
                                <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 11, fill: '#888' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#888' }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(8px)',
                                    border: 'none',
                                    borderRadius: 12,
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    fontSize: 12
                                }}
                                formatter={(value) => [`${value.toFixed(1)}%`, 'Debt-to-GDP']}
                            />
                            {/* Threshold lines */}
                            <ReferenceLine y={40} stroke="#22c55e" strokeDasharray="4 4" label={{ value: '40%', fontSize: 10, fill: '#22c55e' }} />
                            <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '50%', fontSize: 10, fill: '#f59e0b' }} />
                            <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '60%', fontSize: 10, fill: '#ef4444' }} />

                            <Area
                                type="monotone"
                                dataKey="debtToGDP"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fill="url(#debtGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ScenarioModeler;
