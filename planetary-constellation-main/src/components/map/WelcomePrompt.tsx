'use client';

import { useState, useEffect } from 'react';
import { Map, Search, X } from 'lucide-react';
import { useSelectedCountry } from '@/hooks/useSelectedCountry';

export function WelcomePrompt() {
    const [dismissed, setDismissed] = useState(true); // Start dismissed to avoid flash
    const { selectedId } = useSelectedCountry();

    useEffect(() => {
        // Check sessionStorage
        const hasSeen = sessionStorage.getItem('hasSeenWelcomePrompt');
        if (!hasSeen && !selectedId) {
            setTimeout(() => setDismissed(false), 0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-dismiss when a country is selected
    useEffect(() => {
        if (selectedId) {
            sessionStorage.setItem('hasSeenWelcomePrompt', 'true');
            setTimeout(() => setDismissed(true), 0);
        }
    }, [selectedId]);

    const handleDismiss = () => {
        sessionStorage.setItem('hasSeenWelcomePrompt', 'true');
        setDismissed(true);
    };

    if (dismissed) return null;

    return (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-md mx-4 relative">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                        <Map className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Explore African Health Financing
                    </h2>
                    <p className="text-sm text-slate-500">
                        Track and compare domestic health financing across all 55 AU Member States
                    </p>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Map className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-800">Select on Map</p>
                            <p className="text-xs text-slate-500 mt-0.5">Click any country to see its health financing profile</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Search className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-800">Search Sidebar</p>
                            <p className="text-xs text-slate-500 mt-0.5">Use the sidebar to search, filter by region or REC</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleDismiss}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                    Get Started
                </button>

                <p className="text-[10px] text-slate-400 text-center mt-4">
                    Africa Health Financing Dashboard — African Renaissance Trust
                </p>
            </div>
        </div>
    );
}
