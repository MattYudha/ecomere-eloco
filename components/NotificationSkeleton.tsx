import React from 'react';

const NotificationSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start gap-4">
                {/* Checkbox Placeholder */}
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>

                {/* Icon Placeholder */}
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    {/* Title & Badge */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>

                        {/* Unread Badge Placeholder */}
                        <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full ml-2"></div>
                    </div>

                    {/* Timestamp & Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>

                        <div className="flex gap-2">
                            {/* Action Buttons Placeholder */}
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSkeleton;
