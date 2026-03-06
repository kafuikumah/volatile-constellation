import Link from "next/link";
import {
    Users,
    Globe,
    Database,
    Settings2,
    ArrowRight,
    Trees,
    Activity,
    Scale,
    Network
} from "lucide-react";

const sectors = [
    {
        icon: Users,
        title: "Development Organizations & NGOs",
        description: "Digital tools that help program teams track activities, outcomes, and operational data more effectively.",
        capabilities: [
            "Monitoring & Evaluation (MEAL) dashboards",
            "Beneficiary data and feedback systems",
            "Grant tracking and reporting tools",
            "Program performance dashboards",
        ],
    },
    {
        icon: Globe,
        title: "Regional & Policy Institutions",
        description: "Data platforms that support regional coordination, reporting, and policy monitoring across multiple stakeholders.",
        capabilities: [
            "Indicator tracking dashboards",
            "Multi-country reporting systems",
            "Policy monitoring and analytics platforms",
            "Regional data visualization dashboards",
        ],
    },
    {
        icon: Database,
        title: "Research & Data Teams",
        description: "Custom platforms that transform complex datasets into clear, usable intelligence.",
        capabilities: [
            "Interactive research dashboards",
            "Data exploration and visualization platforms",
            "Public-facing knowledge portals",
            "Internal data management systems",
        ],
    },
    {
        icon: Settings2,
        title: "Program & Operations Teams",
        description: "Internal platforms that simplify operational workflows and information management.",
        capabilities: [
            "Internal management dashboards",
            "Procurement and workflow tracking systems",
            "Knowledge management portals",
            "Custom reporting platforms",
        ],
    },
];

export default function Solutions() {
    return (
        <div className="bg-background">
            {/* Hero */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-8">
                    <Link href="/" className="hover:text-accent-green">Home</Link>
                    <span>/</span>
                    <span className="text-text-primary">Solutions</span>
                </nav>
                <h1 className="font-display text-6xl lg:text-7xl text-text-primary mb-8 max-w-4xl tracking-tight animate-in">
                    Sector Expertise
                </h1>
                <p className="text-xl text-text-secondary max-w-3xl leading-relaxed mb-12 animate-in stagger-1">
                    Digital systems designed for organizations that manage complex programs, data, and operations.
                </p>
                <div className="grid lg:grid-cols-2 gap-12 text-lg text-text-secondary leading-relaxed animate-in stagger-2">
                    <p>
                        We build digital platforms for organizations that need better ways to manage information, track outcomes, and coordinate teams. Our work focuses on institutions operating across public sector, development programs, and mission-driven organizations where data, reporting, and operational clarity are critical.
                    </p>
                    <p>
                        While our experience comes from building custom digital systems and data tools, our long-term focus is supporting organizations working in development, research, and regional collaboration.
                    </p>
                </div>
            </section>

            {/* Sectors Grid */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
                <div className="mb-16">
                    <p className="font-mono text-[10px] text-accent-green uppercase tracking-[0.4em] mb-4">Focus Areas</p>
                    <h2 className="font-display text-4xl text-text-primary">Organizations We Aim to Support</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {sectors.map((sector, idx) => {
                        const Icon = sector.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white border border-border-warm p-10 group hover:border-accent-green hover:shadow-lg transition-all duration-300 animate-in"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <Icon className="w-12 h-12 text-accent-green mb-8 group-hover:scale-110 transition-transform duration-300" />
                                <h2 className="font-display text-2xl text-text-primary mb-4">{sector.title}</h2>
                                <p className="text-sm text-text-secondary mb-8 leading-relaxed italic">
                                    {sector.description}
                                </p>
                                <div className="space-y-4">
                                    <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Typical Solutions:</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                        {sector.capabilities.map((cap, cIdx) => (
                                            <li key={cIdx} className="flex items-start gap-2 text-xs text-text-secondary">
                                                <div className="w-1.5 h-1.5 bg-accent-green rounded-full mt-1.5 shrink-0" />
                                                <span>{cap}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Growing Focus & Why Us */}
            <section className="bg-footer py-24 lg:py-32">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-24">
                        <div className="animate-in">
                            <p className="font-mono text-[10px] text-accent-green uppercase tracking-[0.4em] mb-6">Forward Motion</p>
                            <h2 className="font-display text-4xl text-text-primary mb-8">Areas of Growing Focus</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Public sector data platforms", icon: Scale },
                                    { title: "Development and program monitoring", icon: Activity },
                                    { title: "Climate and environmental data", icon: Trees },
                                    { title: "Research and policy analytics", icon: Database },
                                    { title: "Regional and cross-border collaboration systems", icon: Network }
                                ].map((item, id) => (
                                    <div key={id} className="flex gap-4 items-center group">
                                        <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm border border-border-warm group-hover:border-accent-green transition-colors">
                                            <item.icon className="w-5 h-5 text-accent-green" />
                                        </div>
                                        <span className="text-text-primary font-medium">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-12 lg:p-16 border border-border-warm animate-in">
                            <h2 className="font-display text-4xl text-text-primary mb-8">Why Clients Work With Us</h2>
                            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                                We combine software development, data systems thinking, and experience building operational tools to create platforms that fit the realities of how organizations actually work.
                            </p>
                            <p className="text-lg text-text-secondary leading-relaxed mb-10">
                                Instead of generic software, we build purpose-built digital tools tailored to each organization’s workflows and reporting needs.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-accent-green text-white hover:bg-black transition-colors rounded-sm font-mono text-sm uppercase tracking-widest">
                                Start a Discussion <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
