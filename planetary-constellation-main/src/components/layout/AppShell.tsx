'use client';

import { AppHeader } from './AppHeader';
import { SelectedCountryProvider } from '@/hooks/useSelectedCountry';
import { MobileNotice } from './MobileNotice';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SelectedCountryProvider>
            <div className="h-screen flex flex-col overflow-hidden bg-[#F1F5F9] font-sans text-slate-800">
                <AppHeader />
                {children}
                <MobileNotice />
            </div>
        </SelectedCountryProvider>
    );
}
