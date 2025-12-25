import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 5 }) => {
    return (
        <div className="max-w-screen-2xl mx-auto">
            <div className="overflow-x-auto">
                <table className="table text-center">
                    <thead>
                        <tr>
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index}>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-200 dark:border-gray-700">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="py-5">
                                        {colIndex === 0 ? (
                                            // Checkbox column
                                            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                                        ) : colIndex === 1 ? (
                                            // Image column
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                            </div>
                                        ) : colIndex === 2 ? (
                                            // Name column
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
                                            </div>
                                        ) : colIndex === 3 ? (
                                            // Status column
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 mx-auto animate-pulse"></div>
                                        ) : (
                                            // Action column
                                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto animate-pulse"></div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableSkeleton;
