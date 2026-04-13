'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Country } from '@/types/country';
import { getCountryById } from '@/data/countries';

interface SelectedCountryContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  country: Country | null;
  hoveredCountry: Country | null;
}

const SelectedCountryContext = createContext<SelectedCountryContextType>({
  selectedId: null,
  setSelectedId: () => {},
  hoveredId: null,
  setHoveredId: () => {},
  country: null,
  hoveredCountry: null,
});

export function SelectedCountryProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const country = useMemo(() => (selectedId ? getCountryById(selectedId) ?? null : null), [selectedId]);
  const hoveredCountry = useMemo(() => (hoveredId ? getCountryById(hoveredId) ?? null : null), [hoveredId]);

  return (
    <SelectedCountryContext.Provider value={{ selectedId, setSelectedId, hoveredId, setHoveredId, country, hoveredCountry }}>
      {children}
    </SelectedCountryContext.Provider>
  );
}

export function useSelectedCountry() {
  return useContext(SelectedCountryContext);
}
