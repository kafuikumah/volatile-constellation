"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Database, Clock, Share2 } from "lucide-react";

export default function EarlyWarningSystemCaseStudy() {
    return (
        <div className="bg-background pb-24 lg:pb-32">
            {/* Hero / Header */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-12">
                    <Link href="/" className="hover:text-accent-green">Home</Link>
                    <span>/</span>
                    <Link href="/our-work" className="hover:text-accent-green">Our Work</Link>
                    <span>/</span>
                    <span className="text-text-primary">Global Early Warning</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 animate-in">
                    <div className="max-w-4xl">
                        <p className="font-mono text-accent-green text-xs uppercase tracking-[0.3em] mb-4">Case Study: Enterprise Management</p>
                        <h1 className="font-display text-5xl lg:text-7xl text-text-primary tracking-tight leading-tight">
                            Global Humanitarian Early Warning System.
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
                            <MapPin className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">16 Countries</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Global Coverage</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center">
                            <Database className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">14 Data Feeds</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Real-time Integration</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">4–6wk Lead Time</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Early Warning</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16">
                {/* Main Body */}
                <div className="lg:col-span-8 animate-in stagger-2">
                    <div className="prose prose-lg max-w-none text-text-secondary leading-relaxed">
                        <h3 className="font-display text-3xl text-text-primary mb-8">The Challenge</h3>
                        <p className="mb-8">
                            A leading multilateral organization faced a critical data challenge: humanitarian crises often move faster than the data used to track them. With multiple countries at risk of conflict or climate-driven emergencies, they needed a way to consolidate fragmented data into a cohesive, predictive tool that could alert leadership before a crisis peaked.
                        </p>
                        <div className="bg-hover/50 p-10 border-l-4 border-accent-gold mb-10 italic text-xl text-text-primary font-display serif">
                            &quot;We needed to move from being reactive to being proactive. Nerdion understood that in our world, a few weeks of lead time literally saves thousands of lives.&quot;
                        </div>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Solution</h3>
                        <p className="mb-8">
                            Nerdion Systems built a bespoke Enterprise Management Platform that serves as a central hub for crisis monitoring. The system integrates 14 diverse data streams—including food security indices, satellite-based climate data, conflict tracking feeds, and financial displacement metrics.
                        </p>
                        <p className="mb-8">
                            Using a custom weighting algorithm developed in collaboration with institutional analysts, the platform generates &quot;Alert Levels&quot; for 16 key regions, highlighting risks that require immediate strategic attention.
                        </p>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Impact</h3>
                        <p className="mb-8">
                            Today, the Early Warning System provides senior leadership with a 4–6 week lead time on emerging crises. This early visibility allows for strategic resource prepositioning and faster mobilization of humanitarian funds, significantly improving the efficacy of rapid response mechanisms.
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 animate-in stagger-3">
                    <div className="bg-white border border-border-warm p-10 sticky top-32">
                        <h4 className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.4em] mb-10 border-b border-border-warm pb-4">
                            Project Details
                        </h4>

                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Client Type</p>
                                <p className="text-sm font-semibold text-text-primary">Leading Multilateral Organization</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Scope</p>
                                <p className="text-sm font-semibold text-text-primary">Global (16 focus countries)</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Year</p>
                                <p className="text-sm font-semibold text-text-primary">2023–2024</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Services</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["Enterprise Management Platforms", "Predictive Analytics", "System Architecture"].map(s => (
                                        <span key={s} className="px-3 py-1 bg-hover text-[10px] font-mono text-text-secondary rounded-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Technology Stack</p>
                                <ul className="text-sm font-medium text-text-primary space-y-1 mt-2">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div> Python / Django</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div> React / Next.js</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div> PostgreSQL / PostGIS</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-border-warm">
                            <p className="text-sm text-text-secondary mb-6 italic leading-relaxed">
                                Ready to build a system that turns data into action?
                            </p>
                            <Link href="/contact" className="w-full py-4 bg-accent-green text-white text-center rounded-sm font-medium block hover:bg-accent-green/90 transition-all text-sm">
                                Start a Similar Project
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
