"use client";

import Link from "next/link";
import {
    ArrowRight,
    ShieldCheck,
    Languages,
    BarChart,
    Lock,
    Users,
    MapPin,
    Lightbulb,
    Zap,
    LifeBuoy
} from "lucide-react";

export default function About() {
    return (
        <div className="bg-background pb-24 lg:pb-32">
            {/* Hero */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
                <nav className="flex gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-8">
                    <Link href="/" className="hover:text-accent-green transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-text-primary">About</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-16 items-center animate-in">
                    <div>
                        <h1 className="font-display text-6xl lg:text-7xl text-text-primary mb-8 tracking-tight">
                            Founded in Accra. <br />Built for the world.
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed max-w-xl">
                            Nerdion Systems was established in 2020 to bridge the digital divide in the international development sector. Headquartered in Accra with strategic oversight in Manchester, we believed then—and know now—that the most impactful decisions are those driven by precise, real-time evidence.
                        </p>
                    </div>
                    <div className="bg-footer p-12 lg:p-24 flex items-center justify-center relative overflow-hidden group">
                        <div className="font-display text-[200px] lg:text-[240px] font-black text-white/50 leading-none group-hover:scale-110 transition-transform duration-700 select-none">
                            2020
                        </div>
                        <div className="absolute inset-0 bg-accent-green/5 mix-blend-multiply"></div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 border-t border-border-warm animate-in">
                <div className="mb-16">
                    <p className="font-mono text-[10px] text-accent-green uppercase tracking-[0.4em] mb-4">Our Values</p>
                    <h2 className="font-display text-4xl lg:text-5xl text-text-primary">Principles that guide our practice</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "Institutional Precision", icon: ShieldCheck, text: "We deliver systems that meet the rigorous standards of global multilaterals and UN agencies." },
                        { title: "Sector Fluency", icon: Languages, text: "We speak the language of development—from MEAL frameworks to regional policy coordination." },
                        { title: "Evidence-First", icon: BarChart, text: "We believe that data is only as valuable as the decisions it enables and the impact it proves." },
                        { title: "Security by Design", icon: Lock, text: "We handle sensitive data with the utmost care, ensuring compliance with global and local standards." },
                        { title: "Sustainable Support", icon: Users, text: "We don&apos;t just build and leave; we partner for the long term to ensure system evolution." },
                        { title: "Local Context", icon: MapPin, text: "Based in Accra, we understand the unique infrastructure and connectivity challenges of the global south." },
                    ].map((value, idx) => (
                        <div key={idx} className="bg-white border border-border-warm p-10 hover:border-accent-green transition-all group">
                            <value.icon className="w-8 h-8 text-accent-green mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="font-display text-2xl text-text-primary mb-4">{value.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{value.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 border-t border-border-warm animate-in">
                <div className="mb-16">
                    <p className="font-mono text-[10px] text-accent-green uppercase tracking-[0.4em] mb-4">The Team</p>
                    <h2 className="font-display text-4xl lg:text-5xl text-text-primary">Engineers, designers, and specialists</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        {
                            name: "Kafui Kofi Kumah",
                            role: "Chief Executive Officer",
                            initials: "KK",
                            bio: "Leading the strategic vision and institutional partnerships to drive digital transformation in global development."
                        },
                        {
                            name: "David Morrison",
                            role: "Head of Engineering",
                            initials: "DM",
                            bio: "Architecting robust, scalable systems that turn complex data requirements into elegant technical solutions."
                        },
                        {
                            name: "Daniel Nana Yaw Obeng",
                            role: "Head of Operations & Legal",
                            initials: "DO",
                            bio: "Ensuring operational excellence and legal compliance across our global engagements and internal processes."
                        },
                    ].map((member, idx) => (
                        <div key={idx} className="group">
                            <div className="w-24 h-24 bg-accent-green/10 text-accent-green font-display text-3xl font-bold flex items-center justify-center rounded-full mb-8 group-hover:bg-accent-green group-hover:text-white transition-all duration-300">
                                {member.initials}
                            </div>
                            <h3 className="font-display text-2xl text-text-primary mb-1">{member.name}</h3>
                            <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-4">{member.role}</p>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {member.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Approach Section */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 border-t border-border-warm animate-in">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <p className="font-mono text-[10px] text-accent-green uppercase tracking-[0.4em] mb-4">Our Approach</p>
                        <h2 className="font-display text-4xl lg:text-5xl text-text-primary mb-8 leading-tight">
                            How we discover, design, <br />build, and support
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed mb-8">
                            We don&apos;t take a one-size-fits-all approach. Every organization has unique decision-making flows, data constraints, and strategic objectives. Our engagement models are built to adapt.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-accent-green font-semibold hover:gap-3 transition-all">
                            Discuss Our Engagement Models <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-6">
                        {[
                            { title: "Co-Creation Workshops", icon: Lightbulb, text: "We deep-dive with program leads and field staff to map out Theory of Change before writing a single line of code." },
                            { title: "Iterative Rapid Prototyping", icon: Zap, text: "We deliver functional components early and often, ensuring the final system is built for how people actually work." },
                            { title: "Managed Service Support", icon: LifeBuoy, text: "Ongoing technical support, security patches, and strategic evolution of your digital assets." },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white border border-border-warm p-8 shadow-sm flex gap-6 group hover:border-accent-green transition-all">
                                <div className="shrink-0 w-12 h-12 bg-accent-green/5 flex items-center justify-center rounded-sm group-hover:bg-accent-green/10 transition-colors">
                                    <item.icon className="w-6 h-6 text-accent-green" />
                                </div>
                                <div>
                                    <h4 className="font-display text-xl text-text-primary mb-2">{item.title}</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
