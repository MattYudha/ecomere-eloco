'use client';
import React from 'react';
import { FaShieldAlt, FaLock } from 'react-icons/fa';

const TrustBadges: React.FC = () => {
    return (
        <div className="space-y-2">
            {/* Security Message */}
            <div className="flex items-center justify-center gap-1.5 p-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <FaShieldAlt className="text-green-600 dark:text-green-400 flex-shrink-0" size={14} />
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-green-900 dark:text-green-100 leading-tight">
                        Pesanan Anda Aman
                    </p>
                </div>
                <FaLock className="text-green-600 dark:text-green-400 flex-shrink-0" size={12} />
            </div>

            {/* Payment Provider Badges */}
            <div className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-[9px] text-gray-600 dark:text-gray-400 text-center mb-1.5 font-medium uppercase tracking-wide">
                    Metode Pembayaran
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {/* Visa */}
                    <div className="group relative">
                        <div className="w-9 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <svg viewBox="0 0 48 32" className="w-8 h-4">
                                <rect width="48" height="32" fill="white" />
                                <path d="M21.3 19.8l1.9-11.6h3l-1.9 11.6h-3zm13.6-11.3c-.6-.2-1.5-.5-2.6-.5-2.9 0-4.9 1.5-4.9 3.7 0 1.6 1.5 2.5 2.6 3 1.1.6 1.5 1 1.5 1.5 0 .8-.9 1.1-1.8 1.1-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.4c.7.3 2 .6 3.3.6 3.1 0 5.1-1.5 5.1-3.8 0-1.2-.7-2.2-2.4-3-1-.5-1.6-.9-1.6-1.4 0-.5.5-.9 1.7-.9.9 0 1.6.2 2.1.4l.3.1.4-2.4zm5.7-1.5c-.6 0-1.1.4-1.4.9l-4.9 11.3h3.1l.6-1.7h3.8l.4 1.7h2.7l-2.4-11.6h-2.5-.4zm.4 3.4l.9 4.4h-2.5l1.6-4.4zM18.6 8.2L15.8 17l-.3-1.5c-.5-1.7-2.1-3.6-4-4.5l2.7 10.2h3.1l4.6-11.6h-3.1-.2z" fill="#1434CB" />
                                <path d="M12.1 8.2H7.4l0 .2c3.7.9 6.1 3.1 7.1 5.8l-1-5c-.2-.8-.7-1-.9-1h-1.5.1z" fill="#F7B600" />
                            </svg>
                        </div>
                    </div>

                    {/* Mastercard */}
                    <div className="group relative">
                        <div className="w-9 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <svg viewBox="0 0 48 32" className="w-8 h-4">
                                <rect width="48" height="32" fill="white" />
                                <circle cx="18" cy="16" r="8" fill="#EB001B" />
                                <circle cx="30" cy="16" r="8" fill="#F79E1B" />
                                <path d="M24 9.6c-1.7 1.4-2.8 3.5-2.8 5.9s1.1 4.5 2.8 5.9c1.7-1.4 2.8-3.5 2.8-5.9s-1.1-4.5-2.8-5.9z" fill="#FF5F00" />
                            </svg>
                        </div>
                    </div>

                    {/* BCA */}
                    <div className="group relative">
                        <div className="px-1 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400">BCA</span>
                        </div>
                    </div>

                    {/* Mandiri */}
                    <div className="group relative">
                        <div className="px-1 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">Mandiri</span>
                        </div>
                    </div>

                    {/* BNI */}
                    <div className="group relative">
                        <div className="px-1 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400">BNI</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustBadges;
