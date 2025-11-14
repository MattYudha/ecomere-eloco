// *********************
// Role of the component: Search input element located in the header but it can be used anywhere in your application
// Name of the component: SearchInput.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SearchInput />
// Input parameters: no input parameters
// Output: form with search input and button
// *********************

"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { sanitize } from "@/lib/sanitize";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  // function for modifying URL for searching products
  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize the search input before using it in URL
    const sanitizedSearch = sanitize(searchInput);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput("");
  };

  return (
    <form className="flex w-full justify-center items-center" onSubmit={searchProducts}>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for products..."
        className="flex-grow px-4 py-2 bg-white/10 border border-gray-600 text-white placeholder-gray-400 rounded-l-full focus:outline-none focus:border-yellow-500 transition-all duration-200 max-sm:w-full"
        style={{ maxWidth: '70%' }} // Keep the width constraint
      />
      <button
        type="submit"
        className="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-r-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
