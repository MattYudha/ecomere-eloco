'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    image?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    checkAuth: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await apiClient.get('/api/users/profile');
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            //   console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
        try {
            await apiClient.get('/api/auth/logout');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
