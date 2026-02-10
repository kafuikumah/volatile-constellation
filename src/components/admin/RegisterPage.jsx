import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Building, Briefcase, Globe, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AU_MEMBER_STATES } from '../../utils/countries';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        organization: '',
        position: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                country: formData.country,
                organization: formData.organization,
                position: formData.position
            });
            setSuccess(result.message);
            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/admin/login'), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 12px 12px 42px',
        border: '2px solid #e5e7eb',
        borderRadius: 10,
        fontSize: '0.95rem',
        transition: 'border-color 0.2s',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: 6,
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#374151'
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
                maxWidth: 480,
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 20,
                padding: '2.5rem',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <UserPlus size={26} color="#fff" />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1a1a2e', fontWeight: 700 }}>
                        Request Portal Access
                    </h1>
                    <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.85rem' }}>
                        For Ministry of Finance & DMO Officers
                    </p>
                </div>

                {/* Success Alert */}
                {success && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 16px',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: 10,
                        marginBottom: '1.25rem',
                        color: '#166534',
                        fontSize: '0.9rem'
                    }}>
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

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
                        marginBottom: '1.25rem',
                        color: '#dc2626',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Full Name *</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="#9ca3af" style={{
                                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'
                            }} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Official Email Address *</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#9ca3af" style={{
                                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'
                            }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="yourname@ministry.gov"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Country *</label>
                        <div style={{ position: 'relative' }}>
                            <Globe size={18} color="#9ca3af" style={{
                                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1
                            }} />
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                style={{
                                    ...inputStyle,
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    background: '#fff'
                                }}
                            >
                                <option value="">Select your country</option>
                                {AU_MEMBER_STATES.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Organization */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Ministry / Organization *</label>
                        <div style={{ position: 'relative' }}>
                            <Building size={18} color="#9ca3af" style={{
                                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'
                            }} />
                            <input
                                type="text"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                placeholder="e.g., Ministry of Finance"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Position */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Position / Title *</label>
                        <div style={{ position: 'relative' }}>
                            <Briefcase size={18} color="#9ca3af" style={{
                                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'
                            }} />
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="e.g., Debt Management Officer"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Password *</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#9ca3af" style={{
                                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'
                            }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                required
                                minLength={8}
                                style={{ ...inputStyle, paddingRight: 42 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', padding: 0
                                }}
                            >
                                {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Confirm Password *</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#9ca3af" style={{
                                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)'
                            }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: (loading || success) ? '#9ca3af' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: (loading || success) ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                        }}
                    >
                        {loading ? 'Submitting...' : success ? 'Redirecting...' : 'Submit Registration Request'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                        Already have an account?{' '}
                        <Link to="/admin/login" style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}>
                            Sign In
                        </Link>
                    </p>
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
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

                {/* Info Note */}
                <div style={{
                    marginTop: '1rem',
                    padding: '12px 16px',
                    background: '#eff6ff',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    color: '#1e40af'
                }}>
                    <strong>Note:</strong> Your registration will be reviewed by an administrator.
                    You will receive access once approved.
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
