'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { useBenchmark } from '@/hooks/useBenchmark';
import { getAllCountriesAlphabetical } from '@/data/countries';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { cn, formatPopulation } from '@/lib/utils';
import { INDICATOR_CATEGORY_COLORS, INCOME_LEVELS } from '@/lib/constants';
import { BenchmarkDimensionType } from '@/types/benchmark';
import { Globe, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-slate-100 rounded-lg h-full" />,
});

const allCountries = getAllCountriesAlphabetical();

const DIMENSIONS: { id: BenchmarkDimensionType; label: string }[] = [
    { id: 'geographic_region', label: 'Region' },
    { id: 'rec', label: 'REC' },
    { id: 'income_level', label: 'Income' },
    { id: 'governance_tier', label: 'Governance' },
];

export default function BenchmarkingPage() {
    const {
        focusCountryId, setFocusCountryId,
        dimension, setDimension,
        focusCountry, peerGroup, gapAnalysis,
    } = useBenchmark();

    const incomeLabel = focusCountry
        ? INCOME_LEVELS.find(l => l.id === focusCountry.incomeLevel)?.label ?? focusCountry.incomeLevel
        : '';

    const sidebar = (
        <aside className="w-[280px] bg-white rounded-[10px] shadow-sm border border-slate-200 flex flex-col flex-shrink-0 h-full p-4 overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Benchmarking</h2>

            {/* Focus Country */}
            <div className="mb-6">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Focus Country</label>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        value={focusCountryId ?? ''}
                        onChange={(e) => setFocusCountryId(e.target.value || null)}
                        className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all cursor-pointer"
                    >
                        <option value="">Select a country</option>
                        {allCountries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Peer Group Dimension */}
            <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Peer Group By</label>
                <div className="space-y-1.5">
                    {DIMENSIONS.map(d => (
                        <button
                            key={d.id}
                            onClick={() => setDimension(d.id)}
                            className={cn(
                                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                dimension === d.id
                                    ? 'bg-[#F29D38]/10 text-[#F29D38] border border-[#F29D38]/30'
                                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                            )}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );

    return (
        <PageLayout sidebar={sidebar}>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="p-6 pb-2 shrink-0">
                    <h1 className="text-xl font-bold text-slate-900">Benchmarking & Analytics</h1>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                        {focusCountry ? `${focusCountry.name} vs ${dimension.replace('_', ' ')} peers` : 'Select a country to begin'}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {!focusCountry ? (
                        <div className="h-[300px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                            <p className="text-sm">Select a focus country from the sidebar</p>
                        </div>
                    ) : (
                        <>
                            {/* Scorecard + Radar */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Country Scorecard */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <CountryFlag code={focusCountry.code} name={focusCountry.name} size="lg" />
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{focusCountry.name}</h3>
                                            <p className="text-xs text-slate-500">{focusCountry.region} · {incomeLabel}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Population</p>
                                            <p className="text-lg font-bold text-slate-900 font-mono-data">{formatPopulation(focusCountry.population)}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Peer Group Size</p>
                                            <p className="text-lg font-bold text-slate-900 font-mono-data">{peerGroup.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Radar Chart */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category Comparison</p>
                                    <div className="h-[280px]">
                                        <ReactECharts
                                            option={{
                                                radar: {
                                                    indicator: gapAnalysis.map(g => ({ name: g.category, max: 100 })),
                                                    shape: 'polygon',
                                                },
                                                series: [{
                                                    type: 'radar',
                                                    data: [
                                                        {
                                                            value: gapAnalysis.map(g => g.countryScore ?? 0),
                                                            name: focusCountry.name,
                                                            lineStyle: { color: '#F29D38' },
                                                            areaStyle: { color: '#F29D38', opacity: 0.15 },
                                                        },
                                                        {
                                                            value: gapAnalysis.map(g => g.peerAverage ?? 0),
                                                            name: 'Peer Average',
                                                            lineStyle: { color: '#94A3B8', type: 'dashed' },
                                                            areaStyle: { color: '#94A3B8', opacity: 0.05 },
                                                        },
                                                    ],
                                                }],
                                                legend: { data: [focusCountry.name, 'Peer Average'], bottom: 0, textStyle: { fontSize: 11 } },
                                            }}
                                            style={{ height: '100%' }}
                                            opts={{ renderer: 'svg' }}
                                            notMerge
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Gap Analysis */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Gap Analysis vs Peer Average</h3>
                                <div className="space-y-3">
                                    {gapAnalysis.map(g => (
                                        <div key={g.categoryId} className="flex items-center gap-4">
                                            <div className="w-32 text-sm text-slate-600 text-right flex-shrink-0">{g.category}</div>
                                            <div className="flex-1 h-6 bg-slate-100 rounded-full relative overflow-hidden">
                                                <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300 z-10" />
                                                {g.delta !== null && (
                                                    <div
                                                        className={cn('absolute inset-y-0 rounded-full', g.delta >= 0 ? 'bg-green-400' : 'bg-red-400')}
                                                        style={{
                                                            left: g.delta >= 0 ? '50%' : `${50 + g.delta * 0.5}%`,
                                                            width: `${Math.abs(g.delta) * 0.5}%`,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="w-16 text-right text-sm font-semibold font-mono-data">
                                                {g.delta !== null ? (
                                                    <span className={g.delta >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {g.delta >= 0 ? '+' : ''}{g.delta.toFixed(1)}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">N/A</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Peer Rankings */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900">Peer Group Rankings</h3>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {peerGroup.map((c, i) => (
                                        <div
                                            key={c.id}
                                            className={cn(
                                                'flex items-center px-4 py-3 gap-4',
                                                c.id === focusCountry.id && 'bg-orange-50/50 border-l-2 border-[#F29D38]'
                                            )}
                                        >
                                            <span className="text-sm font-semibold text-slate-400 w-6">{i + 1}</span>
                                            <CountryFlag code={c.code} name={c.name} size="sm" />
                                            <span className={cn('text-sm font-medium flex-1', c.id === focusCountry.id ? 'text-[#F29D38] font-bold' : 'text-slate-800')}>
                                                {c.name}
                                            </span>
                                            <span className="text-xs text-slate-400">{c.incomeLevel}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
