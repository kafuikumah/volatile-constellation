'use client';

import { useState, useEffect } from 'react';
import { Heart, Globe, Users, Target, Mail, ExternalLink } from 'lucide-react';
import { APP_NAME, APP_VERSION, APP_ORG } from '@/lib/constants';

import { PageLayout } from '@/components/layout/PageLayout';

const stakeholders = [
    { name: 'African Renaissance Trust', role: 'Lead Organization', desc: 'Driving health financing advocacy and policy dialogue across the African continent.' },
    { name: 'African Union Commission', role: 'Strategic Partner', desc: 'Providing continental health policy frameworks, the ALM Declaration, and the 2025 Joint STC Declaration.' },
    { name: 'WHO Africa Regional Office', role: 'Technical Partner', desc: 'Supporting health systems assessment methodology, GHED data, and technical guidance.' },
    { name: 'World Bank Africa', role: 'Data Partner', desc: 'WDI data, income classification, and health financing analytics.' },
];

const frameworks = [
    'Africa Scorecard on Health Financing',
    'ALM Declaration on Domestic Resource Mobilisation',
    '2025 Joint STC Declaration',
    'Abuja Declaration (15% target)',
    'SDG 3: Good Health and Wellbeing',
    'WHO Health System Building Blocks',
];

export default function AboutPage() {
    const [activeSection, setActiveSection] = useState('mission');

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

        const sections = document.querySelectorAll('section[id], div[id="vision"]');
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
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3 block">Contents</p>
                <a href="#mission" className={getLinkClass('mission')}>Our Mission</a>
                <a href="#vision" className={getLinkClass('vision')}>Vision & Goals</a>
                <a href="#frameworks" className={getLinkClass('frameworks')}>Policy Frameworks</a>
                <a href="#team" className={getLinkClass('team')}>Key Stakeholders</a>
                <a href="#contact" className={getLinkClass('contact')}>Contact</a>
            </div>
        </aside>
    );

    return (
        <PageLayout sidebar={sidebar}>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-4xl mx-auto w-full">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">About the Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {APP_NAME} — {APP_ORG}
                    </p>
                </div>

                {/* Mission */}
                <section id="mission" className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-8 scroll-mt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        The {APP_NAME} is an interactive analytics platform for tracking, visualizing, comparing, and
                        benchmarking domestic health financing data across all <span className="font-semibold text-orange-600">55 African Union Member States</span>.
                        Built by the <strong>{APP_ORG}</strong>, it supports advocacy for increased and more effective
                        domestic health financing in line with the ALM Declaration, the Abuja Declaration, and the 2025
                        Joint STC Declaration on Health Financing.
                    </p>
                </section>

                {/* Vision & Goals */}
                <div id="vision" className="grid grid-cols-1 md:grid-cols-3 gap-4 scroll-mt-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                        <Globe className="w-8 h-8 text-blue-500 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-900 mb-2">Pan-African Coverage</h3>
                        <p className="text-xs text-slate-500">Comprehensive data across all 55 AU member states with 33 health financing indicators.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                        <Target className="w-8 h-8 text-green-500 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-900 mb-2">Evidence-Based Advocacy</h3>
                        <p className="text-xs text-slate-500">Data-driven analysis supporting policy dialogue on domestic resource mobilisation for health.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
                        <Users className="w-8 h-8 text-purple-500 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-900 mb-2">Multi-Stakeholder Platform</h3>
                        <p className="text-xs text-slate-500">Bringing together governments, AU institutions, WHO, World Bank, and civil society partners.</p>
                    </div>
                </div>

                {/* Policy Frameworks */}
                <section id="frameworks" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Policy Frameworks</h2>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        The dashboard&apos;s indicator framework is aligned with multiple international and continental commitments:
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {frameworks.map(f => (
                            <span key={f} className="px-4 py-2 bg-slate-50 rounded-full text-sm text-slate-600 border border-slate-100">
                                {f}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Stakeholders */}
                <section id="team" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Stakeholders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stakeholders.map(t => (
                            <div key={t.name} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-white">{t.name[0]}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                                    <p className="text-xs text-orange-500 font-medium">{t.role}</p>
                                    <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 scroll-mt-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact</h2>
                    <div className="flex flex-wrap gap-4">
                        <a href="mailto:info@africanrenaissancetrust.org" className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-500 transition-colors">
                            <Mail className="w-4 h-4" /> info@africanrenaissancetrust.org
                        </a>
                        <a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-500 transition-colors">
                            <ExternalLink className="w-4 h-4" /> Website
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <div className="text-center pb-8">
                    <p className="text-xs text-slate-400">
                        {APP_NAME} {APP_VERSION} — {APP_ORG}
                    </p>
                </div>
            </div>
        </PageLayout>
    );
}
