'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useComparison } from '@/hooks/useComparison';
import { getAllCountriesAlphabetical } from '@/data/countries';
import { INDICATOR_CATEGORIES } from '@/lib/constants';
import { VISIBLE_INDICATORS } from '@/data/indicators';
import { CountryFlag } from '@/components/shared/CountryFlag';
import { getLatestValue, formatIndicatorValue, cn } from '@/lib/utils';
import { X, BarChart2, Search, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-slate-100 rounded-lg h-full" />,
});

const allCountries = getAllCountriesAlphabetical();
const chartColors = ['#F97316', '#3B82F6', '#22C55E', '#8B5CF6', '#06B6D4', '#EF4444'];

export default function ComparisonPage() {
    const { selectedIds, toggleCountry, removeCountry, clearAll, selectedCountries } = useComparison();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchInput, setSearchInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');

    const filteredDropdown = searchInput
        ? allCountries.filter(c => c.name.toLowerCase().includes(searchInput.toLowerCase()))
        : allCountries;

    const displayIndicators = selectedCategory === 'all'
        ? INDICATOR_CATEGORIES.map(c => c.label)
        : VISIBLE_INDICATORS.filter(i => i.category === selectedCategory).map(i => i.label);

    const sidebar = (
        <aside className="w-[280px] bg-white rounded-[10px] shadow-sm border border-slate-200 flex flex-col flex-shrink-0 h-full p-4 overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Comparison Setup</h2>

            {/* Country selector */}
            <div className="mb-4">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Select Countries</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => { setSearchInput(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search countries..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all"
                    />
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-30">
                            {filteredDropdown.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => { toggleCountry(c.id); setShowDropdown(false); setSearchInput(''); }}
                                    className={cn(
                                        'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2',
                                        selectedIds.includes(c.id) && 'bg-orange-50 text-orange-600'
                                    )}
                                >
                                    <CountryFlag code={c.code} name={c.name} size="sm" />
                                    {c.name}
                                    {selectedIds.includes(c.id) && <span className="ml-auto text-xs">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {/* Selected chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCountries.map(c => (
                        <span key={c.id} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            {c.name}
                            <button onClick={() => removeCountry(c.id)} className="hover:text-orange-900"><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Indicator selector */}
            <div className="mb-4">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Compare By</label>
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {INDICATOR_CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {selectedCountries.length > 0 && (
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium self-start">
                    Clear all
                </button>
            )}
        </aside>
    );

    return (
        <PageLayout sidebar={sidebar}>
            <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Comparison Matrix</h1>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                            {selectedCountries.length > 0 ? `Comparing ${selectedCountries.length} countries` : 'Select countries to compare'}
                        </p>
                    </div>
                    {selectedCountries.length > 1 && (
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                            <button onClick={() => setChartType('bar')} className={cn('px-3 py-1 text-xs rounded-md', chartType === 'bar' ? 'bg-white shadow-sm font-semibold' : 'text-slate-500')}>Bar</button>
                            <button onClick={() => setChartType('radar')} className={cn('px-3 py-1 text-xs rounded-md', chartType === 'radar' ? 'bg-white shadow-sm font-semibold' : 'text-slate-500')}>Radar</button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {selectedCountries.length === 0 ? (
                        <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                            <BarChart2 className="w-12 h-12 mb-3 opacity-30" />
                            <p className="text-sm font-medium">No Countries Selected</p>
                            <p className="text-xs mt-1">Use the sidebar to select countries for comparison</p>
                        </div>
                    ) : (
                        <>
                            {/* Chart */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[400px]">
                                <ReactECharts
                                    option={{
                                        tooltip: { trigger: 'axis' },
                                        legend: { data: selectedCountries.map(c => c.name), bottom: 0 },
                                        ...(chartType === 'bar' ? {
                                            xAxis: { type: 'category', data: displayIndicators, axisLabel: { rotate: displayIndicators.length > 5 ? 30 : 0, fontSize: 10 } },
                                            yAxis: { type: 'value' },
                                            series: selectedCountries.map((c, i) => ({
                                                name: c.name,
                                                type: 'bar',
                                                data: displayIndicators.map(() => Math.random() * 100), // Placeholder — will use real data
                                                itemStyle: { color: chartColors[i % chartColors.length], borderRadius: [4, 4, 0, 0] },
                                            })),
                                        } : {
                                            radar: { indicator: displayIndicators.map(d => ({ name: d, max: 100 })), shape: 'polygon' },
                                            series: [{ type: 'radar', data: selectedCountries.map((c, i) => ({
                                                value: displayIndicators.map(() => Math.random() * 100),
                                                name: c.name,
                                                lineStyle: { color: chartColors[i % chartColors.length] },
                                                areaStyle: { color: chartColors[i % chartColors.length], opacity: 0.1 },
                                            })) }],
                                        }),
                                    }}
                                    style={{ height: '100%' }}
                                    opts={{ renderer: 'svg' }}
                                    notMerge
                                />
                            </div>

                            {/* Comparison Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-900">Detailed Comparison</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Country</th>
                                                <th className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Region</th>
                                                <th className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Income</th>
                                                <th className="text-right px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Health/GDP</th>
                                                <th className="text-right px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Per Capita</th>
                                                <th className="text-right px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">OOP %</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedCountries.map(c => {
                                                const ggheGdp = getLatestValue(c.indicators['gghe_gdp']);
                                                const perCap = getLatestValue(c.indicators['gghe_per_capita']);
                                                const oop = getLatestValue(c.indicators['oop_che']);
                                                return (
                                                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                        <td className="px-4 py-3 flex items-center gap-2">
                                                            <CountryFlag code={c.code} name={c.name} size="sm" />
                                                            <span className="font-medium">{c.name}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600">{c.region}</td>
                                                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{c.incomeLevel}</span></td>
                                                        <td className="px-4 py-3 text-right font-mono-data font-semibold">{formatIndicatorValue(ggheGdp?.value ?? null, '%')}</td>
                                                        <td className="px-4 py-3 text-right font-mono-data font-semibold">{formatIndicatorValue(perCap?.value ?? null, 'USD')}</td>
                                                        <td className="px-4 py-3 text-right font-mono-data font-semibold">{formatIndicatorValue(oop?.value ?? null, '%')}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
