// *********************
// Role of the component: Pagination for navigating the shop page
// Name of the component: Pagination.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Pagination />
// Input parameters: no input parameters
// Output: Component with the current page and buttons for incrementing and decrementing page
// *********************

"use client";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import React from "react";

const Pagination = () => {
  // getting from Zustand store current page and methods for incrementing and decrementing current page
  const { page, incrementPage, decrementPage } = usePaginationStore();
  return (
    <div className="join flex justify-center py-16">
      <button
        className="join-item btn btn-lg bg-grilli-gold text-black hover:bg-black hover:text-grilli-gold dark:bg-grilli-gold dark:text-black dark:hover:bg-gray-700 dark:hover:text-grilli-gold"
        onClick={() => decrementPage()}
      >
        «
      </button>
      <button className="join-item btn btn-lg bg-grilli-gold text-black hover:bg-black hover:text-grilli-gold dark:bg-grilli-gold dark:text-black dark:hover:bg-gray-700 dark:hover:text-grilli-gold">
        Page {page}
      </button>
      <button
        className="join-item btn btn-lg bg-grilli-gold text-black hover:bg-black hover:text-grilli-gold dark:bg-grilli-gold dark:text-black dark:hover:bg-gray-700 dark:hover:text-grilli-gold"
        onClick={() => incrementPage()}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
