import { useMemo } from 'react';
import { useAuthContext } from '@/context/auth-context';

// Refactored to use the global context
export const useAuth = () => {
    const { user, loading, isAuthenticated, logout, checkAuth } = useAuthContext();

    return useMemo(() => ({
        data: user ? { user } : null,
        status: loading ? 'loading' : (isAuthenticated ? 'authenticated' : 'unauthenticated'),
        logout,
        checkAuth // Expose checkAuth
    }), [user, loading, isAuthenticated, logout, checkAuth]);
};
