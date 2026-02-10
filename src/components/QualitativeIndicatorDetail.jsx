import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, BookOpen, FileText } from 'lucide-react';
import { getQualitativeIndicatorById, getCountryJustification, FIELD_TO_INDICATOR_MAP } from '../services/qualitativeMethodologyData';
import { fetchQualitativeData, getQualitativeLevel } from '../services/qualitativeData';
import { getRiskColor } from '../utils/debtModel';
import { AU_MEMBER_STATES } from '../utils/countries';

const RatingIcon = ({ rating }) => {
    switch (rating) {
        case 'Strong':
            return <CheckCircle size={24} color="var(--color-success)" />;
        case 'Adequate':
            return <AlertTriangle size={24} color="var(--color-warning)" />;
        case 'Weak':
            return <XCircle size={24} color="var(--color-danger)" />;
        default:
            return null;
    }
};

const RatingBadge = ({ rating, size = 'normal' }) => {
    const level = getQualitativeLevel(rating);
    const color = getRiskColor(level);
    const padding = size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem';
    const fontSize = size === 'large' ? '1.1rem' : '0.9rem';

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding,
            borderRadius: '9999px',
            backgroundColor: `${color}15`,
            color: color,
            fontWeight: '700',
            fontSize,
            border: `2px solid ${color}`
        }}>
            <RatingIcon rating={rating} />
            {rating}
        </div>
    );
};

const QualitativeIndicatorDetail = () => {
    const { indicatorId, countryCode } = useParams();
    const navigate = useNavigate();
    const [indicator, setIndicator] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(countryCode || null);

    const country = countryCode ? AU_MEMBER_STATES.find(c => c.code === countryCode) : null;

    useEffect(() => {
        window.scrollTo(0, 0);
        const ind = getQualitativeIndicatorById(indicatorId);
        setIndicator(ind);
    }, [indicatorId]);

    useEffect(() => {
        const loadCountryData = async () => {
            if (selectedCountry) {
                const allData = await fetchQualitativeData();
                const data = allData.find(c => c.countryCode === selectedCountry);
                setCountryData(data);
            }
        };
        loadCountryData();
    }, [selectedCountry]);

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

    // Get the field name for this indicator
    const fieldName = Object.entries(FIELD_TO_INDICATOR_MAP).find(([, id]) => id === indicatorId)?.[0];
    const currentRating = countryData?.[fieldName];

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
                    <span style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: 600
                    }}>
                        CAP Pillar 2
                    </span>
                    <h1 style={{ margin: '0.25rem 0 0 0', fontSize: '2rem' }}>{indicator.name}</h1>
                    {country && (
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                            Assessment for {country.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Country Selection (if no country specified) */}
            {!countryCode && (
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{ fontWeight: 500 }}>View assessment for:</span>
                        <select
                            value={selectedCountry || ''}
                            onChange={(e) => setSelectedCountry(e.target.value || null)}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-secondary)',
                                color: 'var(--color-text-primary)',
                                fontSize: '1rem',
                                minWidth: '250px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">-- Select a country --</option>
                            {AU_MEMBER_STATES.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </section>
            )}

            {/* Current Rating (if country selected) */}
            {selectedCountry && currentRating && (
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '16px',
                        padding: '2rem',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                                    Current Assessment
                                </h3>
                                <RatingBadge rating={currentRating} size="large" />
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Justification</h4>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>
                                {getCountryJustification(selectedCountry, indicatorId, currentRating)}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Description & Methodology */}
            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} color="var(--color-accent)" />
                    Methodology
                </h2>
                <div style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
                        {indicator.description}
                    </p>
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: '8px',
                        whiteSpace: 'pre-line',
                        lineHeight: 1.8
                    }}>
                        {indicator.methodology}
                    </div>
                    <p style={{ margin: '1rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        <strong>Reference:</strong> {indicator.referenceFramework}
                    </p>
                </div>
            </section>

            {/* Scoring Criteria */}
            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={20} color="var(--color-accent)" />
                    Scoring Criteria
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {indicator.scoringCriteria.map((criteria, index) => {
                        const level = getQualitativeLevel(criteria.rating);
                        const color = getRiskColor(level);
                        const isCurrentRating = currentRating === criteria.rating;

                        return (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: isCurrentRating ? `${color}10` : 'var(--color-bg-card)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    border: isCurrentRating ? `2px solid ${color}` : '1px solid var(--color-border)',
                                    boxShadow: isCurrentRating ? `0 0 15px ${color}20` : '0 2px 4px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <RatingBadge rating={criteria.rating} />
                                    {isCurrentRating && (
                                        <span style={{ fontSize: '0.85rem', color: color, fontWeight: 600 }}>
                                            ← Current Rating
                                        </span>
                                    )}
                                </div>
                                <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                                    {criteria.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Navigation */}
            {countryCode && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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

export default QualitativeIndicatorDetail;
