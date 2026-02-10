import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, FileText, TrendingUp } from 'lucide-react';

const TIMELINE_EVENTS = [
    {
        year: 1996,
        title: 'HIPC Initiative Launched',
        type: 'policy',
        description: 'Heavily Indebted Poor Countries initiative launched by IMF/World Bank to provide debt relief.',
        countries: ['Uganda', 'Mozambique', 'Bolivia'],
        impact: 'First comprehensive debt relief framework for developing countries'
    },
    {
        year: 2005,
        title: 'Multilateral Debt Relief Initiative',
        type: 'policy',
        description: 'MDRI provides 100% debt relief on eligible debts from IMF, World Bank, and AfDB.',
        countries: ['18 African countries'],
        impact: '$40B in debt relief for qualifying countries'
    },
    {
        year: 2007,
        title: 'Ghana Issues First Eurobond',
        type: 'milestone',
        description: 'Ghana becomes first sub-Saharan African country (ex-South Africa) to issue sovereign bond.',
        countries: ['Ghana'],
        impact: 'Opened access to international capital markets for African nations'
    },
    {
        year: 2010,
        title: 'African Eurobond Era Begins',
        type: 'milestone',
        description: 'Multiple African countries issue Eurobonds, beginning rapid accumulation of market debt.',
        countries: ['Nigeria', 'Senegal', 'Zambia', 'Rwanda'],
        impact: 'Shift from concessional to commercial borrowing'
    },
    {
        year: 2015,
        title: 'Commodity Price Collapse',
        type: 'crisis',
        description: 'Oil and commodity price crash severely impacts resource-dependent African economies.',
        countries: ['Nigeria', 'Angola', 'Ghana', 'Zambia'],
        impact: 'Currency depreciation increased debt burdens by 30-50%'
    },
    {
        year: 2018,
        title: 'Rising Debt Concerns',
        type: 'warning',
        description: 'IMF warns of rising debt distress risks across sub-Saharan Africa.',
        countries: ['Multiple countries'],
        impact: '18 countries at high risk or in debt distress'
    },
    {
        year: 2020,
        title: 'COVID-19 Pandemic & DSSI',
        type: 'crisis',
        description: 'Pandemic triggers economic crisis. G20 launches Debt Service Suspension Initiative.',
        countries: ['All African countries'],
        impact: '$12.9B in debt service deferred for 48 countries'
    },
    {
        year: 2021,
        title: 'Common Framework Introduced',
        type: 'policy',
        description: 'G20 Common Framework for debt treatment beyond DSSI launched.',
        countries: ['Chad', 'Ethiopia', 'Zambia'],
        impact: 'First requests under new framework'
    },
    {
        year: 2022,
        title: 'Ghana Debt Default',
        type: 'crisis',
        description: 'Ghana suspends external debt payments and enters debt restructuring.',
        countries: ['Ghana'],
        impact: '$30B debt restructuring program initiated'
    },
    {
        year: 2023,
        title: 'Ethiopia Completes Restructuring',
        type: 'milestone',
        description: 'Ethiopia becomes first country to complete Common Framework restructuring.',
        countries: ['Ethiopia'],
        impact: '$3.4B in debt relief achieved'
    },
    {
        year: 2024,
        title: 'AU Debt Monitoring Mechanism',
        type: 'policy',
        description: 'African Union launches comprehensive debt monitoring platform under CAP Pillar 2.',
        countries: ['All AU member states'],
        impact: 'Enhanced transparency and early warning capabilities'
    }
];

const DebtTimeline = () => {
    const [selectedEvent, setSelectedEvent] = useState(TIMELINE_EVENTS[TIMELINE_EVENTS.length - 1]);
    const [viewMode, setViewMode] = useState('timeline');

    const typeColors = {
        policy: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
        milestone: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
        crisis: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
        warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }
    };

    const typeIcons = {
        policy: FileText,
        milestone: TrendingUp,
        crisis: AlertCircle,
        warning: AlertCircle
    };

    return (
        <div style={{ padding: '0 0 2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Calendar size={24} color="var(--color-accent)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>African Debt Timeline</h2>
            </div>

            {/* View Toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['timeline', 'table'].map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: viewMode === mode ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                            background: viewMode === mode ? 'var(--color-accent)' : 'white',
                            color: viewMode === mode ? 'white' : '#555',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {mode} View
                    </button>
                ))}
            </div>

            {viewMode === 'timeline' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
                    {/* Timeline */}
                    <div style={{
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: 20,
                        padding: 24,
                        border: '1px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                        position: 'relative'
                    }}>
                        {/* Timeline Line */}
                        <div style={{
                            position: 'absolute',
                            left: 40,
                            top: 40,
                            bottom: 40,
                            width: 2,
                            background: 'var(--color-border)'
                        }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {TIMELINE_EVENTS.map((event, i) => {
                                const colors = typeColors[event.type];
                                const Icon = typeIcons[event.type];
                                const isSelected = selectedEvent.year === event.year;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedEvent(event)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 16,
                                            cursor: 'pointer',
                                            padding: '12px 16px',
                                            borderRadius: 12,
                                            background: isSelected ? `${colors.bg}` : 'transparent',
                                            border: isSelected ? `1px solid ${colors.border}` : '1px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {/* Year + Dot */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            minWidth: 80
                                        }}>
                                            <span style={{
                                                fontWeight: 700,
                                                fontSize: 14,
                                                color: isSelected ? colors.text : '#888'
                                            }}>
                                                {event.year}
                                            </span>
                                            <div style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                background: colors.border,
                                                border: '2px solid white',
                                                boxShadow: isSelected ? `0 0 8px ${colors.border}` : 'none',
                                                zIndex: 1
                                            }} />
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            }}>
                                                <Icon size={14} color={colors.border} />
                                                <span style={{
                                                    fontWeight: 600,
                                                    fontSize: 13,
                                                    color: isSelected ? colors.text : '#1a1a2e'
                                                }}>
                                                    {event.title}
                                                </span>
                                            </div>
                                            <p style={{
                                                fontSize: 11,
                                                color: '#888',
                                                margin: '4px 0 0 0',
                                                lineHeight: 1.4
                                            }}>
                                                {event.description.slice(0, 80)}...
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Event Detail */}
                    <div style={{
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: 20,
                        padding: 24,
                        border: '1px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 20,
                            background: typeColors[selectedEvent.type].bg,
                            color: typeColors[selectedEvent.type].text,
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            marginBottom: 12
                        }}>
                            {selectedEvent.type}
                        </div>

                        <h3 style={{ margin: '0 0 8px 0', fontSize: 20, fontWeight: 700 }}>
                            {selectedEvent.title}
                        </h3>
                        <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
                            {selectedEvent.year}
                        </div>

                        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 20 }}>
                            {selectedEvent.description}
                        </p>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', marginBottom: 8 }}>
                                Countries Affected
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {selectedEvent.countries.map((c, i) => (
                                    <span key={i} style={{
                                        padding: '4px 10px',
                                        borderRadius: 16,
                                        background: 'var(--color-bg-secondary)',
                                        fontSize: 12,
                                        color: '#555'
                                    }}>
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            padding: 16,
                            borderRadius: 12,
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd'
                        }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#0369a1', textTransform: 'uppercase', marginBottom: 6 }}>
                                Key Impact
                            </div>
                            <p style={{ fontSize: 13, color: '#0c4a6e', margin: 0, lineHeight: 1.5 }}>
                                {selectedEvent.impact}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Table View */
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    overflowX: 'auto'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                {['Year', 'Event', 'Type', 'Countries', 'Impact'].map(h => (
                                    <th key={h} style={{
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: '#666',
                                        textTransform: 'uppercase'
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIMELINE_EVENTS.map((event, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{event.year}</td>
                                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{event.title}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: 12,
                                            background: typeColors[event.type].bg,
                                            color: typeColors[event.type].text,
                                            fontSize: 10,
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}>
                                            {event.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#666' }}>
                                        {event.countries.join(', ')}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#555' }}>
                                        {event.impact}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DebtTimeline;
