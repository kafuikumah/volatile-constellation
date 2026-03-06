"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Network, HardHat, FileCheck } from "lucide-react";

export default function InfrastructureReportingCaseStudy() {
    return (
        <div className="bg-background pb-24 lg:pb-32">
            {/* Hero / Header */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-12">
                    <Link href="/" className="hover:text-accent-green transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/our-work" className="hover:text-accent-green transition-colors">Our Work</Link>
                    <span>/</span>
                    <span className="text-text-primary">Infrastructure Reporting</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 animate-in">
                    <div className="max-w-4xl">
                        <p className="font-mono text-accent-green text-xs uppercase tracking-[0.3em] mb-4">Case Study: Custom Digital Tools</p>
                        <h1 className="font-display text-5xl lg:text-7xl text-text-primary tracking-tight leading-tight">
                            Regional Infrastructure Reporting Tool.
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
                            <Network className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">Continental</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Rollout Scope</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center">
                            <HardHat className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">Mega Projects</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Progress Tracking</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">Standardized</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Reporting Workflows</p>
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
                            A pan-African development agency tasked with coordinating continental infrastructure initiatives faced a bottleneck in project reporting. With massive projects spanning multiple borders and stakeholders, there was no unified way to track progress, risks, and financial disbursements in a standardized manner.
                        </p>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Solution</h3>
                        <p className="mb-8">
                            Nerdion Systems developed a bespoke Regional Infrastructure Reporting Tool. The platform serves as a secure central hub where project leads from different nations can submit standardized progress reports, upload documentation, and flag risks.
                        </p>
                        <p className="mb-8">
                            The tool features automated notification workflows, a centralized document vault, and executive-level dashboards that provide a real-time view of the continental infrastructure pipeline.
                        </p>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Impact</h3>
                        <p className="mb-8">
                            The implementation of the reporting tool has fundamentally improved coordination and transparency in continental infrastructure development. It has standardized the reporting process, reduced administrative overhead for project teams, and provided the agency with the data visibility needed to drive these high-impact initiatives to completion.
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
                                <p className="text-sm font-semibold text-text-primary">Pan-African Development Agency</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Scope</p>
                                <p className="text-sm font-semibold text-text-primary">Continental (Multi-sector)</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Services</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["Custom Digital Tools", "Project Reporting", "Institutional Workflows"].map(s => (
                                        <span key={s} className="px-3 py-1 bg-hover text-[10px] font-mono text-text-secondary rounded-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-border-warm">
                            <Link href="/contact" className="w-full py-4 bg-accent-green text-white text-center rounded-sm font-medium block hover:bg-accent-green/90 transition-all text-sm">
                                Discuss Infrastructure Tools
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
