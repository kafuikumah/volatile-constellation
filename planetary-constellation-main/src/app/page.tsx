'use client';

import { useState, useMemo } from 'react';
import { AfricaMap } from '@/components/charts/AfricaMap';
import { CountryInfoPanel } from '@/components/map/CountryInfoPanel';
import { MapLegend } from '@/components/map/MapLegend';
import { WelcomePrompt } from '@/components/map/WelcomePrompt';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';
import { PageLayout } from '@/components/layout/PageLayout';
import { CountrySidebar } from '@/components/layout/CountrySidebar';
import { VISIBLE_INDICATORS } from '@/data/indicators';
import { countries } from '@/data/countries';
import { getLatestValue } from '@/lib/utils';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function MapViewPage() {
  const { selectedId } = useSelectedCountry();
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(null);

  // Split indicators into those with data and those without
  const { availableIndicators, pendingIndicators } = useMemo(() => {
    const available: typeof VISIBLE_INDICATORS[number][] = [];
    const pending: typeof VISIBLE_INDICATORS[number][] = [];

    for (const ind of VISIBLE_INDICATORS) {
      const hasData = countries.some(c => {
        const latest = getLatestValue(c.indicators[ind.id]);
        return latest?.value != null;
      });
      if (hasData) {
        available.push(ind);
      } else {
        pending.push(ind);
      }
    }

    return { availableIndicators: available, pendingIndicators: pending };
  }, []);

  return (
    <PageLayout sidebar={<CountrySidebar />} isMapView={true}>
      <div className="relative w-full h-full bg-[#CBEEFF] overflow-hidden">
        {/* Welcome Prompt */}
        <WelcomePrompt />

        {/* Country Info Panel — floating left visible ON CLICK */}
        {selectedId && (
          <div className="absolute top-4 left-4 bottom-4 z-20 animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col max-h-[calc(100%-2rem)]">
            <CountryInfoPanel />
          </div>
        )}

        {/* Africa Map */}
        <div className="w-full h-full rounded-[10px] overflow-hidden">
          <AfricaMap selectedIndicatorId={selectedIndicatorId} />
        </div>

        {/* Indicator Selector — Top right overlay */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 rounded-lg px-3 py-2.5 w-[260px]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
                Map Indicator
              </span>
              <div className="group relative">
                <HelpCircle className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 top-5 w-52 bg-slate-800 text-white text-[10px] rounded-lg p-2.5 shadow-lg z-50 leading-relaxed">
                  Select an indicator to color the map by its values across all 55 AU member states. Each country is shaded based on its performance relative to all other countries.
                </div>
              </div>
            </div>
            <div className="relative">
              <select
                value={selectedIndicatorId ?? ''}
                onChange={(e) => setSelectedIndicatorId(e.target.value || null)}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-300 pr-6 appearance-none cursor-pointer font-medium"
              >
                <option value="">Default (No coloring)</option>
                <optgroup label="Available Indicators">
                  {availableIndicators.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.label}</option>
                  ))}
                </optgroup>
                {pendingIndicators.length > 0 && (
                  <optgroup label="── Data Pending ──">
                    {pendingIndicators.map(ind => (
                      <option key={ind.id} value={ind.id} disabled style={{ color: '#94a3b8' }}>
                        {ind.label}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Map Legend — floating bottom right */}
        {selectedIndicatorId && (
          <div className="absolute bottom-4 right-4 z-20">
            <MapLegend selectedIndicatorId={selectedIndicatorId} />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
