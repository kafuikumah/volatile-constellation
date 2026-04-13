'use client';

import Link from 'next/link';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';
import { getLatestValue, formatIndicatorValue, formatPopulation } from '@/lib/utils';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { INCOME_LEVELS } from '@/lib/constants';
import { VISIBLE_INDICATORS } from '@/data/indicators';

/** Key indicators to show in the panel (in order of priority) */
const KEY_INDICATOR_IDS = [
    'gghe_per_capita',
    'gghe_gdp',
    'oop_che',
    'uhc_service_coverage',
    'gdp_per_capita',
    'gghe_gge',
    'external_resources_che',
    'maternal_mortality',
    'under5_mortality',
];

export function CountryInfoPanel() {
    const { country } = useSelectedCountry();

    if (!country) return null;

    const incomeLabel = INCOME_LEVELS.find(l => l.id === country.incomeLevel)?.label ?? country.incomeLevel;

    // Only show indicators that have actual values — no N/A
    const indicatorsWithValues = KEY_INDICATOR_IDS
        .map(id => {
            const ind = VISIBLE_INDICATORS.find(v => v.id === id);
            if (!ind) return null;
            const latest = getLatestValue(country.indicators[id]);
            if (latest?.value == null) return null;
            return { ind, latest };
        })
        .filter(Boolean) as { ind: typeof VISIBLE_INDICATORS[number]; latest: { value: number; year: number; source: string } }[];

    return (
        <div className="w-[320px] h-full bg-white rounded-xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
            {/* Country Header */}
            <div className="p-4 border-b border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
                    Country
                </p>
                <div className="flex items-center gap-3 mb-3">
                    <CountryFlag code={country.code} name={country.name} size="md" />
                    <div>
                        <span className="text-lg font-semibold text-slate-900 block leading-tight">{country.name}</span>
                        <span className="text-xs text-slate-500">{country.fullName}</span>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">{country.region}</span>
                    {country.recs.slice(0, 2).map(rec => (
                        <span key={rec} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">{rec}</span>
                    ))}
                    <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">{incomeLabel}</span>
                </div>
            </div>

            {/* Population & Quick Stats */}
            <div className="px-4 py-3 border-b border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Population</p>
                        <p className="text-sm font-semibold text-slate-900 font-mono-data">
                            {formatPopulation(country.population)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Income Level</p>
                        <p className="text-sm font-semibold text-slate-900 font-mono-data">
                            {incomeLabel}
                        </p>
                    </div>
                </div>
            </div>

            {/* Key Indicator Snapshots — only those with values */}
            <div className="p-4 flex-1 overflow-y-auto min-h-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    Key Indicators
                </p>
                {indicatorsWithValues.length > 0 ? (
                    <div className="space-y-2.5">
                        {indicatorsWithValues.map(({ ind, latest }) => (
                            <div key={ind.id} className="flex items-center justify-between gap-2">
                                <span className="text-[12px] text-slate-600 truncate" title={ind.label}>
                                    {ind.label.length > 35 ? ind.label.substring(0, 33) + '…' : ind.label}
                                </span>
                                <span className="text-[12px] font-semibold text-slate-900 font-mono-data whitespace-nowrap">
                                    {formatIndicatorValue(latest.value, ind.unit)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No indicator data available</p>
                )}
            </div>

            {/* View Full Profile */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto shrink-0">
                <Link
                    href={`/country-profiles/${country.id}`}
                    className="w-full py-2 bg-black hover:bg-slate-800 text-white text-[12px] font-semibold rounded-[10px] transition-colors flex items-center justify-center gap-2"
                >
                    View Full Profile →
                </Link>
            </div>
        </div>
    );
}
