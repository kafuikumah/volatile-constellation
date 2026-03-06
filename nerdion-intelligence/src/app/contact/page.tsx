"use client";

import Link from "next/link";
import { Send, Mail, Phone, Clock, ShieldCheck } from "lucide-react";

export default function Contact() {
    return (
        <div className="bg-background pb-24 lg:pb-32">
            {/* Hero */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32 text-center animate-in">
                <nav className="flex justify-center gap-2 text-xs font-mono text-text-secondary uppercase tracking-widest mb-8">
                    <Link href="/" className="hover:text-accent-green transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-text-primary">Contact</span>
                </nav>
                <h1 className="font-display text-6xl lg:text-8xl text-text-primary mb-8 tracking-tight">
                    Start a project.
                </h1>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    Ready to build a system that works for your mission? Contact our specialists to discuss your organization&apos;s digital journey.
                </p>
            </section>

            {/* Contact Grid */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 animate-in stagger-1">
                {/* Form */}
                <div className="lg:col-span-7 bg-white border border-border-warm p-10 lg:p-16 shadow-sm">
                    <form className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Full Name</label>
                                <input type="text" className="px-0 py-3 border-b border-border-warm focus:border-accent-green focus:outline-none transition-colors text-text-primary placeholder:text-gray-300" placeholder="Kofi Mensah" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Organization</label>
                                <input type="text" className="px-0 py-3 border-b border-border-warm focus:border-accent-green focus:outline-none transition-colors text-text-primary placeholder:text-gray-300" placeholder="ECOWAS, UN OCHA, etc." />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Email Address</label>
                            <input type="email" className="px-0 py-3 border-b border-border-warm focus:border-accent-green focus:outline-none transition-colors text-text-primary placeholder:text-gray-300" placeholder="official.email@organization.org" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Practice Interest</label>
                            <select className="px-0 py-3 border-b border-border-warm focus:border-accent-green focus:outline-none bg-transparent transition-colors text-text-primary">
                                <option value="enterprise-management">Enterprise Management Platforms</option>
                                <option value="me-systems">Monitoring & Evaluation Systems</option>
                                <option value="custom-tools">Custom Digital Tools</option>
                                <option>Strategy & Digital Transformation</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">Your Message</label>
                            <textarea rows={4} className="px-0 py-3 border-b border-border-warm focus:border-accent-green focus:outline-none transition-colors text-text-primary resize-none placeholder:text-gray-300" placeholder="Tell us about the challenge you&apos;re looking to solve..."></textarea>
                        </div>
                        <button type="submit" className="w-full py-5 bg-accent-green text-white font-medium hover:bg-accent-green/90 transition-all flex items-center justify-center gap-3 group shadow-md">
                            Send Inquiry <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Details */}
                <div className="lg:col-span-5 space-y-12">
                    <div className="space-y-10">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-hover flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5 text-accent-green" />
                            </div>
                            <div>
                                <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">Email</p>
                                <p className="text-lg text-text-primary font-medium">info@nerdionsystems.com</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-hover flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5 text-accent-green" />
                            </div>
                            <div>
                                <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-lg text-text-primary font-medium">+233 24 104 9063</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-hover flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5 text-accent-green" />
                            </div>
                            <div>
                                <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">Response Time</p>
                                <p className="text-lg text-text-primary font-medium">Typically 24–48 hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-footer p-10 border border-border-warm">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-6 h-6 text-accent-green" />
                            <h3 className="font-display text-xl text-text-primary">Vendor Registration</h3>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-6">
                            We are registered vendors for UNGM, EU PD, and various regional development banks. Request our official credentials for procurement processes.
                        </p>
                        <Link href="#" className="text-xs font-mono text-accent-green hover:underline">REQUEST CREDENTIAL PACK →</Link>
                    </div>
                </div>
            </section>

            {/* Offices */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 border-t border-border-warm mt-24 animate-in">
                <p className="font-mono text-[10px] text-accent-green uppercase tracking-[0.4em] mb-12 text-center">Global Presence</p>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { city: "Accra", type: "HQ & Engineering Hub", flag: "🇬🇭", address: "One Airport Square, Airport City, Accra, Ghana" },
                        { city: "Manchester", type: "Strategy & Partnerships", flag: "🇬🇧", address: "Piccadilly Place, Manchester, UK" },
                    ].map((office, idx) => (
                        <div key={idx} className="bg-white border border-border-warm p-10">
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-4xl">{office.flag}</span>
                                <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">{office.city}</span>
                            </div>
                            <h3 className="font-display text-2xl text-text-primary mb-2">{office.city}</h3>
                            <p className="text-xs text-accent-green font-mono uppercase tracking-widest mb-6">{office.type}</p>
                            <p className="text-sm text-text-secondary leading-relaxed">{office.address}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
