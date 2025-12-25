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
import { ArrowUpDown } from 'lucide-react';

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
      <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <ArrowUpDown size={16} className="text-grilli-gold" />
        <span>Sort by:</span>
      </div>
      <div className="relative">
        <select
          defaultValue={sortBy}
          onChange={handleSortChange}
          className="appearance-none bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-grilli-gold focus:border-grilli-gold text-sm font-medium cursor-pointer shadow-sm hover:border-grilli-gold hover:shadow-md transition-all"
        >
          <option value="defaultSort">🔥 Recommended</option>
          <option value="newest">✨ Newest</option>
          <option value="bestseller">⭐ Best Seller</option>
          <option value="mostReviewed">💬 Most Reviewed</option>
          <option value="lowPrice">💰 Price: Low - High</option>
          <option value="highPrice">💎 Price: High - Low</option>
          <option value="titleAsc">🔤 Name: A - Z</option>
          <option value="titleDesc">🔡 Name: Z - A</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-grilli-gold">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortBy;
