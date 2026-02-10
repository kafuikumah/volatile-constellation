import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AU_MEMBER_STATES } from '../utils/countries';
import { fetchCountryDebtData } from '../services/worldBankApi';
import CountryCard from './CountryCard';
import { getCountryOverallRisk } from '../utils/debtModel';
import { Search, Filter } from 'lucide-react';

const CountryList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('ALL');

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            // Load data for all countries
            // In a real app, this should be in a context or shared state to avoid re-fetching
            // For this refactor, we'll keep it simple and fetch again or ideally use a cache

            // Optimization: Check if we have data for all countries in sessionStorage?
            // The service layer handles some caching.

            const results = await Promise.all(AU_MEMBER_STATES.map(c =>
                fetchCountryDebtData(c.code).then(d => ({ ...d, countryName: c.name }))
            ));

            setData(results);
            setLoading(false);
        };

        loadAllData();
    }, []);

    const filteredData = data.filter(c => {
        const matchesSearch = c.countryName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = filterRisk === 'ALL' || getCountryOverallRisk(c) === filterRisk;
        return matchesSearch && matchesRisk;
    });

    return (
        <div className="country-list">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ textAlign: 'left', margin: 0 }}>Member States Debt Profile</h2>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Filter size={20} color="var(--color-text-secondary)" />
                        {['ALL', 'LOW', 'MODERATE', 'HIGH'].map(risk => (
                            <button
                                key={risk}
                                onClick={() => setFilterRisk(risk)}
                                style={{
                                    borderRadius: '9999px',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: filterRisk === risk ? 'var(--color-accent)' : 'transparent',
                                    color: filterRisk === risk ? '#fff' : 'var(--color-text-secondary)',
                                    border: filterRisk === risk ? 'none' : '1px solid var(--color-border)'
                                }}
                            >
                                {risk}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '4rem' }}>Loading debt data from World Bank...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredData.map(country => (
                        <CountryCard
                            key={country.countryCode}
                            countryData={country}
                            onClick={() => navigate(`/country/${country.countryCode}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CountryList;
