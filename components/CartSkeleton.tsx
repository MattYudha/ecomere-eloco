import React from 'react';

const CartSkeleton: React.FC = () => {
    return (
        <li className="flex py-6 sm:py-10 animate-pulse">
            {/* Image Placeholder */}
            <div className="flex-shrink-0">
                <div className="h-24 w-24 sm:h-48 sm:w-48 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Content Section */}
            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                        {/* Title Placeholder */}
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>

                        {/* Price Placeholder */}
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mt-3"></div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                        {/* Quantity Control Placeholder */}
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>

                        {/* Remove Button Placeholder */}
                        <div className="absolute right-0 top-0">
                            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Stock Status Placeholder */}
                <div className="mt-4 flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
            </div>
        </li>
    );
};

export default CartSkeleton;
