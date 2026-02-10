import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Treemap } from 'recharts';
import { Landmark, Clock, Percent, FileText, CheckCircle, Loader } from 'lucide-react';
import { AU_MEMBER_STATES } from '../utils/countries';
import { CREDITOR_DATA, CREDITOR_TYPES, CREDITOR_COLORS, getCreditorData } from '../data/creditorData';

const CreditorAnalysis = () => {
    const [selectedCountry, setSelectedCountry] = useState('NGA');
    const [chartView, setChartView] = useState('pie');

    const data = getCreditorData(selectedCountry);

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
        <div style={{ padding: '0 0 2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Landmark size={24} color="var(--color-accent)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Creditor Analysis</h2>
            </div>

            {/* Country Selector */}
            <div style={{ marginBottom: 24 }}>
                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    style={{
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--color-border)',
                        fontSize: 14,
                        minWidth: 250,
                        cursor: 'pointer'
                    }}
                >
                    {AU_MEMBER_STATES.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Creditor Composition Chart */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Debt Composition by Creditor</h3>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <ResponsiveContainer width="50%" height={220}>
                            {chartView === 'pie' ? (
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
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
                                    <YAxis type="category" dataKey="name" width={100} fontSize={10} />
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
                                    marginBottom: 8,
                                    fontSize: 12
                                }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                                    <span style={{ flex: 1, color: '#555' }}>{item.name}</span>
                                    <span style={{ fontWeight: 600 }}>{item.value}%</span>
                                    <span style={{ color: '#888', fontSize: 11 }}>(${item.amount}B)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loan Terms */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>
                        Average Loan Terms
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                        {[
                            { icon: Percent, label: 'Interest Rate', value: `${data.loanTerms.avgInterestRate}%`, color: '#ef4444' },
                            { icon: Clock, label: 'Maturity', value: `${data.loanTerms.avgMaturity} yrs`, color: '#3b82f6' },
                            { icon: Clock, label: 'Grace Period', value: `${data.loanTerms.avgGracePeriod} yrs`, color: '#22c55e' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: `${item.color}10`,
                                borderRadius: 12,
                                padding: 16,
                                textAlign: 'center'
                            }}>
                                <item.icon size={20} color={item.color} style={{ marginBottom: 8 }} />
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>{item.value}</div>
                                <div style={{ fontSize: 11, color: '#666' }}>{item.label}</div>
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
                                <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
                                    <p style={{ margin: '4px 0' }}>Framework: {data.restructuringStatus.framework}</p>
                                    <p style={{ margin: '4px 0' }}>Started: {data.restructuringStatus.startDate}</p>
                                    {data.restructuringStatus.completedDate && (
                                        <p style={{ margin: '4px 0' }}>Completed: {data.restructuringStatus.completedDate}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: 12, color: '#888' }}>No active restructuring</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditorAnalysis;
