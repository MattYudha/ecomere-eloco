// *********************
// Role of the component: Pagination for navigating the shop page
// Name of the component: Pagination.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Pagination />
// Input parameters: no input parameters
// Output: Component with the current page and buttons for incrementing and decrementing page
// *********************

'use client';
import { usePaginationStore } from '@/app/_zustand/paginationStore';
import React from 'react';

const Pagination = () => {
  // getting from Zustand store current page and methods for incrementing and decrementing current page
  const { page, incrementPage, decrementPage } = usePaginationStore();
  return (
    <div className="flex gap-x-2 justify-center py-16 my-8 bg-white/30 dark:bg-black/20 backdrop-blur-md border border-white/40 dark:border-gray-700/50 rounded-xl">
      <button
        className="px-4 py-2 text-lg font-medium rounded-lg bg-white/20 dark:bg-black/30 border border-white/40 dark:border-gray-700/50 text-gray-900 dark:text-white hover:bg-white/40 dark:hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        onClick={() => decrementPage()}
      >
        «
      </button>
      <button className="px-4 py-2 text-lg font-medium rounded-lg bg-white/40 dark:bg-black/50 border border-white/40 dark:border-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300">
        Page {page}
      </button>
      <button
        className="px-4 py-2 text-lg font-medium rounded-lg bg-white/20 dark:bg-black/30 border border-white/40 dark:border-gray-700/50 text-gray-900 dark:text-white hover:bg-white/40 dark:hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        onClick={() => incrementPage()}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
