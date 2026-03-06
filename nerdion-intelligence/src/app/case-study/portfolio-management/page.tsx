"use client";

import Link from "next/link";
import { ArrowLeft, Share2, TrendingUp, Landmark, Shield } from "lucide-react";

export default function PortfolioManagementCaseStudy() {
    return (
        <div className="bg-background pb-24 lg:pb-32">
            {/* Hero / Header */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-12">
                    <Link href="/" className="hover:text-accent-green transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/our-work" className="hover:text-accent-green transition-colors">Our Work</Link>
                    <span>/</span>
                    <span className="text-text-primary">Portfolio Management</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 animate-in">
                    <div className="max-w-4xl">
                        <p className="font-mono text-accent-green text-xs uppercase tracking-[0.3em] mb-4">Case Study: Enterprise Management Platforms</p>
                        <h1 className="font-display text-5xl lg:text-7xl text-text-primary tracking-tight leading-tight">
                            Strategic Investment Portfolio Tracker.
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
                            <Landmark className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">18 Nations</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Regional Coverage</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-green/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">$2.4B Tracked</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Portfolio Value</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:border-l border-border-warm md:pl-8">
                        <div className="w-12 h-12 bg-accent-gold/10 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-accent-gold" />
                        </div>
                        <div>
                            <p className="font-display text-2xl text-text-primary font-bold">Real-time Risk</p>
                            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest">Monitoring</p>
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
                            A continental development finance institution manages a massive portfolio of infrastructure and social investment projects spanning multiple countries. Tracking the real-time health of these investments—from disbursement rates to on-the-ground impact—was a monumental manual task prone to significant delays.
                        </p>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Solution</h3>
                        <p className="mb-8">
                            Nerdion Systems built a high-security Investment Portfolio Tracker. The platform provides regional directors with a bird&apos;s-eye view of all ongoing projects, with deep-drill capabilities down to individual project sites.
                        </p>
                        <p className="mb-8">
                            The system features automated risk flagging, financial disbursement monitoring, and impact coordinate mapping, allowing leadership to identify bottlenecks and reallocate resources with unprecedented speed.
                        </p>

                        <h3 className="font-display text-3xl text-text-primary mb-8 mt-16">The Impact</h3>
                        <p className="mb-8">
                            The tracker currently monitors over $2.4B in active investments across 18 nations. It has reduced the average time for portfolio risk identification from quarterly reviews to weekly automated digests, significantly improving the ability to ensure project success and financial accountability.
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
                                <p className="text-sm font-semibold text-text-primary">Continental Finance Institution</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Scope</p>
                                <p className="text-sm font-semibold text-text-primary">18 Nations (Multi-regional)</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Services</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["Enterprise Management Platforms", "Risk Analytics", "Financial Integration"].map(s => (
                                        <span key={s} className="px-3 py-1 bg-hover text-[10px] font-mono text-text-secondary rounded-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mb-1">Technology</p>
                                <ul className="text-sm font-medium text-text-primary space-y-1 mt-2">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div> Secured Cloud Infra</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div> Real-time Dashboards</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent-green rounded-full"></div> Financial Data Sync</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-border-warm">
                            <Link href="/contact" className="w-full py-4 bg-accent-green text-white text-center rounded-sm font-medium block hover:bg-accent-green/90 transition-all text-sm">
                                Discuss Portfolio Tracking
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
