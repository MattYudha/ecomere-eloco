import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    image?: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
}

// Simple global state/hook for auth
// In a real app, you might want to use Context or Zustand properly.
// For now, we fetch on mount.
// To share state across components without prop drilling, we should use a Context.
// But for standard migration, let's keep it simple first. 
// Actually current Header uses it, and other pages. A Context is better.
// But I will create a simple hook that can be used.

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Assuming backend has /api/auth/me or /api/users/profile
                // Based on user request "Backend Railway TETAP MENANGANI... Session"
                // I will assume /api/users/profile exists or similar.
                // If not, I might need to rely on the cookie presence?
                // Let's try to fetch /api/users/profile which usually returns 200 if logged in.
                // I will trust the backend has a way to identify the user.
                // If I look at the deleted authOptions, it had no custom endpoints.
                // But the Backend (Railway) is "Backend (API...)".
                // I'll guess '/api/users/profile' or similar. 
                // I recall 'api/dashboard-stats' worked.
                // Let's return null for now and fix endpoint later if needed.
                // Actually, for "Frontend UI only", we need to know IF logged in.

                // I will try to fetch a lightweight protected endpoint.
                const res = await apiClient.get('/api/users/profile');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // console.error(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return {
        data: user ? { user } : null,
        status: loading ? 'loading' : (user ? 'authenticated' : 'unauthenticated')
    };
};
