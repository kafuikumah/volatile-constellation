'use client';

import { cn } from '@/lib/utils';

interface BenchmarkBadgeProps {
    status: 'meets' | 'below' | 'above' | 'no_data' | 'no_benchmark';
    className?: string;
}

const statusConfig = {
    meets: { text: 'Meets Target', bg: 'bg-green-50', color: 'text-green-700', dot: 'bg-green-500' },
    below: { text: 'Below Target', bg: 'bg-red-50', color: 'text-red-700', dot: 'bg-red-500' },
    above: { text: 'Above Threshold', bg: 'bg-red-50', color: 'text-red-700', dot: 'bg-red-500' },
    no_data: { text: 'No Data', bg: 'bg-slate-50', color: 'text-slate-500', dot: 'bg-slate-400' },
    no_benchmark: { text: 'Track Trend', bg: 'bg-slate-50', color: 'text-slate-500', dot: 'bg-slate-400' },
};

export function BenchmarkBadge({ status, className }: BenchmarkBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full', config.bg, config.color, className)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
            {config.text}
        </span>
    );
}
