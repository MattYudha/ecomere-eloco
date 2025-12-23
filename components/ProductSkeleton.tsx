import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
      {/* Image Container Placeholder */}
      <div className="relative w-full aspect-square bg-gray-200 dark:bg-gray-700/50"></div>

      {/* Content Section Placeholder */}
      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="flex-1 space-y-2">
          {/* Title Placeholder (2 lines) */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

          {/* Rating Placeholder */}
          <div className="flex items-center gap-1 pt-1">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Price Placeholder */}
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
        </div>

        {/* Buttons Placeholder */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
