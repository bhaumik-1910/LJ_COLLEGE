import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const AuthContext = createContext({
    user: null,
    role: null,
    token: null,
    loading: false,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    logout: () => { },
    forgotPassword: async () => ({ success: false }),
    resetPassword: async () => ({ success: false }),
});

const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [role, setRole] = useState(() => localStorage.getItem('role'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const persist = (tk, rl) => {
        if (tk) localStorage.setItem('token', tk); else localStorage.removeItem('token');
        if (rl) localStorage.setItem('role', rl); else localStorage.removeItem('role');
        setToken(tk || null);
        setRole(rl || null);
    };

    // Use effects to load user data based on token
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedToken = localStorage.getItem('token');
        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.message || 'Invalid credentials' };
            persist(data.token, data.role);
            return { success: true, role: data.role };
        } catch {
            return { success: false, message: 'Server error' };
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async ({ name, email, password, designation, role, university }) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, designation, role, university }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.message || 'Error registering user' };
            return { success: true, message: data.message };
        } catch {
            return { success: false, message: 'Server error' };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        persist(null, null);
        setUser(null);
        toast.info("Logged out successfully.");
    }, []);

    const forgotPassword = useCallback(async (email) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.message || 'Failed to send OTP' };
            return { success: true, message: data.message || 'OTP sent to your email.' };
        } catch (err) {
            return { success: false, message: 'Network error. Please try again.' };
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async ({ email, otp, newPassword, confirmPassword }) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
            });
            const data = await res.json();
            if (!res.ok) return { success: false, message: data.message || 'Password reset failed' };
            return { success: true, message: data.message || 'Password reset successfully.' };
        } catch (err) {
            return { success: false, message: 'Network error. Please try again.' };
        } finally {
            setLoading(false);
        }
    }, []);

    const value = React.useMemo(
        () => ({ user, role, token, loading, login, register, logout, forgotPassword, resetPassword }),
        [user, role, token, loading, login, register, logout, forgotPassword, resetPassword]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};