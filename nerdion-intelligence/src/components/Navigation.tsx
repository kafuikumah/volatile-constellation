"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import Image from "next/image";

const navItems = [
    {
        label: "About",
        href: "/about",
        megaMenu: {
            grid: [
                { title: "Our Story", description: "Founded in Accra, built for the world", href: "/about#story" },
                { title: "The Team", description: "Engineers, designers, specialists", href: "/about#team" },
                { title: "Our Approach", description: "How we discover, design, and build", href: "/about#approach" },
                { title: "Partnerships", description: "Strategic alliances and registrations", href: "/about#partners" },
            ],
        },
    },
    {
        label: "What We Do",
        href: "/what-we-do",
        megaMenu: {
            featured: {
                label: "Our Practice",
                title: "End-to-end Technology for Development Organizations",
                subtext: "We design and build the digital infrastructure that turns evidence into action.",
                href: "/what-we-do",
            },
            items: [
                { title: "Enterprise Management Platforms", description: "Dashboards and analytics for evidence-based leadership decisions", href: "/what-we-do#decision-intelligence" },
                { title: "Monitoring & Evaluation Systems", description: "Full MEAL platform builds from logframe to live system", href: "/what-we-do#me-systems" },
                { title: "Custom Digital Tools", description: "Bespoke internal tools built for how your teams actually work", href: "/what-we-do#custom-tools" },
            ],
        },
    },
    {
        label: "Solutions",
        href: "/solutions",
        megaMenu: {
            grid: [
                { title: "UN & Multilateral Agencies", description: "Supporting global coordination and response", href: "/solutions#un-agencies" },
                { title: "International NGOs", description: "Enabling program teams to track outcomes", href: "/solutions#ingos" },
                { title: "Regional Bodies", description: "ECOWAS, AU, IGAD coordination platforms", href: "/solutions#regional-bodies" },
                { title: "Development Finance Institutions", description: "Impact measurement for social investment", href: "/solutions#dfis" },
                { title: "Humanitarian Response", description: "Rapid-deployment crisis tracking systems", href: "/solutions#humanitarian" },
                { title: "Climate & Environment", description: "Monitoring tools for a sustainable future", href: "/solutions#climate" },
            ],
        },
    },
    {
        label: "Our Work",
        href: "/our-work",
        megaMenu: {
            featured: {
                label: "Featured Case Study",
                title: "Global Humanitarian Early Warning System",
                outcome: "4–6 week early lead time",
                href: "/case-study/early-warning-system",
            },
            items: [
                { title: "Cross-Border MEAL Platform", href: "/case-study/regional-monitoring" },
                { title: "Strategic Investment Portfolio Tracker", href: "/case-study/portfolio-management" },
                { title: "Digital Beneficiary Accountability Portal", href: "/case-study/beneficiary-feedback" },
            ],
        },
    },
    {
        label: "Insights",
        href: "/insights",
    },
];

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMega, setActiveMega] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-border-warm py-4" : "bg-transparent py-6"
                }`}
        >
            <nav className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/logo.png"
                        alt="Nerdion Systems"
                        width={180}
                        height={40}
                        className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navItems.map((item, idx) => (
                        <div
                            key={item.label}
                            className="relative group py-2"
                            onMouseEnter={() => setActiveMega(idx)}
                            onMouseLeave={() => setActiveMega(null)}
                        >
                            <Link
                                href={item.href}
                                className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-accent-green transition-colors"
                            >
                                {item.label}
                                {item.megaMenu && <ChevronDown className="w-4 h-4" />}
                            </Link>

                            {/* Mega Menu */}
                            {item.megaMenu && (
                                <div
                                    className={`absolute top-full left-1/2 -translate-x-1/2 w-[600px] mt-2 bg-white border border-border-warm shadow-xl transition-all duration-300 origin-top overflow-hidden rounded-sm ${activeMega === idx ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                        }`}
                                >
                                    <div className="grid grid-cols-2">
                                        {item.megaMenu.featured ? (
                                            <>
                                                <div className="bg-hover/30 p-8">
                                                    <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-4">
                                                        {item.megaMenu.featured.label}
                                                    </p>
                                                    <h3 className="font-display text-xl text-text-primary mb-4 leading-tight">
                                                        {item.megaMenu.featured.title}
                                                    </h3>
                                                    {item.megaMenu.featured.subtext && (
                                                        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                                                            {item.megaMenu.featured.subtext}
                                                        </p>
                                                    )}
                                                    {item.megaMenu.featured.outcome && (
                                                        <div className="inline-block px-3 py-1 bg-accent-gold text-white text-[10px] font-mono rounded-sm mb-6">
                                                            {item.megaMenu.featured.outcome}
                                                        </div>
                                                    )}
                                                    <Link
                                                        href={item.megaMenu.featured.href}
                                                        className="flex items-center gap-2 text-accent-green text-sm font-semibold hover:gap-3 transition-all"
                                                    >
                                                        Learn More <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                                <div className="p-8 space-y-6">
                                                    {item.megaMenu.items?.map((sub) => (
                                                        <Link
                                                            key={sub.title}
                                                            href={sub.href}
                                                            className="block group/item"
                                                        >
                                                            <h4 className="text-sm font-semibold text-text-primary group-hover/item:text-accent-green transition-colors mb-1">
                                                                {sub.title}
                                                            </h4>
                                                            {"description" in sub && sub.description && (
                                                                <p className="text-xs text-text-secondary line-clamp-2">
                                                                    {sub.description}
                                                                </p>
                                                            )}
                                                        </Link>
                                                    ))}
                                                    {item.label === "Our Work" && (
                                                        <Link
                                                            href="/our-work"
                                                            className="block text-xs font-mono text-accent-green hover:underline pt-2"
                                                        >
                                                            View All Case Studies →
                                                        </Link>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-6 p-8">
                                                {item.megaMenu.grid?.map((sub) => (
                                                    <Link
                                                        key={sub.title}
                                                        href={sub.href}
                                                        className="group/item"
                                                    >
                                                        <h4 className="text-sm font-semibold text-text-primary group-hover/item:text-accent-green transition-colors mb-1">
                                                            {sub.title}
                                                        </h4>
                                                        <p className="text-xs text-text-secondary">
                                                            {sub.description}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden lg:block">
                    <Link
                        href="/contact"
                        className="px-6 py-2.5 bg-accent-green text-white text-sm font-medium rounded-sm hover:bg-accent-green/90 transition-all shadow-sm"
                    >
                        Start a Project
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-text-primary p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden fixed inset-0 top-[73px] bg-white z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col p-8 gap-6 h-full overflow-y-auto">
                    {navItems.map((item) => (
                        <div key={item.label} className="border-b border-border-warm pb-4">
                            <Link
                                href={item.href}
                                className="text-2xl font-display text-text-primary mb-4 block"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                            {item.megaMenu && (
                                <div className="grid grid-cols-1 gap-3 pl-4">
                                    {(item.megaMenu.items || item.megaMenu.grid)?.map((sub) => (
                                        <Link
                                            key={sub.title}
                                            href={sub.href}
                                            className="text-sm text-text-secondary hover:text-accent-green"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <Link
                        href="/contact"
                        className="mt-4 px-8 py-4 bg-accent-green text-white text-center font-medium rounded-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        Start a Project
                    </Link>
                </div>
            </div>
        </header>
    );
}
