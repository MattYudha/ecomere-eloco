import { useAuthContext } from '@/context/auth-context';

// Refactored to use the global context
export const useAuth = () => {
    const { user, loading, isAuthenticated, logout } = useAuthContext();

    return {
        data: user ? { user } : null,
        status: loading ? 'loading' : (isAuthenticated ? 'authenticated' : 'unauthenticated'),
        logout // Expose logout
    };
};
