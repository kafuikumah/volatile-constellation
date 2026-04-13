'use client';

import { Search, ChevronDown, Globe, Building2 } from 'lucide-react';
import { getAllCountriesAlphabetical } from '@/data/countries';
import { useCountryFilter } from '@/hooks/useCountryFilter';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';
import { cn } from '@/lib/utils';
import { GEOGRAPHIC_REGIONS, RECS, APP_NAME, APP_VERSION } from '@/lib/constants';

interface CountrySidebarProps {
    selectedCountry?: string;
    onCountrySelect?: (id: string) => void;
}

export function CountrySidebar({ selectedCountry, onCountrySelect }: CountrySidebarProps = {}) {
    const {
        searchQuery, setSearchQuery,
        regionFilter, setRegionFilter,
        recFilter, setRecFilter,
        filtered,
    } = useCountryFilter();
    const { selectedId: contextSelectedId, setSelectedId: contextSetSelectedId } = useSelectedCountry();

    const currentSelectedId = selectedCountry !== undefined ? selectedCountry : contextSelectedId;
    const handleSelect = onCountrySelect || contextSetSelectedId;

    return (
        <aside className="w-[280px] bg-white rounded-[10px] shadow-sm border border-slate-200 flex flex-col flex-shrink-0 h-full overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-slate-100 flex-shrink-0 space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Country"
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29D38]/30 focus:border-[#F29D38] transition-all"
                    />
                </div>

                {/* Region filter */}
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#F29D38]/30 focus:border-[#F29D38] transition-all appearance-none bg-white"
                    >
                        <option value="">All Regions</option>
                        {GEOGRAPHIC_REGIONS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* REC filter */}
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <select
                        value={recFilter}
                        onChange={(e) => setRecFilter(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#F29D38]/30 focus:border-[#F29D38] transition-all appearance-none bg-white"
                    >
                        <option value="">All RECs</option>
                        {RECS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Country list */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-0.5">
                    {filtered.map((country) => (
                        <button
                            key={country.id}
                            onClick={() => handleSelect(country.id)}
                            className={cn(
                                'w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 text-sm font-medium transition-all',
                                currentSelectedId === country.id
                                    ? 'bg-[#F29D38]/10 text-[#F29D38]'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://flagcdn.com/w20/${country.code}.png`}
                                alt={`${country.name} flag`}
                                className="w-6 h-4 object-cover rounded-[2px] shadow-sm flex-shrink-0"
                                width={24}
                                height={16}
                            />
                            <span className="truncate">{country.name}</span>
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-8">No countries found</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                <p className="text-[10px] text-slate-400 text-center font-medium uppercase tracking-wider">
                    {APP_NAME} {APP_VERSION}
                </p>
            </div>
        </aside>
    );
}
