// *********************
// Role of the component: SortBy
// Name of the component: SortBy.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SortBy />
// Input parameters: no input parameters
// Output: select input with options for sorting by a-z, z-a, price low, price high
// *********************

'use client';
import React from 'react';
import { useSortStore } from '@/app/_zustand/sortStore';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const SortBy = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sortBy, changeSortBy } = useSortStore();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortValue = e.target.value;
    changeSortBy(newSortValue); // Update Zustand store

    const params = new URLSearchParams(searchParams.toString());
    if (newSortValue === 'defaultSort') {
      params.delete('sort');
    } else {
      params.set('sort', newSortValue);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
      <div className="relative">
        <select
          defaultValue={sortBy}
          onChange={handleSortChange}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cb6112] focus:border-transparent text-sm cursor-pointer shadow-sm hover:border-[#cb6112] transition-colors"
        >
          <option value="defaultSort">Recommended</option>
          <option value="titleAsc">Name (A-Z)</option>
          <option value="titleDesc">Name (Z-A)</option>
          <option value="lowPrice">Price (Low - High)</option>
          <option value="highPrice">Price (High - Low)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortBy;
