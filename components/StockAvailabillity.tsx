// *********************
// Role of the component: Stock availability component for displaying current stock status of the product
// Name of the component: StockAvailabillity.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <StockAvailabillity stock={stock} inStock={inStock} />
// Input parameters: { stock: number, inStock: number }
// Output: styled text that displays current stock status on the single product page
// *********************

import React from 'react';
import { FaCheck } from 'react-icons/fa6';
import { FaXmark } from 'react-icons/fa6';

const StockAvailabillity = ({
  stock,
  inStock,
}: {
  stock: number;
  inStock: number;
}) => {
  return (
    <p className="text-xl flex gap-x-2 max-[500px]:justify-center">
      Availability:
      {inStock === 1 ? (
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-x-1.5 font-medium text-sm tracking-wide bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/20">
          In stock <FaCheck className="w-3 h-3" />
        </span>
      ) : (
        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm flex items-center gap-x-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
          Out of Stock
        </span>
      )}
    </p>
  );
};

export default StockAvailabillity;
