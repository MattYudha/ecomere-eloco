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
    <div className="flex items-center gap-x-5 max-lg:flex-col max-lg:w-full max-lg:items-start
                    bg-white/30 dark:bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/40 dark:border-gray-700/50 shadow-md">
      <h3 className="text-xl text-gray-900 dark:text-white">Sort by:</h3>{' '}
      <select
        defaultValue={sortBy}
        onChange={handleSortChange}
        className="select border-gray-300 dark:border-gray-600 py-2 px-2 text-base border-2 
                   w-40 focus:outline-none outline-none max-lg:w-full 
                   bg-white/40 dark:bg-black/30 text-gray-900 dark:text-white 
                   rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        name="sort"
      >
        <option value="defaultSort">Default</option>
        <option value="titleAsc">Sort A-Z</option>
        <option value="titleDesc">Sort Z-A</option>
        <option value="lowPrice">Lowest Price</option>
        <option value="highPrice">Highest Price</option>
      </select>
    </div>
  );
};

export default SortBy;
