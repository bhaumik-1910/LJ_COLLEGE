import React from 'react'

export const AuthContext = React.createContext({
    user: null,
    role: null,
    token: null,
    loading: false,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    logout: () => { },
})

const API_BASE = 'http://localhost:5000/api'

export const AuthProvider = ({ children }) => {
    const [token, setToken] = React.useState(() => localStorage.getItem('token'))
    const [role, setRole] = React.useState(() => localStorage.getItem('role'))
    const [user, setUser] = React.useState(null)
    const [loading, setLoading] = React.useState(false)

    const persist = (tk, rl) => {
        if (tk) localStorage.setItem('token', tk); else localStorage.removeItem('token')
        if (rl) localStorage.setItem('role', rl); else localStorage.removeItem('role')
        setToken(tk || null)
        setRole(rl || null)
    }

    //Login Function
    const login = React.useCallback(async (email, password) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) return { success: false, message: data.message || 'Invalid credentials' }
            persist(data.token, data.role)
            return { success: true, role: data.role }
        } catch {
            return { success: false, message: 'Server error' }
        } finally {
            setLoading(false)
        }
    }, [])

    //Register Function
    const register = React.useCallback(async ({ name, email, password, designation, role, university }) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, designation, role, university }),
            })
            const data = await res.json()
            if (!res.ok) return { success: false, message: data.message || 'Error registering user' }
            return { success: true }
        } catch {
            return { success: false, message: 'Server error' }
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = React.useCallback(() => {
        persist(null, null)
        setUser(null)
    }, [])

    const value = React.useMemo(
        () => ({ user, role, token, loading, login, register, logout }),
        [user, role, token, loading, login, register, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}