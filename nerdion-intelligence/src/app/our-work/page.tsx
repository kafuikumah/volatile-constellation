"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = ["All", "Enterprise Management Platforms", "Monitoring & Evaluation Systems", "Custom Digital Tools"];

const caseStudies = [
    {
        client: "Leading Multilateral Organization",
        title: "Global Humanitarian Early Warning System",
        description: "A multi-country platform consolidating 14 real-time data feeds to provide actionable early warnings 4–6 weeks ahead of crises.",
        category: "Enterprise Management Platforms",
        outcome: "4–6wk early lead time",
        href: "/case-study/early-warning-system",
        featured: true
    },
    {
        client: "Regional Intergovernmental Body",
        title: "Cross-Border MEAL Platform",
        description: "A centralized system for tracking 340+ developmental indicators across 15 member states in West Africa.",
        category: "Monitoring & Evaluation Systems",
        outcome: "70% faster reporting",
        href: "/case-study/regional-monitoring",
        featured: false
    },
    {
        client: "Continental Development Finance Institution",
        title: "Strategic Investment Portfolio Tracker",
        description: "Comprehensive dashboard for tracking $2.4B in infrastructure and social investments across multiple regions.",
        category: "Enterprise Management Platforms",
        outcome: "$2.4B portfolio tracked",
        href: "/case-study/portfolio-management",
        featured: false
    },
    {
        client: "Major International NGO",
        title: "Digital Beneficiary Accountability Portal",
        description: "Closing the loop with 1.2M program participants via integrated SMS and web-based feedback mechanisms.",
        category: "Custom Digital Tools",
        outcome: "1.2M participants",
        href: "/case-study/beneficiary-feedback",
        featured: false
    },
    {
        client: "Global Development Foundation",
        title: "Education Outcomes Tracking System",
        description: "Real-time monitoring of literacy programs and school attendance across 240 rural learning centers.",
        category: "Monitoring & Evaluation Systems",
        outcome: "240 schools tracked",
        href: "/case-study/education-tracking",
        featured: false
    },
    {
        client: "Pan-African Development Agency",
        title: "Regional Infrastructure Reporting Tool",
        description: "Strategic project management and reporting tool for continental infrastructure development initiatives.",
        category: "Custom Digital Tools",
        outcome: "Continental rollout",
        href: "/case-study/infrastructure-reporting",
        featured: false
    }
];

export default function OurWork() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredStudies = activeFilter === "All"
        ? caseStudies
        : caseStudies.filter(s => s.category === activeFilter);

    const featured = filteredStudies.find(s => s.featured) || filteredStudies[0];
    const remaining = filteredStudies.filter(s => s !== featured);

    return (
        <div className="bg-background min-h-screen pb-24 lg:pb-32">
            {/* Hero */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-8">
                    <Link href="/" className="hover:text-accent-green transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-text-primary">Our Work</span>
                </nav>
                <h1 className="font-display text-6xl lg:text-7xl text-text-primary mb-8 max-w-4xl tracking-tight animate-in">
                    Proven outcomes for a world in transition.
                </h1>
                <p className="text-xl text-text-secondary max-w-2xl leading-relaxed animate-in stagger-1">
                    Explore our practice through the organizations we serve and the digital systems we&apos;ve built to drive global impact.
                </p>
            </section>

            {/* Filters */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 mb-16 overflow-x-auto">
                <div className="flex gap-8 border-b border-border-warm pb-4 min-w-max">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`text-sm font-medium transition-all relative ${activeFilter === cat ? "text-accent-green" : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            {cat}
                            {activeFilter === cat && (
                                <div className="absolute top-[2.4rem] left-0 right-0 h-[2px] bg-accent-green"></div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Case Study Grid */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 gap-8">
                    {/* Large Featured Card */}
                    {featured && (
                        <Link href={featured.href} className="group bg-white border border-border-warm hover:border-accent-green transition-all animate-in">
                            <div className="grid lg:grid-cols-2">
                                <div className="p-10 lg:p-16 flex flex-col justify-center">
                                    <p className="font-mono text-[10px] text-accent-green uppercase tracking-widest mb-4 group-hover:tracking-[0.2em] transition-all">
                                        {featured.client}
                                    </p>
                                    <h3 className="font-display text-4xl lg:text-5xl text-text-primary mb-6 group-hover:text-accent-green transition-colors">
                                        {featured.title}
                                    </h3>
                                    <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                                        {featured.description}
                                    </p>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="px-3 py-1 bg-hover text-[10px] font-mono text-text-secondary rounded-full">
                                            {featured.category}
                                        </span>
                                        <div className="px-4 py-2 bg-accent-gold text-white text-xs font-mono rounded-sm">
                                            {featured.outcome}
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-2 text-accent-green text-sm font-semibold pt-4">
                                        View Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                                <div className="bg-hover/30 p-12 lg:p-24 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="w-full aspect-square bg-white border border-border-warm shadow-md flex items-center justify-center">
                                        <div className="w-1/2 h-1/2 border-2 border-accent-green border-dashed rounded-full animate-[spin_20s_linear_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Smaller Cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {remaining.map((study, idx) => (
                            <Link
                                key={idx}
                                href={study.href}
                                className="group bg-white border border-border-warm p-10 hover:border-accent-green transition-all animate-in"
                                style={{ animationDelay: `${0.1 * idx}s` }}
                            >
                                <p className="font-mono text-[10px] text-accent-green uppercase tracking-widest mb-4 group-hover:tracking-[0.2em] transition-all">
                                    {study.client}
                                </p>
                                <h3 className="font-display text-2xl text-text-primary mb-4 group-hover:text-accent-green transition-colors">
                                    {study.title}
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-8">
                                    {study.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-3 py-1 bg-hover text-[10px] font-mono text-text-secondary rounded-full">
                                        {study.category}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center group/link">
                                    <div className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-[10px] font-mono rounded-sm font-semibold border border-accent-gold/20">
                                        {study.outcome}
                                    </div>
                                    <span className="text-xs font-mono text-accent-green group-hover/link:underline">
                                        Explore →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
