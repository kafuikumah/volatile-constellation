'use client';

import { getLatestValue, formatIndicatorValue, getIndicatorStatus, computeTrend } from '@/lib/utils';
import { INDICATOR_CATEGORY_COLORS } from '@/lib/constants';
import { Country } from '@/types/country';
import { Indicator, IndicatorCategory } from '@/types/indicator';
import { BenchmarkBadge } from '@/components/shared/BenchmarkBadge';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface IndicatorCategoryCardProps {
    category: {
        id: IndicatorCategory;
        label: string;
        color: string;
        description: string;
    };
    indicators: Indicator[];
    country: Country;
    defaultExpanded?: boolean;
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' | null }) {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    if (trend === 'stable') return <Minus className="w-3.5 h-3.5 text-slate-400" />;
    return null;
}

export function IndicatorCategoryCard({ category, indicators, country, defaultExpanded = false }: IndicatorCategoryCardProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const color = INDICATOR_CATEGORY_COLORS[category.id] || category.color;

    // Count indicators with data
    const withData = indicators.filter(ind => {
        const latest = getLatestValue(country.indicators[ind.id]);
        return latest?.value !== null && latest?.value !== undefined;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
            >
                <div className="w-3 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 text-left">
                    <h3 className="text-sm font-semibold text-slate-900">{category.label}</h3>
                    <p className="text-[11px] text-slate-500">{category.description}</p>
                </div>
                <span className="text-xs text-slate-400 font-medium mr-2">{withData.length}/{indicators.length} available</span>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Indicator rows */}
            {expanded && (
                <div className="border-t border-slate-100">
                    {indicators.map((ind) => {
                        const latest = getLatestValue(country.indicators[ind.id]);
                        const value = latest?.value ?? null;
                        const year = latest?.year;
                        const source = latest?.source ?? ind.source;
                        const trend = computeTrend(country.indicators[ind.id]);
                        const status = getIndicatorStatus(value, ind);

                        return (
                            <div key={ind.id} className="px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 font-medium">{ind.label}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {ind.benchmark && (
                                                <span className="text-[10px] text-slate-400">Target: {ind.benchmark}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <TrendIcon trend={trend} />
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900 font-mono-data">
                                                {formatIndicatorValue(value, ind.unit)}
                                            </p>
                                            {year && (
                                                <p className="text-[10px] text-slate-400">{year} · {source}</p>
                                            )}
                                        </div>
                                        <BenchmarkBadge status={status} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
