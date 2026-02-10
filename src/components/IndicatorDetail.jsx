import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink, Info, PieChart, Globe } from 'lucide-react';
import { PieChart as RechartPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getIndicatorById, getIndicatorDocuments, DOCUMENT_TYPES, getCountriesWithDocuments } from '../services/indicatorDocumentData';
import { AU_MEMBER_STATES } from '../utils/countries';

const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const IndicatorDetail = () => {
    const { indicatorId, countryCode } = useParams();
    const navigate = useNavigate();
    const [indicator, setIndicator] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(countryCode || null);

    const country = countryCode ? AU_MEMBER_STATES.find(c => c.code === countryCode) : null;
    const countriesWithDocs = getCountriesWithDocuments();

    useEffect(() => {
        const ind = getIndicatorById(indicatorId);
        setIndicator(ind);

        if (selectedCountry) {
            const docs = getIndicatorDocuments(indicatorId, selectedCountry);
            setDocuments(docs);
        }
    }, [indicatorId, selectedCountry]);

    if (!indicator) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Indicator not found</h2>
                <p>The indicator "{indicatorId}" does not exist.</p>
                <button onClick={() => navigate(-1)} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                    Go Back
                </button>
            </div>
        );
    }

    const componentData = indicator.components.map(c => ({
        name: c.name,
        value: c.weight
    }));

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
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
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>{indicator.name}</h1>
                    {country && (
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                            for {country.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Indicator Overview */}
            <section style={{ marginBottom: '3rem' }}>
                <div style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Info size={24} color="var(--color-accent)" />
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Description</h3>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                {indicator.description}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <PieChart size={24} color="var(--color-warning)" />
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Methodology</h3>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                {indicator.methodology}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Breakdown */}
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    Component Breakdown
                </h2>
                <div style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartPie>
                                <Pie
                                    data={componentData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {componentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                            </RechartPie>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
                        {indicator.components.map((comp, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                borderLeft: `4px solid ${CHART_COLORS[index % CHART_COLORS.length]}`,
                                marginBottom: '1rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderRadius: '0 8px 8px 0'
                            }}>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-primary)' }}>
                                    {comp.name} ({comp.weight}%)
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    {comp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Country Selection for Documents */}
            {!countryCode && (
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                        Select a Country for Documents
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Globe size={20} color="var(--color-accent)" />
                        <select
                            value={selectedCountry || ''}
                            onChange={(e) => setSelectedCountry(e.target.value || null)}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-card)',
                                color: 'var(--color-text-primary)',
                                fontSize: '1rem',
                                minWidth: '250px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">-- Select a country --</option>
                            {countriesWithDocs.filter(c => c.hasDocuments).map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.name} ({c.documentCount} documents)
                                </option>
                            ))}
                        </select>
                    </div>
                </section>
            )}

            {/* Related Documents */}
            <section>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                    Related Documents {selectedCountry && `for ${AU_MEMBER_STATES.find(c => c.code === selectedCountry)?.name || selectedCountry}`}
                </h2>

                {!selectedCountry ? (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>Select a country above to view available documents.</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No documents available for this indicator and country combination.</p>
                        <p style={{ fontSize: '0.9rem' }}>
                            Related document types: {indicator.relatedDocuments.map(d => DOCUMENT_TYPES[d]?.name).join(', ')}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {documents.map((doc, index) => (
                            <a
                                key={index}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'block',
                                    backgroundColor: 'var(--color-bg-card)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    border: '1px solid var(--color-border)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <FileText size={32} color="var(--color-accent)" />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                                            {doc.name}
                                        </h3>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                            {doc.description}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontSize: '0.85rem' }}>
                                            <span>Year: {doc.year}</span>
                                            <ExternalLink size={14} />
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </section>

            {/* Back to Country Detail Link */}
            {countryCode && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link
                        to={`/country/${countryCode}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--color-accent)',
                            color: '#fff',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 500
                        }}
                    >
                        View Full Country Profile
                        <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default IndicatorDetail;
