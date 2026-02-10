import React from 'react';
import { Link } from 'react-router-dom';
import {
    FileUp, FileText, Clock, CheckCircle, XCircle,
    AlertTriangle, TrendingUp, Calendar, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

const AdminDashboard = () => {
    const { user, isSuperAdmin, getPendingUsers } = useAuth();
    const isMobile = useIsMobile();

    // Get pending users count for super admin
    const pendingUsers = isSuperAdmin ? getPendingUsers().length : 0;

    // Mock submission stats (would come from real data in production)
    const stats = {
        totalSubmissions: 12,
        pending: 2,
        approved: 8,
        rejected: 2,
        lastSubmission: '2024-12-15'
    };

    const StatCard = ({ icon: Icon, label, value, color, link }) => (
        <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 8 }}>{label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
                </div>
                <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} color={color} />
                </div>
            </div>
            {link && (
                <Link to={link} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 12,
                    color: '#3b82f6',
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                }}>
                    View all <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );

    return (
        <div>
            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: 16,
                padding: '2rem',
                marginBottom: '2rem',
                color: '#fff'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
                    Welcome back, {user?.name?.split(' ')[0]}!
                </h2>
                <p style={{ margin: '0.5rem 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
                    {isSuperAdmin
                        ? 'You have administrative access to review submissions and manage users.'
                        : `You are submitting data for ${user?.country || 'your country'}.`
                    }
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12 }}>
                    <Link to="/admin/submit" style={{
                        background: '#fff',
                        color: '#3b82f6',
                        padding: '10px 20px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <FileUp size={18} />
                        Submit New Data
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    icon={FileText}
                    label="Total Submissions"
                    value={stats.totalSubmissions}
                    color="#3b82f6"
                    link="/admin/submissions"
                />
                <StatCard
                    icon={Clock}
                    label="Pending Review"
                    value={stats.pending}
                    color="#f59e0b"
                    link="/admin/submissions"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved"
                    value={stats.approved}
                    color="#22c55e"
                />
                <StatCard
                    icon={XCircle}
                    label="Rejected"
                    value={stats.rejected}
                    color="#ef4444"
                />
            </div>

            {/* Super Admin: Pending Users Alert */}
            {isSuperAdmin && pendingUsers > 0 && (
                <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fcd34d',
                    borderRadius: 12,
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <AlertTriangle size={22} color="#d97706" />
                    <div style={{ flex: 1 }}>
                        <strong style={{ color: '#92400e' }}>{pendingUsers} pending user registration(s)</strong>
                        <p style={{ margin: '4px 0 0', color: '#a16207', fontSize: '0.85rem' }}>
                            Review and approve new DMO officer registrations.
                        </p>
                    </div>
                    <Link to="/admin/users" style={{
                        background: '#fbbf24',
                        color: '#78350f',
                        padding: '8px 16px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                    }}>
                        Review
                    </Link>
                </div>
            )}

            {/* Quick Actions & Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                {/* Quick Actions */}
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#1a1a2e' }}>
                        Quick Actions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Link to="/admin/submit" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            background: '#f8fafc',
                            borderRadius: 10,
                            textDecoration: 'none',
                            color: '#1a1a2e',
                            transition: 'background 0.2s'
                        }}>
                            <FileUp size={20} color="#3b82f6" />
                            <span>Submit New Debt Data</span>
                            <ArrowRight size={16} color="#64748b" style={{ marginLeft: 'auto' }} />
                        </Link>
                        <Link to="/admin/submissions" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            background: '#f8fafc',
                            borderRadius: 10,
                            textDecoration: 'none',
                            color: '#1a1a2e'
                        }}>
                            <FileText size={20} color="#8b5cf6" />
                            <span>View My Submissions</span>
                            <ArrowRight size={16} color="#64748b" style={{ marginLeft: 'auto' }} />
                        </Link>
                        <a href="/templates/debt_data_template.xlsx" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            background: '#f8fafc',
                            borderRadius: 10,
                            textDecoration: 'none',
                            color: '#1a1a2e'
                        }}>
                            <Calendar size={20} color="#22c55e" />
                            <span>Download Data Template</span>
                            <ArrowRight size={16} color="#64748b" style={{ marginLeft: 'auto' }} />
                        </a>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#1a1a2e' }}>
                        Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { action: 'Submitted Q4 2024 data', time: '2 days ago', status: 'pending' },
                            { action: 'Q3 2024 data approved', time: '1 week ago', status: 'approved' },
                            { action: 'Updated Q2 2024 figures', time: '2 weeks ago', status: 'approved' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 0',
                                borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none'
                            }}>
                                <div style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: item.status === 'approved' ? '#22c55e' : '#f59e0b'
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', color: '#1a1a2e' }}>{item.action}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
