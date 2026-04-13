'use client';

import { CountryFlag } from '@/components/shared/CountryFlag';
import { formatPopulation, getLatestValue, formatIndicatorValue } from '@/lib/utils';
import { Country } from '@/types/country';
import { INCOME_LEVELS } from '@/lib/constants';

interface CountryProfileHeaderProps {
    country: Country;
}

const HEADLINE_STATS = [
    { id: 'gdp_per_capita', label: 'GDP per Capita', unit: 'USD' },
    { id: 'gghe_per_capita', label: 'Health Spend/Capita', unit: 'USD' },
    { id: 'gghe_gdp', label: 'GGHE % of GDP', unit: '%' },
    { id: 'oop_che', label: 'OOP Spending', unit: '%' },
];

export function CountryProfileHeader({ country }: CountryProfileHeaderProps) {
    const incomeLabel = INCOME_LEVELS.find(l => l.id === country.incomeLevel)?.label ?? country.incomeLevel;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {/* Top section */}
            <div className="flex items-start gap-5 mb-6">
                <CountryFlag code={country.code} name={country.name} size="lg" />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">{country.name}</h1>
                    <p className="text-sm text-slate-500 mb-3">{country.fullName}</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                            {country.region}
                        </span>
                        {country.recs.map(rec => (
                            <span key={rec} className="text-[11px] px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                                {rec}
                            </span>
                        ))}
                        <span className="text-[11px] px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
                            {incomeLabel}
                        </span>
                        {country.auJoined && (
                            <span className="text-[11px] px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                                AU since {country.auJoined}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Population</p>
                    <p className="text-lg font-bold text-slate-900 font-mono-data">{formatPopulation(country.population)}</p>
                </div>
            </div>

            {/* Headline Stats Strip */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                {HEADLINE_STATS.map((stat) => {
                    const latest = getLatestValue(country.indicators[stat.id]);
                    return (
                        <div key={stat.id} className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                                {stat.label}
                            </p>
                            <p className="text-lg font-bold text-slate-900 font-mono-data">
                                {formatIndicatorValue(latest?.value ?? null, stat.unit)}
                            </p>
                            {latest?.year && (
                                <p className="text-[10px] text-slate-400">{latest.year}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
