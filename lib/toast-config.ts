import toast from 'react-hot-toast';

// Custom toast configurations for different types

export const showSuccessToast = (message: string, options?: any) => {
    return toast.success(message, {
        icon: '✅',
        style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
        },
        duration: 3000,
        ...options,
    });
};

export const showErrorToast = (message: string, options?: any) => {
    return toast.error(message, {
        icon: '❌',
        style: {
            background: '#EF4444',
            color: 'white',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)',
        },
        duration: 4000,
        ...options,
    });
};

export const showWarningToast = (message: string, options?: any) => {
    return toast(message, {
        icon: '⚠️',
        style: {
            background: '#F59E0B',
            color: 'white',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)',
        },
        duration: 3500,
        ...options,
    });
};

export const showInfoToast = (message: string, options?: any) => {
    return toast(message, {
        icon: 'ℹ️',
        style: {
            background: '#3B82F6',
            color: 'white',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
        },
        duration: 3000,
        ...options,
    });
};

export const showLoadingToast = (message: string, options?: any) => {
    return toast.loading(message, {
        style: {
            background: '#3B82F6',
            color: 'white',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
        },
        ...options,
    });
};

// Custom toast for cart actions
export const showCartToast = (message: string, action?: 'add' | 'remove' | 'update') => {
    const icons = {
        add: '🛒',
        remove: '🗑️',
        update: '✏️',
    };

    return toast.success(message, {
        icon: icons[action || 'add'],
        style: {
            background: '#DCCA87', // grilli-gold
            color: 'white',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 10px 40px rgba(220, 202, 135, 0.4)',
        },
        duration: 2500,
    });
};

// Promise toast for async operations
export const showPromiseToast = (
    promise: Promise<any>,
    messages: {
        loading: string;
        success: string;
        error: string;
    }
) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        {
            loading: {
                style: {
                    background: '#3B82F6',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
            },
            success: {
                style: {
                    background: '#10B981',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
                icon: '✅',
                duration: 3000,
            },
            error: {
                style: {
                    background: '#EF4444',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '12px',
                    padding: '16px 24px',
                },
                icon: '❌',
                duration: 4000,
            },
        }
    );
};

// Export default toast for backwards compatibility
export default toast;
