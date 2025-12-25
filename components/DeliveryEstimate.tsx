'use client';
import React from 'react';
import { FaTruck, FaClock } from 'react-icons/fa';

const DeliveryEstimate: React.FC = () => {
    // Calculate estimated delivery date (5-7 business days from now)
    const today = new Date();
    const minDeliveryDate = new Date(today);
    const maxDeliveryDate = new Date(today);

    // Add 5-7 business days (skip weekends)
    let daysAdded = 0;
    while (daysAdded < 5) {
        minDeliveryDate.setDate(minDeliveryDate.getDate() + 1);
        if (minDeliveryDate.getDay() !== 0 && minDeliveryDate.getDay() !== 6) {
            daysAdded++;
        }
    }

    daysAdded = 0;
    while (daysAdded < 7) {
        maxDeliveryDate.setDate(maxDeliveryDate.getDate() + 1);
        if (maxDeliveryDate.getDay() !== 0 && maxDeliveryDate.getDay() !== 6) {
            daysAdded++;
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaTruck className="text-white" size={12} />
                </div>
                <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-gray-900 dark:text-white mb-0.5 flex items-center gap-0.5">
                        <FaClock className="text-blue-600 dark:text-blue-400" size={8} />
                        Estimasi Pengiriman
                    </h4>
                    <p className="text-[9px] text-gray-700 dark:text-gray-300 leading-tight">
                        {formatDate(minDeliveryDate)} - {formatDate(maxDeliveryDate)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryEstimate;
