'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCountryProfile } from '@/hooks/useCountryProfile';
import { CountryProfileHeader } from '@/components/country-profile/CountryProfileHeader';
import { FiscalAlert } from '@/components/country-profile/FiscalAlert';
import { IndicatorCategoryCard } from '@/components/country-profile/IndicatorCategoryCard';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { CountrySidebar } from '@/components/layout/CountrySidebar';
import { INDICATOR_CATEGORIES } from '@/lib/constants';
import { getVisibleIndicatorsByCategory } from '@/data/indicators';

export default function CountryProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = typeof params.id === 'string' ? params.id : '';

    const { country, hasFiscalAlert } = useCountryProfile(id);

    if (!country) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 relative h-full">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                <h1 className="text-xl font-bold text-slate-900 mb-2">Country Not Found</h1>
                <p className="text-slate-500 mb-6">The profile you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => router.push('/country-profiles')}
                    className="px-4 py-2 bg-[#F29D38] hover:bg-orange-500 text-white rounded-lg font-semibold transition-colors"
                >
                    Return to Profiles
                </button>
            </div>
        );
    }

    const handleCountrySelect = (cId: string) => {
        router.push(`/country-profiles/${cId}`);
    };

    return (
        <PageLayout sidebar={<CountrySidebar selectedCountry={id} onCountrySelect={handleCountrySelect} />}>
            <div className="flex flex-col h-full relative overflow-hidden">
                {/* Top Navigation */}
                <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center shrink-0">
                    <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#F29D38] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Map
                    </Link>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto w-full">
                    {/* Header */}
                    <div className="px-6 pt-6">
                        <CountryProfileHeader country={country} />
                    </div>

                    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
                        {/* Fiscal Alert */}
                        {hasFiscalAlert && <FiscalAlert country={country} />}

                        {/* Indicator Categories */}
                        <section>
                            <h2 className="text-lg font-bold font-heading text-slate-900 mb-5 pl-3 border-l-4 border-[#F29D38]">
                                Health Financing Indicators
                            </h2>
                            <div className="space-y-4">
                                {INDICATOR_CATEGORIES.map((cat, idx) => {
                                    const indicators = getVisibleIndicatorsByCategory(cat.id);
                                    return (
                                        <IndicatorCategoryCard
                                            key={cat.id}
                                            category={cat}
                                            indicators={indicators}
                                            country={country}
                                            defaultExpanded={idx === 0}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
