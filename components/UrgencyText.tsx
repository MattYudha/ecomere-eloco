// *********************
// Role of the component: Display stock urgency in a premium, non-aggressive tone
// Name of the component: UrgencyText.tsx
// Developer: Eloco E-commerce Team
// Version: 2.0
// Component call: <UrgencyText stock={product?.inStock} />
// Input parameters: { stock: number }
// Output: Premium urgency text with Indonesian language
// *********************

import React from 'react';

const UrgencyText = ({ stock }: { stock: number }) => {
  if (stock === 0 || !stock) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl bg-red-50/60 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50">
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-red-700 dark:text-red-300">
          Stok habis
        </span>
      </div>
    );
  }

  if (stock <= 5) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl bg-orange-50/60 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50">
        <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
          Stok terbatas — tersisa <span className="font-bold">{stock}</span> produk
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl bg-green-50/60 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50">
      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium text-green-700 dark:text-green-300">
        Tersedia — stok lengkap
      </span>
    </div>
  );
};

export default UrgencyText;
