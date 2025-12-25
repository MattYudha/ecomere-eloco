'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
    FaClock,
    FaSpinner,
    FaTruck,
    FaCheckCircle,
    FaTimesCircle,
} from 'react-icons/fa';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    animated?: boolean;
    className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    status,
    size = 'md',
    showIcon = true,
    animated = true,
    className = '',
}) => {
    // Status configurations
    const statusConfig = {
        pending: {
            label: 'Menunggu',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
            icon: <FaClock />,
            pulse: true,
        },
        processing: {
            label: 'Diproses',
            color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
            icon: <FaSpinner className="animate-spin" />,
            pulse: true,
        },
        shipped: {
            label: 'Dikirim',
            color: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
            icon: <FaTruck />,
            pulse: false,
        },
        delivered: {
            label: 'Terkirim',
            color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
            icon: <FaCheckCircle />,
            pulse: false,
        },
        cancelled: {
            label: 'Dibatalkan',
            color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
            icon: <FaTimesCircle />,
            pulse: false,
        },
    };

    const config = statusConfig[status] || statusConfig.pending;

    // Size classes
    const sizeClasses = {
        sm: 'text-xs px-2 py-1 gap-1',
        md: 'text-sm px-3 py-1.5 gap-2',
        lg: 'text-base px-4 py-2 gap-2',
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16,
    };

    return (
        <motion.div
            initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
            animate={animated ? { scale: 1, opacity: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`
                inline-flex items-center justify-center
                font-bold rounded-full border-2
                ${config.color}
                ${sizeClasses[size]}
                ${className}
                relative
            `}
        >
            {/* Pulse animation for active statuses */}
            {animated && config.pulse && (
                <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                    className="absolute inset-0 rounded-full border-2 border-current"
                />
            )}

            {/* Icon */}
            {showIcon && (
                <span className="relative z-10">
                    {React.cloneElement(config.icon as React.ReactElement, {
                        size: iconSizes[size],
                    })}
                </span>
            )}

            {/* Label */}
            <span className="relative z-10 whitespace-nowrap">{config.label}</span>
        </motion.div>
    );
};

export default OrderStatusBadge;
