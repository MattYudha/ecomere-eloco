'use client';

import React from 'react';
import { FaLock, FaShieldAlt, FaCheck, FaTruck } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface TrustBadgesProps {
    variant?: 'security' | 'payment' | 'delivery' | 'compact' | 'full';
    showSecurity?: boolean;
    showPayment?: boolean;
    showDelivery?: boolean;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({
    variant = 'full',
    showSecurity = true,
    showPayment = true,
    showDelivery = true,
}) => {
    // Payment methods data
    const paymentMethods = [
        { name: 'GoPay', color: 'bg-green-500' },
        { name: 'OVO', color: 'bg-purple-500' },
        { name: 'DANA', color: 'bg-blue-500' },
        { name: 'ShopeePay', color: 'bg-orange-500' },
        { name: 'BCA', color: 'bg-blue-600' },
        { name: 'Mandiri', color: 'bg-yellow-600' },
        { name: 'BNI', color: 'bg-orange-600' },
        { name: 'BRI', color: 'bg-blue-700' },
        { name: 'QRIS', color: 'bg-red-500' },
    ];

    // Calculate delivery estimate (2-4 business days)
    const getDeliveryEstimate = () => {
        const today = new Date();
        const deliveryDate = new Date(today);

        // Add 4 days for max estimate
        let daysAdded = 0;
        while (daysAdded < 4) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
            // Skip weekends
            if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
                daysAdded++;
            }
        }

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };
        return deliveryDate.toLocaleDateString('id-ID', options);
    };

    // Compact variant (for sidebar)
    if (variant === 'compact') {
        return (
            <div className="space-y-2">
                {showSecurity && (
                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                        <FaLock className="flex-shrink-0" />
                        <span>Pesanan aman & terenkripsi</span>
                    </div>
                )}

                {showDelivery && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                        <FaTruck className="flex-shrink-0" />
                        <span>Estimasi: 2-4 hari kerja</span>
                    </div>
                )}

                {showPayment && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        GoPay, OVO, DANA, Transfer Bank
                    </p>
                )}
            </div>
        );
    }

    // Security only variant
    if (variant === 'security') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-700 rounded-xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <h3 className="font-bold text-lg text-green-900 dark:text-green-100">
                        Pesanan Anda 100% Aman
                    </h3>
                </div>

                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <li className="flex items-center gap-2">
                        <FaCheck className="text-green-500 flex-shrink-0" />
                        <span>Pembayaran terenkripsi dengan SSL</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheck className="text-green-500 flex-shrink-0" />
                        <span>Data pribadi dilindungi ketat</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheck className="text-green-500 flex-shrink-0" />
                        <span>Transaksi aman & terpercaya</span>
                    </li>
                </ul>
            </motion.div>
        );
    }

    // Payment only variant
    if (variant === 'payment') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6"
            >
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Metode Pembayaran Aman:
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                    {paymentMethods.map((method, index) => (
                        <div
                            key={index}
                            className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-grilli-gold transition-colors"
                        >
                            {method.name}
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                    Pilih metode pembayaran favorit Anda saat checkout
                </p>
            </motion.div>
        );
    }

    // Delivery only variant
    if (variant === 'delivery') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl p-6"
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaTruck className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                            Pengiriman Cepat & Terpercaya
                        </h3>
                        <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                            <p className="flex items-center gap-2">
                                <FaCheck className="text-blue-500 flex-shrink-0" />
                                Estimasi pengiriman: <strong>2-4 hari kerja</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <FaCheck className="text-blue-500 flex-shrink-0" />
                                Diterima paling lambat: <strong>{getDeliveryEstimate()}</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <FaCheck className="text-blue-500 flex-shrink-0" />
                                Lacak pesanan Anda secara real-time
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Full variant (all badges)
    return (
        <div className="space-y-4">
            {showSecurity && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-700 rounded-xl p-4"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <FaLock className="text-green-500 text-lg flex-shrink-0" />
                        <h3 className="font-bold text-sm text-green-900 dark:text-green-100">
                            Pesanan Anda 100% Aman
                        </h3>
                    </div>

                    <ul className="space-y-1.5 text-xs text-green-700 dark:text-green-300">
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500 flex-shrink-0" size={10} />
                            <span>Pembayaran terenkripsi SSL</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500 flex-shrink-0" size={10} />
                            <span>Data pribadi dilindungi</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <FaCheck className="text-green-500 flex-shrink-0" size={10} />
                            <span>Transaksi aman & terpercaya</span>
                        </li>
                    </ul>
                </motion.div>
            )}

            {showDelivery && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl p-4"
                >
                    <div className="flex items-start gap-3">
                        <FaTruck className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                                Estimasi Pengiriman: 2-4 hari kerja
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-300">
                                Diterima paling lambat: <strong>{getDeliveryEstimate()}</strong>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {showPayment && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4"
                >
                    <p className="text-xs font-bold text-gray-900 dark:text-white mb-3 text-center">
                        Metode Pembayaran Aman:
                    </p>

                    <div className="flex flex-wrap justify-center gap-1.5">
                        {paymentMethods.slice(0, 6).map((method, index) => (
                            <div
                                key={index}
                                className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                                {method.name}
                            </div>
                        ))}
                        <div className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-500 dark:text-gray-400">
                            +{paymentMethods.length - 6} lainnya
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TrustBadges;
