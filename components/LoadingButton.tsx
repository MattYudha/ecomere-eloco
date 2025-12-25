import React from 'react';
import { motion } from 'framer-motion';

interface LoadingButtonProps {
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    className = '',
    type = 'button',
    fullWidth = false,
}) => {
    const isDisabled = loading || disabled;

    // Variant styles
    const variantStyles = {
        primary: 'bg-grilli-gold hover:bg-grilli-gold/90 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600',
    };

    // Size styles
    const sizeStyles = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
    };

    const baseStyles = `
    relative inline-flex items-center justify-center gap-2 
    font-semibold rounded-lg transition-all duration-200
    focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-grilli-gold
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${isDisabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
  `;

    return (
        <motion.button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={`${baseStyles} ${className}`}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {loading && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Spinner */}
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </motion.div>
            )}

            {/* Content with opacity transition */}
            <span className={`${loading ? 'invisible' : 'visible'} flex items-center gap-2`}>
                {children}
            </span>
        </motion.button>
    );
};

export default LoadingButton;
