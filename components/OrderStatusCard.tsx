'use client';
import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderProgressBar from './OrderProgressBar';
import OrderTimeline from './OrderTimeline';
import { motion } from 'framer-motion';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderStatusCardProps {
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    estimatedDelivery?: Date;
    showTimeline?: boolean;
    showProgressBar?: boolean;
    timelineOrientation?: 'horizontal' | 'vertical';
    className?: string;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
    status,
    createdAt,
    updatedAt,
    estimatedDelivery,
    showTimeline = true,
    showProgressBar = true,
    timelineOrientation = 'horizontal',
    className = '',
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Status Pesanan
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Lacak progress pesanan Anda secara real-time
                        </p>
                    </div>
                    <OrderStatusBadge status={status} size="lg" />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
                {/* Progress Bar */}
                {showProgressBar && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                            Progress Pengiriman
                        </h4>
                        <OrderProgressBar
                            status={status}
                            createdAt={createdAt}
                            estimatedDelivery={estimatedDelivery}
                        />
                    </div>
                )}

                {/* Timeline */}
                {showTimeline && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                            Timeline Pesanan
                        </h4>
                        <OrderTimeline
                            currentStatus={status}
                            createdAt={createdAt}
                            updatedAt={updatedAt}
                            estimatedDelivery={estimatedDelivery}
                            orientation={timelineOrientation}
                        />
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Dibuat: {new Date(createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                        Update terakhir: {new Date(updatedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderStatusCard;
