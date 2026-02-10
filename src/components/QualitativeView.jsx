import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchQualitativeData, getQualitativeLevel } from '../services/qualitativeData';
import { getRiskColor } from '../utils/debtModel';
import { Search } from 'lucide-react';

const RatingCell = ({ rating, clickable = false }) => {
    const level = getQualitativeLevel(rating);
    const color = getRiskColor(level);

    return (
        <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: `${color}20`,
            color: color,
            fontWeight: '600',
            fontSize: '0.875rem',
            border: `1px solid ${color}`,
            cursor: clickable ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
        }}
            onMouseEnter={(e) => {
                if (clickable) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
                }
            }}
            onMouseLeave={(e) => {
                if (clickable) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                }
            }}
        >
            {rating}
            {clickable && <span style={{ marginLeft: '0.25rem', fontSize: '0.7rem' }}>→</span>}
        </div>
    );
};

const QualitativeView = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await fetchQualitativeData();
            setData(result);
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredData = data.filter(c =>
        c.countryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="qualitative-view">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ textAlign: 'left', margin: 0 }}>CAP Pillar 2: Debt Management Quality</h2>

                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 0.75rem 0.75rem 3rem',
                            borderRadius: '9999px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-primary)',
                            fontSize: '1rem'
                        }}
                    />
                </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe', color: '#1e40af', fontSize: '0.9rem', marginBottom: '2rem' }}>
                <strong>Metric Definitions:</strong><br />
                • <strong>Data Dissemination:</strong> Completeness, timeliness, and public availability of debt statistics.<br />
                • <strong>Debt Strategy (MTDS):</strong> Existence/Quality of a published Medium-Term Debt Management Strategy.<br />
                • <strong>Borrowing Plan:</strong> Publication of a transparent Annual Borrowing Plan.<br />
                • <strong>Domestic Market:</strong> Efforts towards developing a deep and liquid domestic debt market.
            </div>

            {loading ? (
                <div style={{ padding: '4rem' }}>Loading qualitative assessments...</div>
            ) : (
                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--color-bg-card)' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Country</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Data Dissemination</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Debt Strategy (MTDS)</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Borrowing Plan</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Domestic Market</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((country, index) => (
                                <tr key={country.countryCode} style={{ borderBottom: index !== filteredData.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                                        <Link to={`/country/${country.countryCode}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {country.countryName}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Link to={`/qualitative-indicator/DATA_DISSEMINATION/${country.countryCode}`} style={{ textDecoration: 'none' }}>
                                            <RatingCell rating={country.dataDissemination} clickable />
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Link to={`/qualitative-indicator/DEBT_STRATEGY/${country.countryCode}`} style={{ textDecoration: 'none' }}>
                                            <RatingCell rating={country.debtStrategy} clickable />
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Link to={`/qualitative-indicator/BORROWING_PLAN/${country.countryCode}`} style={{ textDecoration: 'none' }}>
                                            <RatingCell rating={country.borrowingPlan} clickable />
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Link to={`/qualitative-indicator/DOMESTIC_MARKET/${country.countryCode}`} style={{ textDecoration: 'none' }}>
                                            <RatingCell rating={country.domesticMarket} clickable />
                                        </Link>
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

export default QualitativeView;
