import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText, Clock, CheckCircle, XCircle, Edit, Trash2,
    Eye, Filter, Calendar, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SUBMISSIONS_KEY = 'dmo_portal_submissions';

const SubmissionsList = () => {
    const { user, isSuperAdmin } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = () => {
        setLoading(true);
        const stored = localStorage.getItem(SUBMISSIONS_KEY);
        const allSubmissions = stored ? JSON.parse(stored) : [];

        // Filter by user unless super admin
        const filtered = isSuperAdmin
            ? allSubmissions
            : allSubmissions.filter(s => s.submittedBy === user.id);

        setSubmissions(filtered);
        setLoading(false);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this draft?')) return;

        const stored = localStorage.getItem(SUBMISSIONS_KEY);
        const allSubmissions = stored ? JSON.parse(stored) : [];
        const updated = allSubmissions.filter(s => s.id !== id);
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
        loadSubmissions();
    };

    const getStatusBadge = (status) => {
        const styles = {
            draft: { bg: '#f1f5f9', color: '#64748b', icon: Edit },
            pending: { bg: '#fef3c7', color: '#d97706', icon: Clock },
            approved: { bg: '#dcfce7', color: '#16a34a', icon: CheckCircle },
            rejected: { bg: '#fee2e2', color: '#dc2626', icon: XCircle }
        };
        const config = styles[status] || styles.draft;
        const Icon = config.icon;

        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: config.bg,
                color: config.color,
                borderRadius: 20,
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                <Icon size={14} />
                {status}
            </span>
        );
    };

    const filteredSubmissions = filter === 'all'
        ? submissions
        : submissions.filter(s => s.status === filter);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Filter size={18} color="#64748b" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Submissions</option>
                        <option value="draft">Drafts</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={loadSubmissions}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 16px',
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                    <Link
                        to="/admin/submit"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600
                        }}
                    >
                        + New Submission
                    </Link>
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#64748b'
                }}>
                    Loading submissions...
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '3rem',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0'
                }}>
                    <FileText size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                    <h3 style={{ margin: '0 0 8px', color: '#64748b' }}>No Submissions Found</h3>
                    <p style={{ color: '#94a3b8', margin: '0 0 16px' }}>
                        {filter === 'all'
                            ? "You haven't submitted any data yet."
                            : `No ${filter} submissions found.`}
                    </p>
                    <Link
                        to="/admin/submit"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: '#fff',
                            borderRadius: 8,
                            textDecoration: 'none',
                            fontWeight: 600
                        }}
                    >
                        Submit Your First Data
                    </Link>
                </div>
            ) : (
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isSuperAdmin ? '1fr 150px 150px 120px 120px 100px' : '1fr 150px 120px 120px 100px',
                        gap: 16,
                        padding: '1rem 1.5rem',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: '#64748b'
                    }}>
                        <div>Reporting Period</div>
                        {isSuperAdmin && <div>Submitted By</div>}
                        <div>Date</div>
                        <div>Status</div>
                        <div>External Debt</div>
                        <div>Actions</div>
                    </div>

                    {/* Table Rows */}
                    {filteredSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isSuperAdmin ? '1fr 150px 150px 120px 120px 100px' : '1fr 150px 120px 120px 100px',
                                gap: 16,
                                padding: '1rem 1.5rem',
                                borderBottom: '1px solid #f1f5f9',
                                alignItems: 'center',
                                fontSize: '0.9rem'
                            }}
                        >
                            <div style={{ fontWeight: 500, color: '#1a1a2e' }}>
                                <Calendar size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                                {submission.reportingPeriod}
                            </div>
                            {isSuperAdmin && (
                                <div style={{ color: '#64748b' }}>{submission.submittedByName}</div>
                            )}
                            <div style={{ color: '#64748b' }}>{formatDate(submission.submittedAt)}</div>
                            <div>{getStatusBadge(submission.status)}</div>
                            <div style={{ fontWeight: 500 }}>
                                ${Number(submission.data?.totalExternalDebt || 0).toLocaleString()}M
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    title="View"
                                    style={{
                                        background: '#f1f5f9',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: 6,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Eye size={16} color="#64748b" />
                                </button>
                                {submission.status === 'draft' && (
                                    <>
                                        <button
                                            title="Edit"
                                            style={{
                                                background: '#dbeafe',
                                                border: 'none',
                                                borderRadius: 6,
                                                padding: 6,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Edit size={16} color="#3b82f6" />
                                        </button>
                                        <button
                                            title="Delete"
                                            onClick={() => handleDelete(submission.id)}
                                            style={{
                                                background: '#fee2e2',
                                                border: 'none',
                                                borderRadius: 6,
                                                padding: 6,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Trash2 size={16} color="#dc2626" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            {submissions.length > 0 && (
                <div style={{
                    marginTop: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1rem'
                }}>
                    {['draft', 'pending', 'approved', 'rejected'].map(status => (
                        <div key={status} style={{
                            background: '#fff',
                            borderRadius: 12,
                            padding: '1rem',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>
                                {submissions.filter(s => s.status === status).length}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'capitalize' }}>
                                {status}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmissionsList;
