'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const tabs = [
    { label: 'Map View', href: '/' },
    { label: 'Comparison', href: '/comparison' },
    { label: 'Benchmarking', href: '/benchmarking' },
    { label: 'Country Profiles', href: '/country-profiles' },
    { label: 'Data Download', href: '/data-download' },
    { label: 'Methodology', href: '/methodology' },
    { label: 'About', href: '/about' },
];

export function AppHeader() {
    const pathname = usePathname();

    return (
        <header className="h-[60px] mx-4 mt-4 mb-2 flex items-center gap-4 flex-shrink-0 z-20">
            {/* Logo Block */}
            <div className="w-[280px] h-full bg-white border border-slate-200 rounded-lg shadow-sm flex items-center px-4 gap-3 flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AH</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[13px] font-bold font-sans text-slate-900 tracking-tight leading-tight">Africa Health</span>
                    <span className="text-[10px] text-slate-500 leading-tight">Financing Dashboard</span>
                </div>
            </div>

            {/* Navigation Block */}
            <nav className="flex-1 h-full bg-white border border-slate-200 rounded-lg shadow-sm flex items-center px-10 gap-10 overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'h-full flex items-center text-sm font-medium transition-all whitespace-nowrap border-b-[3px]',
                                isActive
                                    ? 'text-[#606060] border-[#606060]'
                                    : 'text-[#A2A2A2] border-transparent hover:text-slate-600'
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
