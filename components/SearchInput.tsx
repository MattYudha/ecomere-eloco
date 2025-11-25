'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { sanitize } from '@/lib/sanitize';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const sanitizedSearch = sanitize(searchInput);
    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput('');
  };

  return (
    // FIX: Menambahkan 'outline-none border-none ring-0' pada form untuk menghapus kotak persegi
    <form
      onSubmit={searchProducts}
      className="relative w-full max-w-md mx-auto outline-none border-none ring-0 bg-transparent"
    >
      {/* Container Utama: Liquid Glass */}
      <motion.div
        className={`
          relative flex items-center w-full rounded-full 
          backdrop-blur-xl border transition-all duration-500 ease-out
          ${
            isFocused
              ? 'bg-white/30 border-[#cb6112]/50 shadow-[0_0_25px_rgba(203,97,18,0.2)] ring-1 ring-[#cb6112]/30'
              : 'bg-white/10 border-gray-200/50 dark:border-white/10 shadow-lg hover:border-[#cb6112]/30 hover:bg-white/20'
          }
          dark:bg-slate-900/40
        `}
        initial={false}
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
      >
        {/* Input Field */}
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Cari snack favoritmu..."
          className="w-full flex-grow bg-transparent py-3 pl-6 pr-14 
                     text-gray-800 dark:text-white 
                     placeholder-gray-500/80 dark:placeholder-gray-400/80 
                     focus:outline-none focus:ring-0 border-none outline-none
                     text-sm md:text-base font-medium tracking-wide"
        />

        {/* Tombol Search: Liquid Orange Orb */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
          <motion.button
            type="submit"
            className={`
              flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full 
              text-white shadow-md transition-all duration-300
              bg-gradient-to-br from-[#e87c28] to-[#cb6112]
            `}
            whileHover={{
              scale: 1.1,
              boxShadow: '0 0 15px rgba(203,97,18, 0.6)',
            }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Kilauan (Glossy Reflection) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/30 pointer-events-none" />

            <Search
              size={18}
              strokeWidth={2.5}
              className="drop-shadow-sm relative z-10"
            />
          </motion.button>
        </div>
      </motion.div>
    </form>
  );
};

export default SearchInput;
