'use client';

import { useMemo } from 'react';
import { countries } from '@/data/countries';
import { getIndicatorById } from '@/data/indicators';
import { getLatestValue, computeIndicatorBands } from '@/lib/utils';

interface MapLegendProps {
    selectedIndicatorId: string;
}

export function MapLegend({ selectedIndicatorId }: MapLegendProps) {
    const indicator = getIndicatorById(selectedIndicatorId);

    const bands = useMemo(() => {
        if (!indicator) return [];

        const values: number[] = [];
        for (const c of countries) {
            const latest = getLatestValue(c.indicators[selectedIndicatorId]);
            if (latest?.value != null) {
                values.push(latest.value);
            }
        }

        return computeIndicatorBands(values, indicator.benchmarkDirection, indicator.unit);
    }, [selectedIndicatorId, indicator]);

    if (bands.length === 0) return null;

    // Show bands in descending order (highest at top) for readability
    const displayBands = [...bands].reverse();

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-3 max-w-[240px]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 leading-tight">
                {indicator?.label ?? 'Legend'}
            </p>
            {indicator?.unit && (
                <p className="text-[9px] text-slate-300 mb-2">{indicator.unit}</p>
            )}
            <div className="space-y-1">
                {displayBands.map((band, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: band.color }} />
                        <span className="text-[10px] text-slate-600">{band.label}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#CBD5E1' }} />
                    <span className="text-[10px] text-slate-600">No data</span>
                </div>
            </div>
        </div>
    );
}
