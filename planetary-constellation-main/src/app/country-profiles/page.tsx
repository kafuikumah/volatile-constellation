'use client';

import { useCountryFilter } from '@/hooks/useCountryFilter';
import { useState } from 'react';
import Link from 'next/link';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { formatPopulation, getLatestValue, formatIndicatorValue } from '@/lib/utils';
import { LayoutGrid, List, ChevronRight, Globe, AlertCircle, Building2 } from 'lucide-react';
import { Country } from '@/types/country';
import { PageLayout } from '@/components/layout/PageLayout';
import { GEOGRAPHIC_REGIONS, RECS, INCOME_LEVELS } from '@/lib/constants';

export default function CountryProfilesPage() {
    const {
        searchQuery, setSearchQuery,
        regionFilter, setRegionFilter,
        recFilter, setRecFilter,
        incomeLevelFilter, setIncomeLevelFilter,
        filtered,
    } = useCountryFilter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const sidebar = (
        <aside className="w-[280px] bg-white rounded-[10px] shadow-sm border border-slate-200 flex flex-col flex-shrink-0 h-full p-4 overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Filters</h2>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Search Country</label>
                    <div className="relative">
                        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Type country name..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Region</label>
                    <div className="relative">
                        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all cursor-pointer"
                        >
                            <option value="">All Regions</option>
                            {GEOGRAPHIC_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">REC</label>
                    <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={recFilter}
                            onChange={(e) => setRecFilter(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all cursor-pointer"
                        >
                            <option value="">All RECs</option>
                            {RECS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Income Level</label>
                    <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={incomeLevelFilter}
                            onChange={(e) => setIncomeLevelFilter(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all cursor-pointer"
                        >
                            <option value="">All Income Levels</option>
                            {INCOME_LEVELS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </aside>
    );

    return (
        <PageLayout sidebar={sidebar}>
            <div className="flex flex-col h-full relative overflow-hidden">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-6 pb-2 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 mb-1">Country Profiles</h1>
                        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            Showing {filtered.length} of 55 AU Member States
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#F29D38]' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#F29D38]' : 'text-slate-400 hover:text-slate-600'}`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {filtered.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                            <AlertCircle className="w-12 h-12 opacity-20" />
                            <p className="text-sm">No countries match your filters.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setRegionFilter(''); setRecFilter(''); setIncomeLevelFilter(''); }}
                                className="text-[#F29D38] text-sm font-semibold hover:underline"
                            >
                                Reset filters
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map(c => <CountryCard key={c.id} country={c} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50 font-semibold text-xs text-slate-500 uppercase tracking-widest">
                                <div className="col-span-4">Country</div>
                                <div className="col-span-2">Region</div>
                                <div className="col-span-2">Income</div>
                                <div className="col-span-3">Key Metrics</div>
                                <div className="col-span-1 text-right">Details</div>
                            </div>
                            {filtered.map(c => <CountryListRow key={c.id} country={c} />)}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}

function CountryCard({ country }: { country: Country }) {
    const ggheGdp = getLatestValue(country.indicators['gghe_gdp']);
    const gghePerCapita = getLatestValue(country.indicators['gghe_per_capita']);
    const oopChe = getLatestValue(country.indicators['oop_che']);

    return (
        <Link href={`/country-profiles/${country.id}`}>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-[#F29D38]/40 transition-all group flex flex-col h-full cursor-pointer relative top-0 hover:-top-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <CountryFlag code={country.code} name={country.name} size="md" />
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#F29D38] transition-colors">{country.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{country.region}</p>
                        </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">
                        {country.incomeLevel}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-4">
                    <div>
                        <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">Per Capita</p>
                        <p className="text-sm font-semibold font-mono-data text-slate-900">
                            {gghePerCapita?.value != null ? `$${gghePerCapita.value.toFixed(0)}` : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">Health/GDP</p>
                        <p className="text-sm font-semibold font-mono-data text-slate-900">
                            {ggheGdp?.value != null ? `${ggheGdp.value.toFixed(1)}%` : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-auto">
                    {country.recs.slice(0, 3).map(rec => (
                        <span key={rec} className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">{rec}</span>
                    ))}
                </div>
            </div>
        </Link>
    );
}

function CountryListRow({ country }: { country: Country }) {
    const ggheGdp = getLatestValue(country.indicators['gghe_gdp']);
    const gghePerCapita = getLatestValue(country.indicators['gghe_per_capita']);

    return (
        <Link href={`/country-profiles/${country.id}`}>
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 hover:bg-orange-50/50 transition-colors items-center group">
                <div className="col-span-4 flex items-center gap-3">
                    <CountryFlag code={country.code} name={country.name} size="sm" />
                    <span className="font-semibold text-slate-900 group-hover:text-[#F29D38] transition-colors">{country.name}</span>
                </div>
                <div className="col-span-2 text-slate-600 flex flex-col gap-0.5">
                    <span className="text-sm">{country.region}</span>
                    <div className="flex gap-1">
                        {country.recs.slice(0, 2).map(rec => (
                            <span key={rec} className="text-[9px] text-blue-500 font-semibold">{rec}</span>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">{country.incomeLevel}</span>
                </div>
                <div className="col-span-3 flex flex-col gap-0.5 text-xs">
                    <span className="text-slate-600">
                        <strong className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider w-8 inline-block">PER</strong>{' '}
                        {gghePerCapita?.value != null ? `$${gghePerCapita.value.toFixed(0)}` : 'N/A'}
                    </span>
                    <span className="text-slate-600">
                        <strong className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider w-8 inline-block">GDP</strong>{' '}
                        {ggheGdp?.value != null ? `${ggheGdp.value.toFixed(1)}%` : 'N/A'}
                    </span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F29D38] transition-colors group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
