import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { AU_MEMBER_STATES } from '../utils/countries';
import { fetchCountryDebtData } from '../services/worldBankApi';
import { getCountryOverallRisk } from '../utils/debtModel';
import MapVisualization from './MapVisualization';
import { useCountUp } from '../hooks/useCountUp';

// Glassmorphism KPI Card
const GlassKPICard = ({ value, label, trend, trendValue, accentColor, icon: Icon, loading }) => {
    const [hovered, setHovered] = useState(false);
    const animated = useCountUp(loading ? 0 : value, 2200);

    // Format display value
    let display = '...';
    if (!loading) {
        if (value >= 1e12) {
            // Trillion display for values >= 1T
            display = '$' + (animated / 1e12).toFixed(2) + 'T';
        } else if (value > 1e9) {
            display = '$' + (animated / 1e9).toFixed(1) + 'B';
        } else if (value < 100) {
            display = value % 1 === 0 ? Math.round(animated).toString() : animated.toFixed(1) + '%';
        } else {
            display = animated.toFixed(1) + '%';
        }
    }

    const trendUp = trend === 'up';
    const TrendIcon = trendUp ? TrendingUp : TrendingDown;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 20,
                padding: '24px 22px',
                border: `1px solid ${accentColor}20`,
                boxShadow: hovered
                    ? `0 20px 40px ${accentColor}15, 0 0 0 1px ${accentColor}30`
                    : `0 4px 20px rgba(0,0,0,0.04)`,
                transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Accent glow */}
            <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
                borderRadius: '50%'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#1a1a2e',
                    letterSpacing: '-1px',
                    fontFamily: 'var(--font-display)',
                    lineHeight: 1
                }}>
                    {display}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginTop: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: trendUp ? '#e53935' : '#43a047'
                }}>
                    <TrendIcon size={14} strokeWidth={2.5} />
                    <span>{trendValue}</span>
                </div>

                <div style={{
                    fontSize: 12,
                    color: '#666',
                    marginTop: 12,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.6px',
                    lineHeight: 1.4
                }}>
                    {label}
                </div>
            </div>
        </div>
    );
};

// Glass Chart Widget
const GlassChartWidget = ({ title, children }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        padding: '18px 16px',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    }}>
        <div style={{
            fontSize: 11,
            color: '#666',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.8px',
            marginBottom: 14
        }}>
            {title}
        </div>
        <div style={{ flex: 1 }}>
            {children}
        </div>
    </div>
);

// Debt Trend Chart (Multi-line)
const DebtTrendChart = () => {
    const data = [
        { year: '2020', total: 180, external: 120, domestic: 60 },
        { year: '2021', total: 220, external: 145, domestic: 75 },
        { year: '2022', total: 280, external: 185, domestic: 95 },
        { year: '2023', total: 350, external: 230, domestic: 120 },
        { year: '2024', total: 420, external: 280, domestic: 140 }
    ];

    return (
        <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: 11
                    }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} fill="url(#totalGrad)" />
                <Line type="monotone" dataKey="external" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// Composition Bar Chart
const CompositionChart = () => {
    const data = [
        { name: 'Multilateral', value: 38, fill: '#3b82f6' },
        { name: 'Bilateral', value: 29, fill: '#8b5cf6' },
        { name: 'Private Creditors', value: 19, fill: '#f59e0b' },
        { name: 'Eurobonds', value: 14, fill: '#ef4444' }
    ];

    return (
        <ResponsiveContainer width="100%" height={95}>
            <BarChart data={data} layout="vertical" barSize={14}>
                <XAxis type="number" hide />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={85}
                    tick={{ fontSize: 10, fill: '#666' }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: 11
                    }}
                    formatter={(value) => [`${value}%`, 'Share']}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {data.map((entry, index) => (
                        <rect key={index} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

// Reports & Alerts Feed
const ReportsAlertsFeed = () => {
    const items = [
        { type: 'report', date: 'Q2 2024', title: 'Debt Sustainability Analysis - East Africa', tag: 'PDF, 12MB', isNew: true },
        { type: 'alert', date: '1 hr ago', title: 'Debt Relief Initiative Update for Sahel Region', tag: 'Link' },
        { type: 'news', date: '3 hrs ago', title: 'IMF Executive Board Completes Review for Ghana', tag: 'News' }
    ];

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: '16px 20px',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14
            }}>
                <div style={{
                    fontSize: 12,
                    color: '#444',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.6px'
                }}>
                    Latest Reports & Alerts
                </div>
                <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>
                    Filter ▾
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 0',
                        borderBottom: i < items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                    }}>
                        {item.type === 'report' ? (
                            <FileText size={16} color="#3b82f6" />
                        ) : (
                            <AlertTriangle size={16} color="#f59e0b" />
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>
                                {item.title}
                                <span style={{
                                    fontSize: 10,
                                    color: '#888',
                                    marginLeft: 8,
                                    fontWeight: 400
                                }}>
                                    ({item.tag})
                                </span>
                            </div>
                        </div>
                        {item.isNew && (
                            <span style={{
                                fontSize: 10,
                                color: '#3b82f6',
                                fontWeight: 600,
                                background: '#3b82f610',
                                padding: '2px 8px',
                                borderRadius: 10
                            }}>
                                New Alert
                            </span>
                        )}
                        <span style={{ fontSize: 11, color: '#999' }}>{item.date}</span>
                        <ChevronRight size={14} color="#ccc" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await Promise.all(
                AU_MEMBER_STATES.map(c => fetchCountryDebtData(c.code).then(d => ({ ...d, name: c.name })))
            );
            setData(res);
            setLoading(false);
        };
        load();
    }, []);

    const totalDebt = data.reduce((a, c) => a + (c.EXTERNAL_DEBT_STOCKS || 0), 0);
    const avgGDP = data.reduce((a, c) => a + (c.EXTERNAL_DEBT_GNI_PCT || 0), 0) / (data.length || 1);
    const debtService = data.reduce((a, c) => a + (c.DEBT_SERVICE_EXPORTS_PCT || 0), 0) / (data.length || 1) * 8;
    const highRisk = data.filter(c => getCountryOverallRisk(c) === 'HIGH').length;

    // Create risk mapping for SVG map
    const countryRisks = {};
    data.forEach(c => {
        const country = AU_MEMBER_STATES.find(s => s.name === c.name);
        if (country) {
            countryRisks[country.code] = getCountryOverallRisk(c);
        }
    });

    return (
        <>
            <div style={{
                background: 'linear-gradient(145deg, #f0f4f8 0%, #fafbfc 50%, #f5f7fa 100%)',
                borderRadius: 24,
                padding: 28,
                height: 'calc(100vh - 160px)',
                display: 'grid',
                gridTemplateColumns: '240px 1fr 240px',
                gridTemplateRows: '1fr',
                gap: 20,
                overflow: 'hidden'
            }}>
                {/* LEFT - KPI Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 4 }}>
                    <GlassKPICard
                        value={totalDebt}
                        label="Total External Debt"
                        trend="up"
                        trendValue="+1.2% vs last quarter"
                        accentColor="#3b82f6"
                        loading={loading}
                    />
                    <GlassKPICard
                        value={avgGDP}
                        label="Avg Debt-to-GDP"
                        trend="down"
                        trendValue="-0.8% improvement"
                        accentColor="#eab308"
                        loading={loading}
                    />
                    <GlassKPICard
                        value={debtService * 1e9}
                        label="Annual Debt Service"
                        trend="up"
                        trendValue="+3.2% YoY"
                        accentColor="#f97316"
                        loading={loading}
                    />
                    <GlassKPICard
                        value={highRisk}
                        label="Countries at High Debt Distress"
                        trend="up"
                        trendValue="+2 from last year"
                        accentColor="#ef4444"
                        loading={loading}
                    />
                </div>

                {/* CENTER - Map */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 20,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 600,
                            color: '#1a1a2e'
                        }}>
                            African Debt Monitoring Mechanism
                        </h3>
                    </div>

                    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                        <MapVisualization />

                        {/* Map Legend */}
                        <div style={{
                            position: 'absolute',
                            bottom: 12,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 16,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(8px)',
                            padding: '8px 16px',
                            borderRadius: 20,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            fontSize: 11,
                            fontWeight: 500
                        }}>
                            {[
                                { label: 'Low', color: '#22c55e' },
                                { label: 'Medium', color: '#f59e0b' },
                                { label: 'High', color: '#ef4444' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{
                                        width: 10,
                                        height: 10,
                                        background: item.color,
                                        borderRadius: '50%',
                                        boxShadow: `0 0 6px ${item.color}50`
                                    }} />
                                    <span style={{ color: '#555' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT - Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <GlassChartWidget title="Debt Accumulation Trend (2020-2024)">
                        <DebtTrendChart />
                    </GlassChartWidget>
                    <GlassChartWidget title="Composition of External Debt">
                        <CompositionChart />
                    </GlassChartWidget>
                </div>
            </div>

            {/* Reports & Alerts Section - Below Dashboard, Scrollable */}
            <div style={{
                marginTop: 20,
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: 16,
                padding: '16px 20px',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                maxHeight: 180,
                overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                    position: 'sticky',
                    top: 0,
                    background: 'rgba(255,255,255,0.95)',
                    padding: '4px 0',
                    zIndex: 1
                }}>
                    <div style={{
                        fontSize: 12,
                        color: '#444',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: '0.6px'
                    }}>
                        Latest Reports & Alerts
                    </div>
                    <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>
                        Filter ▾
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                        { type: 'report', date: 'Q2 2024', title: 'Debt Sustainability Analysis - East Africa', tag: 'PDF, 12MB', isNew: true },
                        { type: 'alert', date: '1 hr ago', title: 'Debt Relief Initiative Update for Sahel Region', tag: 'Link' },
                        { type: 'news', date: '3 hrs ago', title: 'IMF Executive Board Completes Review for Ghana', tag: 'News' },
                        { type: 'report', date: 'Q1 2024', title: 'African Development Bank Lending Report', tag: 'PDF, 8MB' },
                        { type: 'alert', date: '5 hrs ago', title: 'World Bank Approves Support for Kenya', tag: 'Link' }
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '8px 0',
                            borderBottom: i < 4 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                        }}>
                            {item.type === 'report' ? (
                                <FileText size={16} color="#3b82f6" />
                            ) : (
                                <AlertTriangle size={16} color="#f59e0b" />
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>
                                    {item.title}
                                    <span style={{
                                        fontSize: 10,
                                        color: '#888',
                                        marginLeft: 8,
                                        fontWeight: 400
                                    }}>
                                        ({item.tag})
                                    </span>
                                </div>
                            </div>
                            {item.isNew && (
                                <span style={{
                                    fontSize: 10,
                                    color: '#3b82f6',
                                    fontWeight: 600,
                                    background: '#3b82f610',
                                    padding: '2px 8px',
                                    borderRadius: 10
                                }}>
                                    New Alert
                                </span>
                            )}
                            <span style={{ fontSize: 11, color: '#999' }}>{item.date}</span>
                            <ChevronRight size={14} color="#ccc" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
