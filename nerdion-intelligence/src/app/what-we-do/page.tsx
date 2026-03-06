import Link from "next/link";
import {
    ArrowRight,
    LayoutDashboard,
    DatabaseZap,
    LineChart,
    GitBranch,
    ClipboardCheck,
    Target,
    MessagesSquare,
    FileSpreadsheet,
    UserCheck,
    Truck,
    HandCoins,
    BookOpen
} from "lucide-react";

const practices = [
    {
        num: "01",
        id: "decision-intelligence",
        title: "Enterprise Management Platforms",
        description: "We build the backbone of institutional operations with integrated ERP and management systems for executive leadership.",
        services: [
            { name: "Executive Dashboards", icon: LayoutDashboard, text: "Real-time visibility into portfolio performance and regional impact metrics." },
            { name: "Multi-Source Data Integration", icon: DatabaseZap, text: "Automated ETL pipelines connecting field data, financial systems, and external feeds." },
            { name: "Predictive Risk Modeling", icon: LineChart, text: "Using historical patterns to identify project delays and humanitarian crises 4–6 weeks ahead." },
            { name: "Scenario Analytics", icon: GitBranch, text: "Tools for modeling the impact of different resource allocation strategies." },
        ]
    },
    {
        num: "02",
        id: "me-systems",
        title: "Monitoring & Evaluation Systems",
        description: "End-to-end digital MEAL platforms that move organizations beyond Excel-based tracking.",
        services: [
            { name: "Digital Results Frameworks", icon: ClipboardCheck, text: "Translating complex Theory of Change and logframes into functional digital systems." },
            { name: "Indicator Management", icon: Target, text: "Standardized tracking of output, outcome, and impact indicators across multiple countries." },
            { name: "Beneficiary Feedback Portals", icon: MessagesSquare, text: "Closing the loop with two-way communication systems and accountability mechanisms." },
            { name: "Automated Donor Reporting", icon: FileSpreadsheet, text: "One-click generation of EU, AfDB, and UN-formatted reports from live system data." },
        ]
    },
    {
        num: "03",
        id: "custom-tools",
        title: "Custom Digital Tools",
        description: "Internal systems designed specifically for the unique workflows of the development sector.",
        services: [
            { name: "Beneficiary Registries", icon: UserCheck, text: "Secure, offline-capable systems for managing program participant data in remote areas." },
            { name: "Procurement & Tracker Tools", icon: Truck, text: "Tracking the delivery of humanitarian aid from port to final distribution point." },
            { name: "Grant Management Systems", icon: HandCoins, text: "Digital workflows for the entire grant lifecycle from application to close-out." },
            { name: "Knowledge Management", icon: BookOpen, text: "Institutional memory tools for capturing lessons learned and technical expertise." },
        ]
    }
];

export default function WhatWeDo() {
    return (
        <div className="bg-background pb-24 lg:pb-32">
            {/* Hero */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-8">
                    <Link href="/" className="hover:text-accent-green">Home</Link>
                    <span>/</span>
                    <span className="text-text-primary">What We Do</span>
                </nav>
                <h1 className="font-display text-6xl lg:text-7xl text-text-primary mb-8 max-w-4xl tracking-tight animate-in">
                    End-to-end technology for development organizations.
                </h1>
                <p className="text-xl text-text-secondary max-w-2xl leading-relaxed animate-in stagger-1">
                    We bridge the gap between complex program requirements and robust technical implementations, ensuring that data drives better outcomes.
                </p>
            </section>

            {/* Practices */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-32">
                {practices.map((practice) => (
                    <div key={practice.id} id={practice.id} className="grid lg:grid-cols-12 gap-16 border-t border-border-warm pt-20 animate-in">
                        {/* Left Sticky Column */}
                        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
                            <p className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.4em] mb-6">{practice.num}</p>
                            <h2 className="font-display text-4xl text-text-primary mb-6">{practice.title}</h2>
                            <p className="text-text-secondary mb-10 leading-relaxed max-w-md">
                                {practice.description}
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 text-accent-green font-semibold hover:gap-3 transition-all">
                                Start a Project <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Right Content Column */}
                        <div className="lg:col-span-7 space-y-4">
                            {practice.services.map((service, sIdx) => (
                                <div key={sIdx} className="bg-white border border-border-warm p-8 lg:p-10 group hover:border-accent-green transition-all flex gap-8 items-start">
                                    <div className="shrink-0 w-12 h-12 bg-accent-green/5 flex items-center justify-center rounded-sm group-hover:bg-accent-green/10 transition-colors">
                                        <service.icon className="w-6 h-6 text-accent-green" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-2xl text-text-primary mb-3 group-hover:text-accent-green transition-colors">
                                            {service.name}
                                        </h3>
                                        <p className="text-text-secondary leading-relaxed">
                                            {service.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
