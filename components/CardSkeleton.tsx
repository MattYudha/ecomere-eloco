import React from 'react';

const CardSkeleton: React.FC = () => {
    return (
        <div className="rounded-lg p-6 shadow-sm bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-600 animate-pulse">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Icon Placeholder */}
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>

                    <div className="space-y-2">
                        {/* Title Placeholder */}
                        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
                        {/* Subtitle Placeholder */}
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status Badge Placeholder */}
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
                    {/* Action Button Placeholder */}
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-white/5 rounded p-3 text-center border border-gray-200 dark:border-white/20"
                    >
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto"></div>
                    </div>
                ))}
            </div>

            {/* Additional Content Placeholder */}
            <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
        </div>
    );
};

export default CardSkeleton;
