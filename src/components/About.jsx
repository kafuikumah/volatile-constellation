import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

const About = () => {
    const goals = [
        'Enhance Continental Debt Surveillance and Early Warning Capacity',
        'Promote Data Harmonization',
        'Support Evidence-Based Policy and Decision-Making',
        'Strengthen Transparency and Accountability in Public Debt Management',
        'Facilitate Coordination of Africa\'s Debt Advocacy and Engagement with Creditors',
        'Monitor Implementation of AU Debt-Related Commitments and Frameworks',
        'Support Capacity Building and Peer Learning among Member States',
        'Promote Coherence Between Debt, Development, and Climate Finance Policies'
    ];

    return (
        <div className="about-page" style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
                    African Debt Monitoring Mechanism
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                    Joint initiative of the African Union and technical partners
                </p>
            </div>

            {/* Introduction Section */}
            <section style={{
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '3rem',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                lineHeight: '1.8'
            }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
                    In response to rising debt vulnerabilities, the <strong>AU Executive Council</strong> (Decision <em>EX.CL/Dec.1147 (XL)</em>)
                    and the <strong>Lomé Declaration (2025)</strong> called for the establishment of the African Debt Monitoring Mechanism (ADMM)
                    to provide a virtual platform for monitoring domestic and external debt, enhancing transparency, early warning, and supporting
                    Agenda 2063 financing needs.
                </p>
                <p style={{ fontSize: '1.05rem', margin: 0 }}>
                    The ADMM also aligns with Africa's data revolution (<strong>Africa Data Consensus, 2015</strong>), promoting collaboration,
                    stronger official statistics, and openness, while addressing global calls for harmonized debt reporting, transparency, and
                    reduced reporting burdens highlighted in frameworks like the <strong>FFD4 Outcome Document</strong>.
                </p>
            </section>

            {/* Goals Section */}
            <section>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '3px solid var(--color-accent)'
                }}>
                    <Target size={32} color="var(--color-accent)" />
                    <h2 style={{ margin: 0, fontSize: '2rem' }}>Goals of the ADMM</h2>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {goals.map((goal, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                backgroundColor: 'var(--color-bg-card)',
                                padding: '1.25rem 1.5rem',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(8px)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <CheckCircle2
                                size={24}
                                color="var(--color-accent)"
                                style={{ flexShrink: 0, marginTop: '0.1rem' }}
                            />
                            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>
                                {goal}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Note */}
            <div style={{
                marginTop: '3rem',
                padding: '1.5rem',
                backgroundColor: 'var(--color-bg-secondary)',
                borderLeft: '4px solid var(--color-accent)',
                borderRadius: '8px',
                fontStyle: 'italic',
                color: 'var(--color-text-secondary)'
            }}>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                    This platform serves as a technical implementation of the ADMM framework, providing real-time debt analytics
                    and visualization tools to support evidence-based policy decisions across the African continent.
                </p>
            </div>
        </div>
    );
};

export default About;
