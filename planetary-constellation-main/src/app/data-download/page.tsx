'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { countries, getAllCountriesAlphabetical } from '@/data/countries';
import { VISIBLE_INDICATORS, ALL_INDICATORS } from '@/data/indicators';
import { INDICATOR_CATEGORIES, GEOGRAPHIC_REGIONS, RECS, INCOME_LEVELS } from '@/lib/constants';
import { getLatestValue, formatIndicatorValue } from '@/lib/utils';
import { Download, FileSpreadsheet, FileText, Filter, ChevronDown, Globe, Building2 } from 'lucide-react';
import { Country } from '@/types/country';

export default function DataDownloadPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedRec, setSelectedRec] = useState<string>('');
    const [selectedIncome, setSelectedIncome] = useState<string>('');
    const [format, setFormat] = useState<'csv' | 'xlsx'>('csv');

    const filteredCountries = countries.filter(c => {
        if (selectedRegion && c.region !== selectedRegion) return false;
        if (selectedRec && !c.recs.includes(selectedRec)) return false;
        if (selectedIncome && c.incomeLevel !== selectedIncome) return false;
        return true;
    });

    const filteredIndicators = selectedCategory === 'all'
        ? VISIBLE_INDICATORS
        : VISIBLE_INDICATORS.filter(i => i.category === selectedCategory);

    const handleDownload = () => {
        // Build CSV
        const headers = ['Country', 'Region', 'Income Level', ...filteredIndicators.map(i => i.label)];
        const rows = filteredCountries.map(c => {
            const values = filteredIndicators.map(ind => {
                const latest = getLatestValue(c.indicators[ind.id]);
                return latest?.value != null ? String(latest.value) : '';
            });
            return [c.name, c.region, c.incomeLevel, ...values];
        });

        const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `africa_health_financing_${selectedCategory}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const sidebar = (
        <aside className="w-[280px] bg-white rounded-[10px] shadow-sm border border-slate-200 flex flex-col flex-shrink-0 h-full p-4 overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Download Filters</h2>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
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

                <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Region</label>
                    <div className="relative">
                        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
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
                            value={selectedRec}
                            onChange={(e) => setSelectedRec(e.target.value)}
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
                        <select
                            value={selectedIncome}
                            onChange={(e) => setSelectedIncome(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#F29D38]/50 focus:border-[#F29D38] transition-all cursor-pointer"
                        >
                            <option value="">All Income Levels</option>
                            {INCOME_LEVELS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Format</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFormat('csv')}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${format === 'csv' ? 'bg-[#F29D38] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <FileText className="w-3.5 h-3.5" /> CSV
                        </button>
                        <button
                            onClick={() => setFormat('xlsx')}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${format === 'xlsx' ? 'bg-[#F29D38] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={handleDownload}
                className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
                <Download className="w-4 h-4" />
                Download Data
            </button>
        </aside>
    );

    return (
        <PageLayout sidebar={sidebar}>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="p-6 pb-2 shrink-0">
                    <h1 className="text-xl font-bold text-slate-900">Data Download</h1>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                        {filteredCountries.length} countries · {filteredIndicators.length} indicators
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Preview Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-400" />
                                Data Preview
                            </h3>
                            <span className="text-xs text-slate-400">
                                Showing first 10 rows
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold sticky left-0 bg-slate-50 z-10">Country</th>
                                        <th className="text-left px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Region</th>
                                        {filteredIndicators.slice(0, 6).map(ind => (
                                            <th key={ind.id} className="text-right px-4 py-3 text-xs text-slate-500 uppercase tracking-wider font-semibold whitespace-nowrap max-w-[120px]">
                                                <span className="truncate block" title={ind.label}>{ind.label.length > 20 ? ind.label.slice(0, 18) + '...' : ind.label}</span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCountries.slice(0, 10).map(c => (
                                        <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-medium text-slate-900 sticky left-0 bg-white z-10 whitespace-nowrap">{c.name}</td>
                                            <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.region}</td>
                                            {filteredIndicators.slice(0, 6).map(ind => {
                                                const latest = getLatestValue(c.indicators[ind.id]);
                                                return (
                                                    <td key={ind.id} className="px-4 py-3 text-right font-mono-data text-slate-700">
                                                        {formatIndicatorValue(latest?.value ?? null, ind.unit)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredCountries.length > 10 && (
                            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                                <p className="text-xs text-slate-400">
                                    + {filteredCountries.length - 10} more countries in full download
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Source Info */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Data Sources</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs text-blue-800">
                            <div>• WHO Global Health Expenditure Database (GHED)</div>
                            <div>• World Bank World Development Indicators (WDI)</div>
                            <div>• IMF World Economic Outlook (WEO)</div>
                            <div>• WHO Global Health Observatory (GHO)</div>
                            <div>• Mo Ibrahim Foundation (IIAG)</div>
                            <div>• UNICEF/WHO Joint Database</div>
                        </div>
                        <p className="text-[10px] text-blue-600 mt-3">
                            Data is provided for research and advocacy purposes. Please cite the original source when using this data.
                        </p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
