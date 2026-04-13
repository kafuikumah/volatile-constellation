"use client";

import dynamic from "next/dynamic";

const ReactECharts = dynamic(
    () => import("echarts-for-react"),
    { ssr: false, loading: () => <div className="animate-pulse bg-slate-100 rounded-lg h-64" /> }
);

interface RadarChartProps {
    indicators: string[];
    countries: {
        name: string;
        scores: number[];
    }[];
    height?: number;
}

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B'];

export function RadarChart({ indicators, countries, height = 400 }: RadarChartProps) {
    const indicator = indicators.map(name => ({ name, max: 100 }));

    const seriesData = countries.map((c, index) => {
        const color = COLORS[index % COLORS.length];
        return {
            value: c.scores,
            name: c.name,
            areaStyle: { opacity: 0.1, color },
            lineStyle: { color, width: 2 },
            itemStyle: { color },
        };
    });

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: 1,
            borderColor: '#E2E8F0',
            textStyle: { color: '#1E293B' }
        },
        legend: {
            data: countries.map(c => c.name),
            bottom: 0,
            padding: [20, 0, 0, 0],
            textStyle: { fontSize: 11, color: '#64748B' },
            itemGap: 15
        },
        radar: {
            indicator,
            shape: 'polygon',
            splitNumber: 5,
            axisName: {
                color: '#64748B',
                fontSize: 10,
                formatter: (value: string) => {
                    // Wrap long names
                    const words = value.split(' ');
                    if (words.length > 2) {
                        return words.slice(0, 2).join(' ') + '\n' + words.slice(2).join(' ');
                    }
                    return value;
                }
            },
            splitLine: { lineStyle: { color: '#E2E8F0' } },
            splitArea: { areaStyle: { color: ['#F8FAFC', '#FFFFFF'] } },
            axisLine: { lineStyle: { color: '#E2E8F0' } },
            center: ['50%', '45%'],
            radius: '65%'
        },
        series: [{
            type: 'radar',
            data: seriesData
        }],
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
