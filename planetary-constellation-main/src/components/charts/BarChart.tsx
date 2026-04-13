"use client";

import dynamic from "next/dynamic";

const ReactECharts = dynamic(
    () => import("echarts-for-react"),
    { ssr: false, loading: () => <div className="animate-pulse bg-slate-100 rounded-lg h-64" /> }
);

interface BarChartProps {
    categories: string[];
    data: { name: string; values: number[]; color?: string }[];
    title?: string;
    height?: number;
    horizontal?: boolean;
}

export function BarChart({ categories, data, title, height = 350, horizontal = false }: BarChartProps) {
    const defaultColors = ['#F97316', '#3B82F6', '#22C55E', '#8B5CF6', '#06B6D4', '#EF4444'];

    const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: data.length > 1 ? { data: data.map(d => d.name), bottom: 0, textStyle: { fontSize: 11, color: '#64748B' } } : undefined,
        grid: { left: '3%', right: '4%', bottom: data.length > 1 ? '15%' : '3%', top: title ? '12%' : '3%', containLabel: true },
        title: title ? { text: title, left: 'center', textStyle: { fontSize: 14, fontWeight: 600, color: '#0F172A' } } : undefined,
        [horizontal ? 'yAxis' : 'xAxis']: {
            type: 'category',
            data: categories,
            axisLabel: { fontSize: 11, color: '#64748B', rotate: horizontal ? 0 : (categories.length > 8 ? 45 : 0) },
            axisLine: { lineStyle: { color: '#E2E8F0' } },
        },
        [horizontal ? 'xAxis' : 'yAxis']: {
            type: 'value',
            max: 100,
            axisLabel: { fontSize: 11, color: '#64748B' },
            splitLine: { lineStyle: { color: '#F1F5F9' } },
        },
        series: data.map((d, i) => ({
            name: d.name,
            type: 'bar',
            data: d.values,
            barMaxWidth: 40,
            itemStyle: {
                color: d.color || defaultColors[i % defaultColors.length],
                borderRadius: [4, 4, 0, 0],
            },
        })),
    };

    return (
        <ReactECharts
            option={option}
            style={{ height, width: '100%' }}
            opts={{ renderer: 'svg' }}
            notMerge={true}
        />
    );
}
