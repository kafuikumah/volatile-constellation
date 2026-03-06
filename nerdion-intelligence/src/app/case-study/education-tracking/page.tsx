"use client";

import Link from "next/link";
import { ArrowLeft, Share2, ClipboardCheck, School, TrendingUp } from "lucide-react";

export default function EducationTrackingCaseStudy() {
    return (
        <div className="bg-background pb-24 lg:pb-32">
            {/* Hero / Header */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-12">
                    <Link href="/" className="hover:text-accent-green transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/our-work" className="hover:text-accent-green transition-colors">Our Work</Link>
                    <span>/</span>
                    <span className="text-text-primary">Education Outcomes</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 animate-in">
                    <div className="max-w-4xl">
                        <p className="font-mono text-accent-green text-xs uppercase tracking-[0.3em] mb-4">Case Study: Monitoring & Evaluation Systems</p>
                        <h1 className="font-display text-5xl lg:text-7xl text-text-primary tracking-tight leading-tight">
                            Education Outcomes Tracking System.
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 border border-border-warm rounded-sm hover:border-accent-green transition-colors">
                            <Share2 className="w-4 h-4 text-text-secondary" />
                        </button>
                    </div>
                </div>

                {/* Metric Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-white border border-border-warm shadow-sm animate-in stagger-1">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                            <School className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">240 Centers</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Rural Coverage</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center">
                            <ClipboardCheck className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">Real-time M&E</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Attendance & Literacy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">Measurable Growth</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Program Impact</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 animate-in stagger-2">
                    <div className="prose prose-lg max-w-none text-text-secondary leading-relaxed">
                        <h3 className="font-display text-3xl text-text-primary mb-8">The Challenge</h3>
                        <p className="mb-8">
                            A global development foundation dedicated to improving literacy outcomes in rural areas lacked a centralized way to track program efficacy. Data on student attendance and literacy progress was primarily manual, leading to significant gaps in understanding where interventions were succeeding and where they were failing.
                        </p>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Solution</h3>
                        <p className="mb-8">
                            Nerdion Systems built a real-time Education Outcomes Tracking System. The platform features an offline-first mobile application for field officers to log attendance and assessment results, which then syncs to a central M&E dashboard once connectivity is established.
                        </p>
                        <p className="mb-8">
                            The system provides program managers with granular visibility into student performance across 240 learning centers, highlighting trends and allowing for data-driven curriculum adjustments.
                        </p>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Impact</h3>
                        <p className="mb-8">
                            The implementation has transformed how the foundation monitors its literacy programs. With real-time data from 240 rural learning centers, the foundation can now demonstrate clear program impact to its stakeholders and ensure that resources are directed to the students and regions that need them most.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-4 animate-in stagger-3">
                    <div className="bg-white border border-border-warm p-10 sticky top-32">
                        <h4 className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.4em] mb-10 border-b border-border-warm pb-4">
                            Project Details
                        </h4>

                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Client Type</p>
                                <p className="text-sm font-semibold text-text-primary">Global Development Foundation</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Scope</p>
                                <p className="text-sm font-semibold text-text-primary">240 Rural Learning Centers</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Services</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["Monitoring & Evaluation", "Offline-First Mobile", "Outcome Dashboards"].map(s => (
                                        <span key={s} className="px-3 py-1 bg-hover text-[10px] font-mono text-text-secondary rounded-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-border-warm">
                            <Link href="/contact" className="w-full py-4 bg-accent-green text-white text-center rounded-sm font-medium block hover:bg-accent-green/90 transition-all text-sm">
                                Explore M&E Builds
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 mt-24">
                <Link href="/our-work" className="inline-flex items-center gap-3 text-text-secondary hover:text-accent-green font-mono text-xs uppercase tracking-widest transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to All Case Studies
                </Link>
            </section>
        </div>
    );
}
