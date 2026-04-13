'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Database, Calculator, Search, BarChart3, Target, AlertTriangle } from 'lucide-react';
import { INDICATOR_CATEGORIES } from '@/lib/constants';
import { VISIBLE_INDICATORS } from '@/data/indicators';
import { BENCHMARK_DIMENSIONS } from '@/data/benchmarkGroups';

import { PageLayout } from '@/components/layout/PageLayout';

const dataSources = [
    { name: 'WHO Global Health Expenditure Database (GHED)', desc: 'Primary source for domestic health financing data — government health expenditure, out-of-pocket spending, and external resources.', url: 'https://apps.who.int/nha/database' },
    { name: 'World Bank World Development Indicators (WDI)', desc: 'GDP, income classification, tax-to-GDP, and cross-check for health expenditure indicators.', url: 'https://data.worldbank.org' },
    { name: 'IMF World Economic Outlook (WEO)', desc: 'Debt-to-GDP, debt service, interest payments, and fiscal space indicators with projections to 2030.', url: 'https://www.imf.org/en/Publications/WEO' },
    { name: 'WHO Global Health Observatory (GHO)', desc: 'UHC service coverage index, health workforce density, maternal mortality, child mortality, and facility data.', url: 'https://www.who.int/data/gho' },
    { name: 'Mo Ibrahim Foundation (IIAG)', desc: 'Index of African Governance for peer benchmarking by governance tier. Manual upload — no public API.', url: 'https://iiag.online' },
    { name: 'UNICEF/WHO Joint Database', desc: 'Skilled birth attendance and RMNCH coverage indicators.', url: 'https://data.unicef.org' },
];

export default function MethodologyPage() {
    const [activeSection, setActiveSection] = useState('framework');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-10% 0px -80% 0px' }
        );

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    const linkBaseClass = "block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all";
    const getLinkClass = (id: string) =>
        activeSection === id ? `${linkBaseClass} bg-[#F29D38]/10 text-[#F29D38]` : `${linkBaseClass} text-slate-600 hover:bg-slate-50 hover:text-slate-900`;

    const sidebar = (
        <aside className="w-[280px] bg-white rounded-[10px] shadow-sm border border-slate-200 flex flex-col flex-shrink-0 h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex-shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search methodology..."
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F29D38]/30 focus:border-[#F29D38] transition-all"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3 block">Contents</p>
                <a href="#framework" className={getLinkClass('framework')}>Indicator Framework</a>
                <a href="#categories" className={getLinkClass('categories')}>5 Categories</a>
                <a href="#benchmarking" className={getLinkClass('benchmarking')}>Benchmarking Methodology</a>
                <a href="#data-sources" className={getLinkClass('data-sources')}>Data Sources & APIs</a>
                <a href="#coverage" className={getLinkClass('coverage')}>Geographic Coverage</a>
                <a href="#limitations" className={getLinkClass('limitations')}>Limitations & Caveats</a>
            </div>
        </aside>
    );

    return (
        <PageLayout sidebar={sidebar}>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-4xl mx-auto w-full">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Methodology</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Understanding how we track and benchmark domestic health financing across Africa
                    </p>
                </div>

                {/* Indicator Framework */}
                <section id="framework" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Indicator Framework</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        The dashboard is built on a <strong>33-indicator framework</strong> organised into 5 categories.
                        This framework draws on multiple international commitments including the
                        <strong> Africa Scorecard on Health Financing</strong>, the <strong>ALM Declaration</strong>,
                        the <strong>WHO Health System Building Blocks</strong>, and the <strong>SDG 3 targets</strong>.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-amber-50">
                            <p className="text-2xl font-bold text-amber-600 font-mono-data">33</p>
                            <p className="text-xs text-amber-700 font-semibold">Indicators</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-blue-50">
                            <p className="text-2xl font-bold text-blue-600 font-mono-data">5</p>
                            <p className="text-xs text-blue-700 font-semibold">Categories</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-50">
                            <p className="text-2xl font-bold text-green-600 font-mono-data">55</p>
                            <p className="text-xs text-green-700 font-semibold">AU Member States</p>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section id="categories" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">5 Indicator Categories</h2>
                    </div>
                    <div className="space-y-4">
                        {INDICATOR_CATEGORIES.map(cat => {
                            const indicators = VISIBLE_INDICATORS.filter(i => i.category === cat.id);
                            return (
                                <div key={cat.id} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                                    <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-slate-800">{cat.label}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{indicators.length} indicators</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Benchmarking */}
                <section id="benchmarking" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Benchmarking Methodology</h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        Countries are benchmarked across <strong>4 peer-grouping dimensions</strong>. Each dimension groups
                        countries with similar characteristics, enabling fairer comparisons.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BENCHMARK_DIMENSIONS.map(dim => (
                            <div key={dim.id} className="p-4 rounded-lg bg-slate-50">
                                <h3 className="text-sm font-semibold text-slate-800 mb-1">{dim.label}</h3>
                                <p className="text-xs text-slate-500 mb-2">{dim.source}</p>
                                <div className="flex flex-wrap gap-1">
                                    {(dim.labels ?? dim.values).slice(0, 5).map((v, i) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">{v}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Data Sources */}
                <section id="data-sources" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                            <Database className="w-5 h-5 text-purple-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Data Sources & APIs</h2>
                    </div>
                    <div className="space-y-3">
                        {dataSources.map(s => (
                            <div key={s.name} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.desc}</p>
                                    <a href={s.url} target="_blank" rel="noopener" className="text-[10px] text-blue-500 hover:underline mt-0.5 block">{s.url}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Coverage */}
                <section id="coverage" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">Geographic Coverage</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        The dashboard covers all <strong>55 African Union Member States</strong>, including the
                        Sahrawi Arab Democratic Republic (SADR). Countries are grouped by 5 regions
                        (Central, Eastern, Northern, Southern, Western Africa) and can be filtered by any
                        of the 8 AU-recognised Regional Economic Communities (RECs).
                    </p>
                    <div className="grid grid-cols-5 gap-3">
                        {['Central', 'Eastern', 'Northern', 'Southern', 'Western'].map(r => (
                            <div key={r} className="text-center p-3 rounded-lg bg-slate-50">
                                <p className="text-xs font-semibold text-slate-800">{r}</p>
                                <p className="text-[10px] text-slate-500">Africa</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Limitations */}
                <section id="limitations" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Limitations & Caveats</h2>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex gap-2"><span className="text-orange-500">•</span>Data availability varies significantly across countries and indicators — many countries lack recent data for workforce and facility indicators</li>
                        <li className="flex gap-2"><span className="text-orange-500">•</span>The Sahrawi Arab Democratic Republic (SADR) has extremely limited international health data</li>
                        <li className="flex gap-2"><span className="text-orange-500">•</span>WHO GHED data has a 2–3 year reporting lag; the most recent year is typically 2021 or 2022</li>
                        <li className="flex gap-2"><span className="text-orange-500">•</span>IMF WEO includes projections — figures beyond the current year are estimates, not actuals</li>
                        <li className="flex gap-2"><span className="text-orange-500">•</span>Composite benchmarking scores are simplified summaries of complex health system dynamics</li>
                        <li className="flex gap-2"><span className="text-orange-500">•</span>Mo Ibrahim governance data requires manual upload (no public API) and may not be current</li>
                    </ul>
                </section>
            </div>
        </PageLayout>
    );
}
