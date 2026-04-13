"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from "next/dynamic";
import * as echarts from 'echarts';
import { countries } from '@/data/countries';
import { getIndicatorById } from '@/data/indicators';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';
import { getLatestValue, computeIndicatorBands, getColorFromBands, formatIndicatorValue } from '@/lib/utils';

const ReactECharts = dynamic(
    () => import("echarts-for-react"),
    { ssr: false, loading: () => <div className="animate-pulse bg-slate-100 rounded-lg h-full" /> }
);

// Map from our country IDs to GeoJSON names
const countryNameMap: Record<string, string> = {
    dza: 'Algeria', ago: 'Angola', ben: 'Benin', bwa: 'Botswana',
    bfa: 'Burkina Faso', bdi: 'Burundi', cmr: 'Cameroon', cpv: 'Cape Verde',
    caf: 'Central African Republic', tcd: 'Chad', com: 'Comoros',
    cod: 'Democratic Republic of the Congo', cog: 'Republic of the Congo',
    civ: "Ivory Coast", dji: 'Djibouti', egy: 'Egypt',
    gnq: 'Equatorial Guinea', eri: 'Eritrea', swz: 'Swaziland',
    eth: 'Ethiopia', gab: 'Gabon', gmb: 'Gambia', gha: 'Ghana',
    gin: 'Guinea', gnb: 'Guinea Bissau', ken: 'Kenya', lso: 'Lesotho',
    lbr: 'Liberia', lby: 'Libya', mdg: 'Madagascar', mwi: 'Malawi',
    mli: 'Mali', mrt: 'Mauritania', mus: 'Mauritius', mar: 'Morocco',
    moz: 'Mozambique', nam: 'Namibia', ner: 'Niger', nga: 'Nigeria',
    rwa: 'Rwanda', stp: 'Sao Tome and Principe', sen: 'Senegal',
    syc: 'Seychelles', sle: 'Sierra Leone', som: 'Somalia', som_land: 'Somaliland',
    zaf: 'South Africa', ssd: 'South Sudan', sdn: 'Sudan',
    tza: 'United Republic of Tanzania', tgo: 'Togo', tun: 'Tunisia',
    uga: 'Uganda', zmb: 'Zambia', zwe: 'Zimbabwe',
    // v2: Sahrawi Arab Democratic Republic
    shr: 'Western Sahara',
};

// Reverse lookup
const nameToId: Record<string, string> = {};
Object.entries(countryNameMap).forEach(([id, name]) => {
    nameToId[name] = id === 'som_land' ? 'som' : id;
});

interface AfricaMapProps {
    /** Indicator ID to use for choropleth coloring. If null, uses default white fill. */
    selectedIndicatorId?: string | null;
}

export function AfricaMap({ selectedIndicatorId }: AfricaMapProps) {
    const [mapRegistered, setMapRegistered] = useState(false);
    const { setSelectedId, selectedId, setHoveredId } = useSelectedCountry();

    useEffect(() => {
        // Fetch Africa GeoJSON
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(res => res.json())
            .then((worldGeo) => {
                // Filter to African countries only
                const africanCountryNames = Object.values(countryNameMap);
                const africaGeo = {
                    type: 'FeatureCollection',
                    features: worldGeo.features.filter((f: { properties: { name: string } }) =>
                        africanCountryNames.includes(f.properties.name)
                    ),
                };
                echarts.registerMap('africa', africaGeo as never);
                setMapRegistered(true);
            })
            .catch(console.error);
    }, []);

    const onEvents = useCallback(() => ({
        click: (params: { name?: string }) => {
            if (params.name && nameToId[params.name]) {
                const id = nameToId[params.name];
                setSelectedId(id === selectedId ? null : id); // Toggle selection
            }
        },
        mouseover: (params: { name?: string }) => {
            if (params.name && nameToId[params.name]) {
                setHoveredId(nameToId[params.name]);
            } else {
                setHoveredId(null);
            }
        },
        mouseout: () => {
            setHoveredId(null);
        },
    }), [setSelectedId, selectedId, setHoveredId]);

    // Compute color bands for the selected indicator
    const indicator = selectedIndicatorId ? getIndicatorById(selectedIndicatorId) : null;
    const bands = useMemo(() => {
        if (!selectedIndicatorId || !indicator) return [];
        const values: number[] = [];
        for (const c of countries) {
            const latest = getLatestValue(c.indicators[selectedIndicatorId]);
            if (latest?.value != null) {
                values.push(latest.value);
            }
        }
        return computeIndicatorBands(values, indicator.benchmarkDirection, indicator.unit);
    }, [selectedIndicatorId, indicator]);

    if (!mapRegistered) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-transparent">
                <div className="animate-pulse text-slate-400 text-sm">Loading map...</div>
            </div>
        );
    }

    // Build data array for map — choropleth coloring by indicator value
    const mapData = countries.flatMap(c => {
        let areaColor = '#FFFFFF'; // Default white

        if (c.id === selectedId) {
            areaColor = '#F29D38'; // Selected country always orange
        } else if (selectedIndicatorId && bands.length > 0) {
            // Choropleth mode: color by indicator value using dynamic bands
            const latest = getLatestValue(c.indicators[selectedIndicatorId]);
            if (latest?.value != null) {
                areaColor = getColorFromBands(latest.value, bands);
            } else {
                areaColor = '#CBD5E1'; // No data — light grey
            }
        }

        const item = {
            name: countryNameMap[c.id] || c.name,
            value: selectedIndicatorId
                ? (getLatestValue(c.indicators[selectedIndicatorId])?.value ?? 0)
                : 0,
            itemStyle: {
                areaColor,
                borderColor: '#CBD5E1',
                borderWidth: 0.8,
            },
        };

        if (c.id === 'som') {
            return [item, { ...item, name: 'Somaliland' }];
        }
        return [item];
    });

    const option = {
        backgroundColor: '#CBEEFF',
        tooltip: {
            trigger: 'item',
            formatter: (params: { name: string; value: number }) => {
                const countryId = nameToId[params.name];
                const c = countries.find(co => co.id === countryId);
                if (!c) return `<strong>${params.name}</strong>`;

                if (selectedIndicatorId) {
                    const ind = getIndicatorById(selectedIndicatorId);
                    const latest = getLatestValue(c.indicators[selectedIndicatorId]);
                    const val = latest?.value != null
                        ? formatIndicatorValue(latest.value, ind?.unit ?? '')
                        : 'No data';
                    return `<strong>${c.name}</strong><br/><span style="color:#94a3b8;font-size:11px">${ind?.label ?? ''}</span><br/>${val}`;
                }

                // No indicator selected: show Region and REC
                const recs = c.recs.length > 0 ? c.recs.join(', ') : '—';
                return `<strong>${c.name}</strong><br/><span style="color:#94a3b8;font-size:11px">Region:</span> ${c.region}<br/><span style="color:#94a3b8;font-size:11px">REC:</span> ${recs}`;
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#E2E8F0',
            textStyle: { color: '#0F172A', fontSize: 13, fontFamily: 'Inter' },
        },
        series: [
            {
                type: 'map',
                map: 'africa',
                aspectScale: 1,
                roam: true,
                scaleLimit: { min: 1, max: 5 },
                label: {
                    show: false,
                },
                emphasis: {
                    label: { show: true, color: '#0F172A', fontSize: 10, fontFamily: 'Inter' },
                    itemStyle: { areaColor: '#FFF7ED', borderColor: '#F29D38', borderWidth: 1.5 },
                },
                select: {
                    disabled: true,
                },
                data: mapData,
                nameMap: {},
            },
        ],
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            onEvents={onEvents()}
            opts={{ renderer: 'svg' }}
            notMerge={true}
        />
    );
}
