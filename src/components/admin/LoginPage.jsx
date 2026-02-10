import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: 420,
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 20,
                padding: '3rem 2.5rem',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <LogIn size={28} color="#fff" />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1a1a2e', fontWeight: 700 }}>
                        DMO Portal Login
                    </h1>
                    <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem' }}>
                        African Debt Monitoring Mechanism
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 16px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 10,
                        marginBottom: '1.5rem',
                        color: '#dc2626',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 8,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#374151'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#9ca3af" style={{
                                position: 'absolute',
                                left: 14,
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: 10,
                                    fontSize: '0.95rem',
                                    transition: 'border-color 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 8,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#374151'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#9ca3af" style={{
                                position: 'absolute',
                                left: 14,
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 44px 14px 44px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: 10,
                                    fontSize: '0.95rem',
                                    transition: 'border-color 0.2s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                        }}
                        onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer Links */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                        Don't have an account?{' '}
                        <Link to="/admin/register" style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>
                            Request Access
                        </Link>
                    </p>
                </div>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    textAlign: 'center'
                }}>
                    <Link to="/" style={{
                        color: '#6b7280',
                        textDecoration: 'none',
                        fontSize: '0.85rem'
                    }}>
                        ← Back to Public Dashboard
                    </Link>
                </div>

                {/* Demo Credentials */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '12px 16px',
                    background: '#f0fdf4',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    color: '#166534'
                }}>
                    <strong>Demo Admin:</strong> admin@africanunion.org / admin123
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
