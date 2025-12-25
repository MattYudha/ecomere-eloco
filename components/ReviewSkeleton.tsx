import React from 'react';

const ReviewSkeleton: React.FC = () => {
    return (
        <div className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 animate-pulse">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    {/* Avatar Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>

                    <div className="space-y-2">
                        {/* Name Placeholder */}
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>

                        {/* Rating & Date Placeholder */}
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Delete Button Placeholder */}
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Review Text Placeholder */}
            <div className="pl-[3.25rem] space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            </div>

            {/* Review Images Placeholder */}
            <div className="pl-[3.25rem] mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 2 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700"
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSkeleton;
