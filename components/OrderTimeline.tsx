'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox,
    FaCog,
    FaTruck,
    FaHome,
    FaCheck,
    FaTimes,
} from 'react-icons/fa';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface TimelineStep {
    id: string;
    label: string;
    icon: React.ReactNode;
    status: OrderStatus;
}

interface OrderTimelineProps {
    currentStatus: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    estimatedDelivery?: Date;
    className?: string;
    orientation?: 'horizontal' | 'vertical';
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({
    currentStatus,
    createdAt,
    updatedAt,
    estimatedDelivery,
    className = '',
    orientation = 'horizontal',
}) => {
    // Define timeline steps (excluding cancelled as it's a special state)
    const steps: TimelineStep[] = useMemo(() => [
        {
            id: 'pending',
            label: 'Pesanan Diterima',
            icon: <FaBox size={20} />,
            status: 'pending',
        },
        {
            id: 'processing',
            label: 'Sedang Diproses',
            icon: <FaCog size={20} />,
            status: 'processing',
        },
        {
            id: 'shipped',
            label: 'Dalam Pengiriman',
            icon: <FaTruck size={20} />,
            status: 'shipped',
        },
        {
            id: 'delivered',
            label: 'Pesanan Sampai',
            icon: <FaHome size={20} />,
            status: 'delivered',
        },
    ], []);

    // Get current step index
    const currentStepIndex = useMemo(() => {
        if (currentStatus === 'cancelled') return -1;
        return steps.findIndex((step) => step.status === currentStatus);
    }, [currentStatus, steps]);

    // Check if a step is completed
    const isStepCompleted = (index: number): boolean => {
        if (currentStatus === 'cancelled') return false;
        return index < currentStepIndex;
    };

    // Check if a step is current
    const isStepCurrent = (index: number): boolean => {
        if (currentStatus === 'cancelled') return false;
        return index === currentStepIndex;
    };

    // Cancelled state display
    if (currentStatus === 'cancelled') {
        return (
            <div className={`${className}`}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-2xl"
                >
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <FaTimes className="text-red-600 dark:text-red-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">
                        Pesanan Dibatalkan
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        Pesanan ini telah dibatalkan pada{' '}
                        {new Date(updatedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </motion.div>
            </div>
        );
    }

    // Horizontal layout (desktop)
    if (orientation === 'horizontal') {
        return (
            <div className={`w-full ${className}`}>
                <div className="flex items-center justify-between relative">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* Step */}
                            <div className="flex flex-col items-center relative z-10 flex-1">
                                {/* Icon Circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1, type: 'spring' }}
                                    className={`
                                        w-14 h-14 rounded-full flex items-center justify-center mb-3
                                        border-4 transition-all duration-300
                                        ${isStepCompleted(index)
                                            ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/50'
                                            : isStepCurrent(index)
                                                ? 'bg-grilli-gold border-grilli-gold text-white shadow-lg shadow-grilli-gold/50'
                                                : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                        }
                                    `}
                                >
                                    {isStepCompleted(index) ? (
                                        <FaCheck size={24} />
                                    ) : (
                                        step.icon
                                    )}

                                    {/* Pulse animation for current step */}
                                    {isStepCurrent(index) && (
                                        <motion.div
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 1.8, opacity: 0 }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: 'easeOut',
                                            }}
                                            className="absolute inset-0 rounded-full border-4 border-grilli-gold"
                                        />
                                    )}
                                </motion.div>

                                {/* Label */}
                                <p
                                    className={`
                                        text-sm font-bold text-center px-2 whitespace-nowrap
                                        ${isStepCompleted(index) || isStepCurrent(index)
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-400 dark:text-gray-500'
                                        }
                                    `}
                                >
                                    {step.label}
                                </p>

                                {/* Timestamp (only for completed and current) */}
                                {(isStepCompleted(index) || isStepCurrent(index)) && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {index === currentStepIndex
                                            ? new Date(updatedAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                            })
                                            : new Date(createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                    </p>
                                )}
                            </div>

                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-1 mx-4 relative" style={{ top: '-30px' }}>
                                    <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{
                                                width: isStepCompleted(index) ? '100%' : '0%',
                                            }}
                                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                            className="h-full bg-gradient-to-r from-green-400 to-green-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }

    // Vertical layout (mobile)
    return (
        <div className={`w-full ${className}`}>
            <div className="flex flex-col space-y-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                        {/* Icon and Line Container */}
                        <div className="flex flex-col items-center">
                            {/* Icon Circle */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1, type: 'spring' }}
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center
                                    border-4 transition-all duration-300 flex-shrink-0
                                    ${isStepCompleted(index)
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
                                        : isStepCurrent(index)
                                            ? 'bg-grilli-gold border-grilli-gold text-white shadow-lg shadow-grilli-gold/30'
                                            : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                                    }
                                `}
                            >
                                {isStepCompleted(index) ? (
                                    <FaCheck size={20} />
                                ) : (
                                    React.cloneElement(step.icon as React.ReactElement, {
                                        size: 18,
                                    })
                                )}

                                {/* Pulse for current */}
                                {isStepCurrent(index) && (
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 1.6, opacity: 0 }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                        }}
                                        className="absolute inset-0 rounded-full border-4 border-grilli-gold"
                                    />
                                )}
                            </motion.div>

                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div className="w-1 h-16 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ height: '0%' }}
                                        animate={{
                                            height: isStepCompleted(index) ? '100%' : '0%',
                                        }}
                                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                        className="w-full bg-gradient-to-b from-green-400 to-green-600"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-2">
                            <h4
                                className={`
                                    font-bold mb-1
                                    ${isStepCompleted(index) || isStepCurrent(index)
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-400 dark:text-gray-500'
                                    }
                                `}
                            >
                                {step.label}
                            </h4>
                            {(isStepCompleted(index) || isStepCurrent(index)) && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {index === currentStepIndex
                                        ? new Date(updatedAt).toLocaleString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : new Date(createdAt).toLocaleString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTimeline;
