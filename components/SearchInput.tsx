'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { sanitize } from '@/lib/sanitize';
import { isValidQuery, saveSearchHistory } from '@/lib/searchUtils';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightText from './HighlightText';

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface Suggestion {
  id: string;
  slug: string;
  title: string;
}

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Debounced autocomplete fetch
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query: string) => {
        // ✅ Guard: Don't hit API if < 2 chars
        if (!isValidQuery(query)) {
          setSuggestions([]);
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          const res = await fetch(
            `/api/search/autocomplete?q=${encodeURIComponent(query)}&limit=5`
          );
          const data = await res.json();
          setSuggestions(Array.isArray(data) ? data : []);
          setShowDropdown(true);
        } catch (error) {
          console.error('Autocomplete error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    if (searchInput.trim().length >= 2) {
      fetchSuggestions(searchInput);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchInput, fetchSuggestions]);

  // ✅ Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
    setSearchInput('');
  }, [pathname, searchParams]);

  // ✅ Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          searchProducts(e as any);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const searchProducts = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim() || searchInput.trim().length < 2) return;

    const sanitizedSearch = sanitize(searchInput);

    // ✅ Save to history
    saveSearchHistory(sanitizedSearch);

    router.push(`/search?search=${encodeURIComponent(sanitizedSearch)}`);
    setSearchInput('');
    setShowDropdown(false);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // ✅ Save to history
    saveSearchHistory(suggestion.title);

    router.push(`/product/${suggestion.slug}`);
    setSearchInput('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Form */}
      <form
        onSubmit={searchProducts}
        className="relative outline-none border-none ring-0 bg-transparent"
      >
        {/* Container: Liquid Glass */}
        <motion.div
          className={`
            relative flex items-center w-full rounded-full 
            backdrop-blur-xl border transition-all duration-500 ease-out
            ${isFocused
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
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (searchInput.trim().length >= 2) {
                setShowDropdown(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              // Delay to allow click on suggestions
              setTimeout(() => setShowDropdown(false), 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari snack favoritmu..."
            className="w-full flex-grow bg-transparent py-3 pl-6 pr-20
                       text-gray-800 dark:text-white 
                       placeholder-gray-500/80 dark:placeholder-gray-400/80 
                       focus:outline-none focus:ring-0 border-none outline-none
                       text-sm md:text-base font-medium tracking-wide"
          />

          {/* Clear Button */}
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}

          {/* Search Button */}
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`
                flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full 
                text-white shadow-md transition-all duration-300
                bg-gradient-to-br from-[#e87c28] to-[#cb6112]
                disabled:opacity-50
              `}
              whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(203,97,18, 0.6)' }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/30 pointer-events-none" />
              <Search size={18} strokeWidth={2.5} className="drop-shadow-sm relative z-10" />
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showDropdown && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 max-h-[60vh] overflow-y-auto backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-2xl border border-white/30 dark:border-white/20 shadow-2xl z-50"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin h-5 w-5 border-2 border-[#cb6112] border-t-transparent rounded-full mx-auto" />
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                    p-4 cursor-pointer transition-colors min-h-[48px] flex items-center
                    ${selectedIndex === index ? 'bg-white/50 dark:bg-white/10' : 'hover:bg-white/30 dark:hover:bg-white/5'}
                    ${index === 0 ? 'rounded-t-2xl' : ''}
                    ${index === suggestions.length - 1 ? 'rounded-b-2xl' : 'border-b border-gray-200/30 dark:border-white/10'}
                  `}
                >
                  <Search size={16} className="mr-3 text-gray-400 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-900 dark:text-white">
                    <HighlightText text={suggestion.title} query={searchInput} />
                  </span>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;
