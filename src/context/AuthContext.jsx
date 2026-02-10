import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simulated user database (localStorage)
const USERS_KEY = 'dmo_portal_users';
const CURRENT_USER_KEY = 'dmo_portal_current_user';

// Get users from localStorage
const getStoredUsers = () => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Default super admin account
const initializeDefaultAdmin = () => {
    const users = getStoredUsers();
    if (!users.find(u => u.email === 'admin@africanunion.org')) {
        users.push({
            id: 'admin-001',
            email: 'admin@africanunion.org',
            password: 'admin123', // In production, this would be hashed
            name: 'AU Administrator',
            role: 'super_admin',
            country: 'AU',
            organization: 'African Union',
            position: 'System Administrator',
            status: 'active',
            createdAt: new Date().toISOString()
        });
        saveUsers(users);
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize default admin
        initializeDefaultAdmin();

        // Check for existing session
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const users = getStoredUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (!foundUser) {
            throw new Error('Invalid email or password');
        }

        if (foundUser.status === 'pending') {
            throw new Error('Your account is pending approval. Please wait for administrator approval.');
        }

        if (foundUser.status === 'rejected') {
            throw new Error('Your account registration was rejected. Please contact support.');
        }

        const userSession = { ...foundUser };
        delete userSession.password; // Don't store password in session

        setUser(userSession);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));

        return userSession;
    };

    const register = async (userData) => {
        const users = getStoredUsers();

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            throw new Error('An account with this email already exists');
        }

        const newUser = {
            id: `user-${Date.now()}`,
            ...userData,
            role: 'dmo_officer',
            status: 'pending', // Requires admin approval
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return { success: true, message: 'Registration successful! Your account is pending approval.' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };

    const updateUser = (updatedData) => {
        const users = getStoredUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            saveUsers(users);

            const updatedSession = { ...user, ...updatedData };
            setUser(updatedSession);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedSession));
        }
    };

    // Admin functions
    const getPendingUsers = () => {
        if (user?.role !== 'super_admin') return [];
        return getStoredUsers().filter(u => u.status === 'pending');
    };

    const approveUser = (userId) => {
        if (user?.role !== 'super_admin') return;
        const users = getStoredUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].status = 'active';
            users[index].approvedBy = user.id;
            users[index].approvedAt = new Date().toISOString();
            saveUsers(users);
        }
    };

    const rejectUser = (userId, reason) => {
        if (user?.role !== 'super_admin') return;
        const users = getStoredUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].status = 'rejected';
            users[index].rejectedBy = user.id;
            users[index].rejectedAt = new Date().toISOString();
            users[index].rejectionReason = reason;
            saveUsers(users);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'super_admin',
        isDMOOfficer: user?.role === 'dmo_officer',
        login,
        register,
        logout,
        updateUser,
        getPendingUsers,
        approveUser,
        rejectUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Protected Route Component
export const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            }}>
                <div style={{ color: '#fff', fontSize: 18 }}>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login - will be handled by router
        window.location.href = '/admin/login';
        return null;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'super_admin') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#fff'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Access Denied</h2>
                    <p>You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthContext;
