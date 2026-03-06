import Link from "next/link";
import { Linkedin, Twitter, Globe } from "lucide-react";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-footer border-t border-border-warm pt-16 pb-8">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <Image
                                src="/logo.png"
                                alt="Nerdion Systems"
                                width={180}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed mb-6">
                            Intelligence for Global Impact. Building strategic technology for international development.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Linkedin, label: "LinkedIn" },
                                { icon: Twitter, label: "Twitter" },
                                { icon: Globe, label: "Website" }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-8 h-8 rounded-sm bg-white border border-border-warm flex items-center justify-center hover:border-accent-green hover:text-accent-green transition-all cursor-pointer text-text-secondary"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Practice Links */}
                    <div>
                        <h4 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-6">Practice</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Enterprise Management", href: "/what-we-do#decision-intelligence" },
                                { label: "M&E Systems", href: "/what-we-do#me-systems" },
                                { label: "Custom Tools", href: "/what-we-do#custom-tools" },
                                { label: "Solutions", href: "/solutions" }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-text-secondary hover:text-accent-green transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "About Us", href: "/about" },
                                { label: "Our Work", href: "/our-work" },
                                { label: "Insights", href: "/insights" },
                                { label: "Partnerships", href: "/about#partners" },
                                { label: "Contact", href: "/contact" }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-text-secondary hover:text-accent-green transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-6">Connect</h4>
                        <ul className="space-y-4">
                            <li className="text-sm text-text-secondary font-medium">info@nerdionsystems.com</li>
                            <li className="text-sm text-text-secondary">+233 24 104 9063</li>
                            <li className="text-xs text-text-secondary leading-relaxed">
                                HQ: Accra, Ghana<br />
                                Manchester, UK
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border-warm/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-text-secondary font-mono uppercase tracking-wider">
                        © 2026 NERDION SYSTEMS. ALL RIGHTS RESERVED.
                    </p>
                    <p className="text-[11px] text-text-secondary font-mono uppercase tracking-wider">
                        ACCRA · MANCHESTER
                    </p>
                </div>
            </div>
        </footer>
    );
}
