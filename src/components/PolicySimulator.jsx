import React, { useState, useMemo } from 'react';
import { Calculator, Leaf, RefreshCw, DollarSign, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { AU_MEMBER_STATES } from '../utils/countries';

const PolicySimulator = () => {
    const [selectedCountry, setSelectedCountry] = useState('NGA');
    const [activeTab, setActiveTab] = useState('swap');

    // Debt Swap Calculator state
    const [swapAmount, setSwapAmount] = useState(2);
    const [swapType, setSwapType] = useState('nature');

    // Refinancing Calculator state
    const [refinanceAmount, setRefinanceAmount] = useState(5);
    const [currentRate, setCurrentRate] = useState(7);
    const [newRate, setNewRate] = useState(4);
    const [extensionYears, setExtensionYears] = useState(5);

    // Debt swap calculation
    const swapResults = useMemo(() => {
        const debtReduction = swapAmount;
        const investmentCommitment = swapAmount * 0.6; // 60% for conservation/climate
        const netSavings = swapAmount * 0.4;
        const annualServiceReduction = swapAmount * 0.08; // ~8% annual service

        return { debtReduction, investmentCommitment, netSavings, annualServiceReduction };
    }, [swapAmount]);

    // Refinancing calculation
    const refinanceResults = useMemo(() => {
        const currentAnnualPayment = refinanceAmount * (currentRate / 100);
        const newAnnualPayment = refinanceAmount * (newRate / 100);
        const annualSavings = currentAnnualPayment - newAnnualPayment;
        const totalSavings = annualSavings * extensionYears;
        const npvSavings = totalSavings * 0.85; // Discounted

        return { currentAnnualPayment, newAnnualPayment, annualSavings, totalSavings, npvSavings };
    }, [refinanceAmount, currentRate, newRate, extensionYears]);

    const projectionData = useMemo(() => {
        const data = [];
        let baseDebt = 50;
        let scenario = 50;

        for (let i = 0; i <= 10; i++) {
            data.push({
                year: 2024 + i,
                baseline: baseDebt,
                scenario: scenario
            });
            baseDebt += 3;
            scenario += activeTab === 'swap'
                ? (i < 3 ? -swapResults.debtReduction / 3 + 2 : 2)
                : (2 - refinanceResults.annualSavings / 10);
        }
        return data;
    }, [activeTab, swapResults, refinanceResults]);

    const SliderInput = ({ label, value, onChange, min, max, step = 0.5, unit, color = '#3b82f6' }) => (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>{label}</span>
                <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color,
                    background: `${color}15`,
                    padding: '2px 8px',
                    borderRadius: 6
                }}>
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: color }}
            />
        </div>
    );

    const ResultCard = ({ label, value, unit, color, icon: Icon }) => (
        <div style={{
            background: `${color}10`,
            borderRadius: 12,
            padding: 16,
            border: `1px solid ${color}20`
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}{unit}</div>
        </div>
    );

    return (
        <div style={{ padding: '0 0 2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Calculator size={24} color="var(--color-accent)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Policy Simulation Tools</h2>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                {[
                    { id: 'swap', label: 'Debt Swap Calculator', icon: Leaf },
                    { id: 'refinance', label: 'Refinancing Analyzer', icon: RefreshCw }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '12px 20px',
                            borderRadius: 12,
                            border: activeTab === tab.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                            background: activeTab === tab.id ? 'var(--color-accent)' : 'white',
                            color: activeTab === tab.id ? 'white' : '#555',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 24 }}>
                {/* Controls Panel */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    {/* Country Selector */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
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

                    {activeTab === 'swap' ? (
                        <>
                            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Debt-for-Nature/Climate Swap</h4>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                                    Swap Type
                                </label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {['nature', 'climate'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setSwapType(t)}
                                            style={{
                                                flex: 1,
                                                padding: '8px',
                                                borderRadius: 8,
                                                border: swapType === t ? '2px solid #22c55e' : '1px solid var(--color-border)',
                                                background: swapType === t ? '#22c55e' : 'white',
                                                color: swapType === t ? 'white' : '#555',
                                                fontSize: 12,
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            Debt-for-{t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <SliderInput
                                label="Swap Amount"
                                value={swapAmount}
                                onChange={setSwapAmount}
                                min={0.5}
                                max={10}
                                step={0.5}
                                unit=" $B"
                                color="#22c55e"
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <ResultCard label="Debt Reduction" value={`$${swapResults.debtReduction.toFixed(1)}`} unit="B" color="#22c55e" icon={TrendingDown} />
                                <ResultCard label="Investment" value={`$${swapResults.investmentCommitment.toFixed(1)}`} unit="B" color="#3b82f6" icon={Leaf} />
                            </div>
                        </>
                    ) : (
                        <>
                            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Debt Refinancing Scenario</h4>

                            <SliderInput label="Debt to Refinance" value={refinanceAmount} onChange={setRefinanceAmount} min={1} max={20} step={1} unit=" $B" color="#3b82f6" />
                            <SliderInput label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} min={2} max={15} step={0.5} unit="%" color="#ef4444" />
                            <SliderInput label="New Interest Rate" value={newRate} onChange={setNewRate} min={1} max={10} step={0.5} unit="%" color="#22c55e" />
                            <SliderInput label="Maturity Extension" value={extensionYears} onChange={setExtensionYears} min={0} max={15} step={1} unit=" yrs" color="#8b5cf6" />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <ResultCard label="Annual Savings" value={`$${(refinanceResults.annualSavings * 1000).toFixed(0)}`} unit="M" color="#22c55e" icon={DollarSign} />
                                <ResultCard label="NPV Savings" value={`$${refinanceResults.npvSavings.toFixed(1)}`} unit="B" color="#3b82f6" icon={TrendingDown} />
                            </div>
                        </>
                    )}
                </div>

                {/* Projection Chart */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                            Debt Trajectory Comparison
                        </h3>
                        <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 12, height: 3, background: '#94a3b8', borderRadius: 2 }} />
                                Baseline
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 12, height: 3, background: '#22c55e', borderRadius: 2 }} />
                                With Policy
                            </span>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={projectionData}>
                            <XAxis dataKey="year" fontSize={11} axisLine={false} tickLine={false} />
                            <YAxis fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                            <Tooltip formatter={v => `${v.toFixed(1)}%`} />
                            <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Baseline" />
                            <Line type="monotone" dataKey="scenario" stroke="#22c55e" strokeWidth={3} dot={false} name="With Policy" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PolicySimulator;
