'use client';

import { BottomBar } from './BottomBar';
import { cn } from '@/lib/utils';
import React from 'react';

export function PageLayout({
    sidebar,
    children,
    isMapView = false
}: {
    sidebar?: React.ReactNode;
    children: React.ReactNode;
    isMapView?: boolean;
}) {
    return (
        <div className="flex flex-1 overflow-hidden px-4 pb-4 gap-4">
            {sidebar}

            <div className="flex-1 flex flex-col overflow-hidden gap-4">
                <main className={cn(
                    "flex-1 relative rounded-[10px]",
                    isMapView ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden"
                )}>
                    {children}
                </main>

                {isMapView && <BottomBar />}
            </div>
        </div>
    );
}
