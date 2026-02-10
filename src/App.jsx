import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Globe, BarChart3, Info, FileText, TrendingUp, Bell, Users, Download, ChevronDown, LogIn, Menu, X } from 'lucide-react'
import Dashboard from './components/Dashboard'
import ComparisonTool from './components/ComparisonTool'
import CountryList from './components/CountryList'
import QualitativeView from './components/QualitativeView'
import CountryDetail from './components/CountryDetail'
import QualitativeIndicatorDetail from './components/QualitativeIndicatorDetail'
import About from './components/About'
import ScenarioModeler from './components/ScenarioModeler'
import EarlyWarningPanel from './components/EarlyWarningPanel'
import PeerBenchmark from './components/PeerBenchmark'
import ExportTools from './components/ExportTools'
import { AuthProvider, ProtectedRoute } from './context/AuthContext'
import auLogo from './assets/au-logo.png'
import LoginPage from './components/admin/LoginPage'
import RegisterPage from './components/admin/RegisterPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import DataEntryForm from './components/admin/DataEntryForm'
import SubmissionsList from './components/admin/SubmissionsList'
import { SUPPORTED_LANGUAGES } from './utils/i18n'
import { useIsMobile } from './hooks/useMediaQuery'
import './App.css'

const NavLink = ({ to, icon: Icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`nav-link ${isActive ? 'active' : ''}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '9999px',
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
                backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.8rem',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
            }}
        >
            <Icon size={16} />
            {children}
        </Link>
    );
};

const DropdownNav = ({ label, icon: Icon, items }) => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const isActive = items.some(item => location.pathname === item.to);

    return (
        <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '9999px',
                    color: isActive ? '#fff' : 'var(--color-text-secondary)',
                    backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                    border: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                }}
            >
                <Icon size={16} />
                {label}
                <ChevronDown size={12} />
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '0.5rem',
                    minWidth: 180,
                    zIndex: 1000
                }}>
                    {items.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.6rem 0.75rem',
                                borderRadius: 8,
                                color: location.pathname === item.to ? 'var(--color-accent)' : '#555',
                                background: location.pathname === item.to ? 'var(--color-accent)10' : 'transparent',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                transition: 'all 0.15s'
                            }}
                        >
                            <item.icon size={14} />
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

function Layout() {
    const [language, setLanguage] = useState('en');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
            {/* Top Bar */}
            <div style={{
                backgroundColor: '#002244',
                padding: '0.5rem 2rem',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.75rem'
            }}>
                {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: language === lang.code ? '#fff' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontWeight: language === lang.code ? 600 : 400
                        }}
                    >
                        {lang.flag} {lang.code.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Main Header */}
            <header style={{
                backgroundColor: '#fff',
                padding: isMobile ? '0.75rem 1rem' : '0.75rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                {/* Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                        src={auLogo}
                        alt="African Union"
                        style={{ height: '48px', width: 'auto' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                        <h1 style={{
                            fontSize: '1.1rem',
                            margin: 0,
                            fontWeight: 700,
                            color: '#1D1D1F',
                            lineHeight: 1.2
                        }}>
                            African Debt Monitoring Mechanism
                        </h1>
                        <span style={{
                            fontSize: '0.65rem',
                            color: '#86868B',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Credit Assessment & Analysis Program
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                {isMobile ? (
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 8,
                            cursor: 'pointer',
                            color: '#1D1D1F'
                        }}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                ) : (
                    <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                        <NavLink to="/compare" icon={BarChart3}>Compare</NavLink>
                        <NavLink to="/countries" icon={Globe}>Countries</NavLink>

                        {/* Analytics Dropdown */}
                        <DropdownNav
                            label="Analytics"
                            icon={TrendingUp}
                            items={[
                                { to: '/projections', label: 'Debt Projections', icon: TrendingUp },
                                { to: '/warnings', label: 'Early Warnings', icon: Bell },
                                { to: '/benchmark', label: 'Peer Benchmark', icon: Users }
                            ]}
                        />

                        {/* Exports & Reports */}
                        <NavLink to="/export" icon={Download}>Exports & Reports</NavLink>

                        <NavLink to="/qualitative" icon={Info}>CAP Pillar 2</NavLink>
                        <NavLink to="/about" icon={FileText}>About</NavLink>

                        {/* DMO Portal Link */}
                        <Link
                            to="/admin/login"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 0.75rem',
                                marginLeft: '0.5rem',
                                borderRadius: '9999px',
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                color: '#fff',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            <LogIn size={14} />
                            DMO Portal
                        </Link>
                    </nav>
                )}
            </header>

            {/* Mobile Navigation Overlay */}
            {isMobile && mobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 999
                }} onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Navigation Menu */}
            {isMobile && (
                <nav style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '280px',
                    height: '100vh',
                    background: '#fff',
                    zIndex: 1001,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    padding: '1rem',
                    boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            alignSelf: 'flex-end',
                            background: 'transparent',
                            border: 'none',
                            padding: 8,
                            cursor: 'pointer'
                        }}
                    >
                        <X size={24} />
                    </button>
                    <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/compare" icon={BarChart3}>Compare</NavLink>
                    <NavLink to="/countries" icon={Globe}>Countries</NavLink>
                    <NavLink to="/projections" icon={TrendingUp}>Debt Projections</NavLink>
                    <NavLink to="/warnings" icon={Bell}>Early Warnings</NavLink>
                    <NavLink to="/benchmark" icon={Users}>Peer Benchmark</NavLink>
                    <NavLink to="/export" icon={Download}>Exports & Reports</NavLink>
                    <NavLink to="/qualitative" icon={Info}>CAP Pillar 2</NavLink>
                    <NavLink to="/about" icon={FileText}>About</NavLink>
                    <Link
                        to="/admin/login"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1rem',
                            marginTop: '1rem',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}
                    >
                        <LogIn size={16} />
                        DMO Portal
                    </Link>
                </nav>
            )}

            <main>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/compare" element={<ComparisonTool />} />
                    <Route path="/countries" element={<CountryList />} />
                    <Route path="/qualitative" element={<QualitativeView />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/country/:countryCode" element={<CountryDetail />} />
                    <Route path="/qualitative-indicator/:indicatorId" element={<QualitativeIndicatorDetail />} />
                    <Route path="/qualitative-indicator/:indicatorId/:countryCode" element={<QualitativeIndicatorDetail />} />

                    {/* New Policymaker Features */}
                    <Route path="/projections" element={<ScenarioModeler />} />
                    <Route path="/warnings" element={<EarlyWarningPanel />} />
                    <Route path="/benchmark" element={<PeerBenchmark />} />
                    <Route path="/export" element={<ExportTools />} />

                    {/* Admin Portal Routes */}
                    <Route path="/admin/login" element={<LoginPage />} />
                    <Route path="/admin/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="submit" element={<DataEntryForm />} />
                        <Route path="submissions" element={<SubmissionsList />} />
                    </Route>
                </Routes>
            </main>

            <footer style={{
                padding: '2rem',
                marginTop: 'auto',
                borderTop: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                backgroundColor: '#002244',
                textAlign: 'center',
                fontSize: '0.8rem'
            }}>
                <p style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>
                    Data Source: World Bank Open Data API. Indicators derived from International Debt Statistics.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>&copy; 2024 African Union | African Debt Monitoring Mechanism</p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Admin routes - separate from main layout */}
                    <Route path="/admin/login" element={<LoginPage />} />
                    <Route path="/admin/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="submit" element={<DataEntryForm />} />
                        <Route path="submissions" element={<SubmissionsList />} />
                    </Route>

                    {/* Main public layout */}
                    <Route path="/*" element={<Layout />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
