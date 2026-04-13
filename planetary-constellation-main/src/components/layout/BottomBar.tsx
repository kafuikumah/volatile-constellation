'use client';

import { useSelectedCountry } from '@/hooks/useSelectedCountry';
import { cn } from '@/lib/utils';
import { BOTTOM_BAR_CATEGORIES, INDICATOR_CATEGORY_COLORS } from '@/lib/constants';
import { getLatestValue, formatIndicatorValue } from '@/lib/utils';
import { VISIBLE_INDICATORS } from '@/data/indicators';
import Link from 'next/link';

export function BottomBar() {
    const { country } = useSelectedCountry();

    if (!country) return null;

    return (
        <div className="h-[60px] bg-white rounded-[10px] shadow-sm border border-slate-200 flex items-center px-4 gap-6 flex-shrink-0 z-10 overflow-x-auto">
            {/* Country */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Country</p>
                <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`https://flagcdn.com/w20/${country.code}.png`}
                        alt={`${country.name} flag`}
                        className="w-5 h-4 object-cover rounded-sm"
                        width={20}
                        height={15}
                    />
                    <span className="text-sm font-medium text-slate-900 border-b-2 border-orange-500 pb-0.5">
                        {country.name}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-200 flex-shrink-0" />

            {/* Indicator Category Summaries */}
            {BOTTOM_BAR_CATEGORIES.map((cat) => {
                // Get count of indicators with data in this category
                const categoryIndicators = VISIBLE_INDICATORS.filter(i => i.category === cat.key);
                const withData = categoryIndicators.filter(ind => {
                    const latest = getLatestValue(country.indicators[ind.id]);
                    return latest?.value !== null && latest?.value !== undefined;
                });
                const total = categoryIndicators.length;
                const available = withData.length;
                const color = INDICATOR_CATEGORY_COLORS[cat.key as keyof typeof INDICATOR_CATEGORY_COLORS] || '#64748B';

                return (
                    <div key={cat.key} className="flex-shrink-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{cat.label}</p>
                        <p className="text-sm font-semibold font-mono-data" style={{ color }}>
                            {available}/{total}
                        </p>
                    </div>
                );
            })}

            {/* All Indicators Link */}
            <div className="ml-auto pl-4 border-l border-slate-200 flex-shrink-0">
                <Link
                    href="/country-profiles"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200"
                >
                    All Indicators →
                </Link>
            </div>
        </div>
    );
}
