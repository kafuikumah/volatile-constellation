import Link from "next/link";
import { ArrowRight, Database, BarChart3, Code2, Search, PenTool, Code, HeartHandshake } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in stagger-1">
            <p className="font-mono text-[10px] text-accent-green uppercase tracking-[0.3em] mb-6">
              Accra · Manchester
            </p>
            <h1 className="font-display text-6xl lg:text-[88px] leading-[1.05] text-text-primary mb-8 tracking-tight">
              Intelligence that drives global impact.
            </h1>
            <p className="text-lg text-text-secondary mb-10 leading-relaxed max-w-2xl">
              Nerdion Systems builds decision-support tools, monitoring platforms, and data systems that help international development organizations act on evidence — faster, at scale, and with confidence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/our-work"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-green text-white rounded-sm hover:bg-accent-green/90 transition-all shadow-sm group"
              >
                Explore Our Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-accent-green text-accent-green rounded-sm hover:bg-hover transition-all"
              >
                Talk to Us
              </Link>
            </div>
          </div>
          <div className="hidden lg:block animate-in stagger-2">
            <div className="aspect-square bg-white border border-border-warm p-12 relative overflow-hidden">
              {/* Abstract Data Viz Placeholder */}
              <svg viewBox="0 0 400 400" className="w-full h-full text-border-warm">
                <rect x="50" y="280" width="60" height="100" fill="currentColor" opacity="0.2" />
                <rect x="130" y="200" width="60" height="180" fill="currentColor" opacity="0.4" />
                <rect x="210" y="150" width="60" height="230" fill="currentColor" opacity="0.6" />
                <rect x="290" y="100" width="60" height="280" fill="currentColor" opacity="0.1" />
                <path d="M50 250 Q130 150 210 200 T370 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="50" cy="250" r="4" fill="#B8860B" />
                <circle cx="130" cy="180" r="4" fill="#B8860B" />
                <circle cx="210" cy="195" r="4" fill="#1A6B4A" />
                <circle cx="370" cy="50" r="4" fill="#1A6B4A" />
              </svg>
              <div className="absolute top-8 left-8 p-4 bg-white border border-border-warm shadow-sm">
                <div className="w-12 h-1 bg-accent-green mb-2"></div>
                <div className="w-24 h-1 bg-border-warm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 pt-12 border-t border-border-warm animate-in stagger-3">
          {[
            { value: "32+", label: "Projects Delivered" },
            { value: "14+", label: "Organizations Served" },
            { value: "4+", label: "Countries Reached" },
            { value: "45+", label: "Combined Years of Practice" },
          ].map((stat, idx) => (
            <div key={idx} className={`text-center ${idx > 0 ? "lg:border-l border-border-warm" : ""}`}>
              <p className="font-display text-4xl text-text-primary mb-2">{stat.value}</p>
              <p className="text-xs text-text-secondary font-mono uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted By Bar */}
      <section className="bg-footer py-16 border-y border-border-warm animate-in">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <p className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.4em] text-center mb-10">
            Trusted by organizations shaping the world
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-60">
            {["MTN", "Eco Africa Network", "Ghana Water Company Limited", "Ministry of Sanitation and Water Resources", "AirtelTigo", "Lynx Entertainment"].map((org) => (
              <span key={org} className="font-display text-xl text-text-primary tracking-tight">
                {org}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="mb-20 animate-in">
          <p className="font-mono text-[10px] text-accent-green uppercase tracking-widest mb-4">What We Do</p>
          <h2 className="font-display text-5xl lg:text-6xl text-text-primary mb-6">
            Three practices. One mission.
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            We design and build the digital infrastructure that turns evidence into action for organizations working to create global impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              icon: Database,
              title: "Enterprise Management Platforms",
              text: "Building the backbone of institutional operations with integrated ERP and management systems.",
              tags: ["Institutional", "Operations"]
            },
            {
              num: "02",
              icon: BarChart3,
              title: "Monitoring & Evaluation Systems",
              text: "Digital MEAL platforms that move organizations beyond spreadsheets to real-time outcome tracking.",
              tags: ["MEAL", "Impact"]
            },
            {
              num: "03",
              icon: Code2,
              title: "Custom Digital Tools",
              text: "Bespoke internal systems built around your workflows — beneficiary portals, procurement trackers, and knowledge tools.",
              tags: ["Workflow", "Custom"]
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-border-warm p-10 hover:border-accent-green transition-all group animate-in" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
              <p className="font-mono text-[10px] text-text-secondary mb-8">{item.num}</p>
              <item.icon className="w-10 h-10 text-accent-green mb-8" />
              <h3 className="font-display text-2xl text-text-primary mb-4">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-8">
                {item.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-background border border-border-warm text-[10px] font-mono text-text-secondary rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Work Section */}
      <section className="bg-dark-bg py-24 lg:py-32 text-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="mb-20 animate-in">
            <p className="font-mono text-[10px] text-accent-gold uppercase tracking-widest mb-4">Our Process</p>
            <h2 className="font-display text-5xl lg:text-6xl mb-6">How we work</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { num: "01", title: "Discover", icon: Search, text: "Deep engagement to understand decision flows and organizational context." },
              { num: "02", title: "Design", icon: PenTool, text: "Co-creating system architecture and user flows with program teams." },
              { num: "03", title: "Build", icon: Code, text: "Iterative development with regular demos and security compliance." },
              { num: "04", title: "Sustain", icon: HeartHandshake, text: "Training, documentation, and evolution as your needs grow." },
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="flex items-center gap-4 mb-4">
                  <p className="font-mono text-[10px] text-text-secondary group-hover:text-accent-gold transition-colors">{step.num}</p>
                  <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-accent-green" />
                  </div>
                </div>
                <h3 className="font-display text-2xl mb-4">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.text}</p>
                {idx < 3 && <div className="hidden lg:block absolute top-[4.5rem] -right-6 text-gray-700">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="flex justify-between items-end mb-16 animate-in">
          <div>
            <p className="font-mono text-[10px] text-accent-green uppercase tracking-widest mb-4">Featured Work</p>
            <h2 className="font-display text-5xl lg:text-6xl text-text-primary">Recent projects</h2>
          </div>
          <Link href="/our-work" className="text-sm font-mono text-accent-green hover:underline mb-2">
            All Case Studies →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Large Featured Card */}
          <Link href="/case-study/ocha" className="group bg-white border border-border-warm hover:border-accent-green transition-all overflow-hidden animate-in">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-16">
                <p className="font-mono text-[10px] text-accent-green uppercase tracking-widest mb-4">UN OCHA</p>
                <h3 className="font-display text-4xl text-text-primary mb-6 group-hover:text-accent-green transition-colors">
                  Humanitarian Crisis Early Warning System
                </h3>
                <p className="text-text-secondary mb-8 leading-relaxed">
                  A multi-country platform consolidating 14 real-time data feeds to provide actionable early warnings 4–6 weeks ahead of crises.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Real-time", "Predictive", "Multi-source"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-hover text-[10px] font-mono text-text-secondary rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="inline-block px-4 py-2 bg-accent-gold text-white text-xs font-mono rounded-sm">
                  4–6 week early lead time
                </div>
              </div>
              <div className="bg-hover/50 flex items-center justify-center p-12">
                <div className="w-full aspect-video bg-white border border-border-warm shadow-sm flex items-center justify-center">
                  <BarChart3 className="w-24 h-24 text-accent-green opacity-20" />
                </div>
              </div>
            </div>
          </Link>

          {/* Two smaller cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { client: "ECOWAS", title: "Regional MEAL Platform", text: "15-country system tracking 340+ indicators with automated donor reporting.", outcome: "70% time saved", href: "/case-study/ecowas" },
              { client: "AfDB", title: "Investment Portfolio Tracker", text: "Real-time dashboard tracking $2.4B in infrastructure across 18 nations.", outcome: "$2.4B tracked", href: "/case-study/afdb" }
            ].map((project, idx) => (
              <Link key={idx} href={project.href} className="group bg-white border border-border-warm p-10 hover:border-accent-green transition-all animate-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                <p className="font-mono text-[10px] text-accent-green uppercase tracking-widest mb-4">{project.client}</p>
                <h3 className="font-display text-2xl text-text-primary mb-4 group-hover:text-accent-green transition-colors">{project.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-8">{project.text}</p>
                <div className="inline-block px-3 py-1 bg-accent-gold text-white text-[10px] font-mono rounded-sm">
                  {project.outcome}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Band */}
      <section className="bg-hover/50 border-t border-accent-green py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center animate-in">
          <h2 className="font-display text-5xl lg:text-7xl text-text-primary mb-8 max-w-4xl mx-auto leading-tight">
            Ready to make your data work for the world?
          </h2>
          <p className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help your organization turn evidence into impact with precision and clarity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 bg-accent-green text-white rounded-sm hover:bg-accent-green/90 transition-all shadow-md group"
            >
              Start a Conversation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-accent-green text-accent-green rounded-sm hover:bg-white transition-all shadow-sm"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
