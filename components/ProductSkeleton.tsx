// Eloco/components/ProductSkeleton.tsx
import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="group block w-full animate-pulse">
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-200 dark:bg-gray-700 aspect-square">
        {/* Image Placeholder */}
        <div className="w-full h-full object-cover"></div>
      </div>

      {/* Product Details Placeholders */}
      <div className="mt-4 text-center">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>{' '}
        {/* Product Name */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>{' '}
        {/* Category */}
        <div className="mt-2 flex items-center justify-center space-x-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>{' '}
          {/* Price */}
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
