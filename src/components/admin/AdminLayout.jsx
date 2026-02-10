import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, FileUp, FileText, Users, Settings, LogOut,
    Menu, X, ChevronRight, Bell, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

const AdminLayout = () => {
    const { user, logout, isSuperAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    // Auto-close sidebar on mobile when route changes
    React.useEffect(() => {
        if (isMobile) setSidebarOpen(false);
        else setSidebarOpen(true);
    }, [location.pathname, isMobile]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/submit', label: 'Submit Data', icon: FileUp },
        { path: '/admin/submissions', label: 'My Submissions', icon: FileText },
        ...(isSuperAdmin ? [
            { path: '/admin/users', label: 'User Management', icon: Users },
            { path: '/admin/review', label: 'Review Submissions', icon: FileText }
        ] : []),
        { path: '/admin/settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 90
                    }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: 260,
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 100,
                ...(isMobile ? {} : {
                    transform: 'none',
                    width: sidebarOpen ? 260 : 70
                })
            }}>
                {/* Logo */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {sidebarOpen && (
                        <div>
                            <h2 style={{
                                margin: 0,
                                color: '#fff',
                                fontSize: '1.1rem',
                                fontWeight: 700
                            }}>
                                DMO Portal
                            </h2>
                            <span style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.7rem'
                            }}>
                                Data Management
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: 8,
                            padding: 8,
                            cursor: 'pointer',
                            color: '#fff',
                            // On mobile, the toggle button in sidebar only closes it. 
                            // We need a toggle in the header to open it.
                            display: isMobile ? 'block' : 'block'
                        }}
                    >
                        {isMobile ? <X size={18} /> : (sidebarOpen ? <X size={18} /> : <Menu size={18} />)}
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: sidebarOpen ? '12px 16px' : '12px',
                                    marginBottom: 4,
                                    borderRadius: 10,
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                                    background: isActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                                    transition: 'all 0.2s',
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center'
                                }}
                            >
                                <Icon size={20} />
                                {sidebarOpen && (
                                    <>
                                        <span style={{ flex: 1, fontSize: '0.9rem' }}>{item.label}</span>
                                        {isActive && <ChevronRight size={16} />}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div style={{
                    padding: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {sidebarOpen ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            marginBottom: 12
                        }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {user?.name}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                                    {isSuperAdmin ? 'Administrator' : 'DMO Officer'}
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: sidebarOpen ? 'flex-start' : 'center',
                            gap: 12,
                            padding: '12px 16px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            borderRadius: 10,
                            color: '#fca5a5',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        <LogOut size={18} />
                        {sidebarOpen && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: isMobile ? 0 : (sidebarOpen ? 260 : 70),
                transition: 'margin-left 0.3s ease',
                width: '100%'
            }}>
                {/* Top Bar */}
                <header style={{
                    background: '#fff',
                    padding: isMobile ? '1rem' : '1rem 2rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    color: '#1a1a2e'
                                }}
                            >
                                <Menu size={24} />
                            </button>
                        )}
                        <div>
                            <h1 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.25rem', color: '#1a1a2e' }}>
                                {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                            </h1>
                            {!isMobile && (
                                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                    {user?.organization} • {user?.country}
                                </span>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button style={{
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: 10,
                            padding: 10,
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <Bell size={20} color="#64748b" />
                            <span style={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                width: 8,
                                height: 8,
                                background: '#ef4444',
                                borderRadius: '50%'
                            }} />
                        </button>
                        <Link to="/" style={{
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: 10,
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            color: '#64748b',
                            textDecoration: 'none'
                        }}>
                            View Public Dashboard
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ padding: isMobile ? '1rem' : '2rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
