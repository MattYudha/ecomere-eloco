'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderProgressBarProps {
    status: OrderStatus;
    createdAt: Date;
    estimatedDelivery?: Date;
    className?: string;
}

const OrderProgressBar: React.FC<OrderProgressBarProps> = ({
    status,
    createdAt,
    estimatedDelivery,
    className = '',
}) => {
    // Calculate progress percentage based on status
    const progressConfig = useMemo(() => {
        const configs = {
            pending: {
                percentage: 0,
                color: 'from-yellow-400 to-yellow-600',
                bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
            },
            processing: {
                percentage: 33,
                color: 'from-blue-400 to-blue-600',
                bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            },
            shipped: {
                percentage: 66,
                color: 'from-purple-400 to-purple-600',
                bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            },
            delivered: {
                percentage: 100,
                color: 'from-green-400 to-green-600',
                bgColor: 'bg-green-100 dark:bg-green-900/20',
            },
            cancelled: {
                percentage: 0,
                color: 'from-red-400 to-red-600',
                bgColor: 'bg-red-100 dark:bg-red-900/20',
            },
        };
        return configs[status] || configs.pending;
    }, [status]);

    // Calculate days since order
    const daysSinceOrder = useMemo(() => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - new Date(createdAt).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }, [createdAt]);

    // Calculate days until delivery (if estimated)
    const daysUntilDelivery = useMemo(() => {
        if (!estimatedDelivery) return null;
        const now = new Date();
        const diffTime = new Date(estimatedDelivery).getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }, [estimatedDelivery]);

    return (
        <div className={`w-full ${className}`}>
            {/* Progress Bar */}
            <div className="relative">
                {/* Background */}
                <div className={`h-3 rounded-full ${progressConfig.bgColor} overflow-hidden`}>
                    {/* Progress Fill */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressConfig.percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className={`h-full bg-gradient-to-r ${progressConfig.color} rounded-full relative`}
                    >
                        {/* Shimmer effect */}
                        {progressConfig.percentage > 0 && progressConfig.percentage < 100 && (
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                        )}
                    </motion.div>
                </div>

                {/* Progress Indicator Dot */}
                {progressConfig.percentage > 0 && progressConfig.percentage < 100 && (
                    <motion.div
                        initial={{ scale: 0, left: 0 }}
                        animate={{
                            scale: 1,
                            left: `${progressConfig.percentage}%`,
                        }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${progressConfig.color} border-4 border-white dark:border-gray-800 shadow-lg`}>
                            {/* Pulse ring */}
                            <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeOut',
                                }}
                                className={`absolute inset-0 rounded-full bg-gradient-to-br ${progressConfig.color}`}
                            />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Info Section */}
            <div className="flex justify-between items-center mt-3">
                {/* Percentage & Days */}
                <div className="text-sm">
                    <span className="font-bold text-gray-900 dark:text-white">
                        {progressConfig.percentage}%
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                        • {daysSinceOrder} hari sejak order
                    </span>
                </div>

                {/* Estimated Delivery */}
                {daysUntilDelivery !== null && status !== 'delivered' && status !== 'cancelled' && (
                    <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Estimasi: </span>
                        <span className="font-bold text-grilli-gold">
                            {daysUntilDelivery === 0 ? 'Hari ini' : `${daysUntilDelivery} hari lagi`}
                        </span>
                    </div>
                )}

                {/* Delivered message */}
                {status === 'delivered' && (
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        ✓ Pesanan telah sampai
                    </div>
                )}

                {/* Cancelled message */}
                {status === 'cancelled' && (
                    <div className="text-sm font-bold text-red-600 dark:text-red-400">
                        ✗ Pesanan dibatalkan
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderProgressBar;
