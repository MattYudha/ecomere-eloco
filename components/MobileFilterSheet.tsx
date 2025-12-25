import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Check } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface MobileFilterSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FilterState {
    inStock: boolean;
    outOfStock: boolean;
    priceMax: number;
    rating: number;
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initialize from URL params
    const [filters, setFilters] = useState<FilterState>({
        inStock: searchParams.get('inStock') === 'true',
        outOfStock: searchParams.get('outOfStock') === 'true',
        priceMax: Number(searchParams.get('price')) || 500000,
        rating: Number(searchParams.get('rating')) || 0,
    });

    const [tempPrice, setTempPrice] = useState(String(filters.priceMax));

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Price filter
        if (filters.priceMax < 500000) {
            params.set('price', String(filters.priceMax));
        } else {
            params.delete('price');
        }

        // Rating filter
        if (filters.rating > 0) {
            params.set('rating', String(filters.rating));
        } else {
            params.delete('rating');
        }

        // Stock filters
        if (filters.inStock) {
            params.set('inStock', 'true');
        } else {
            params.delete('inStock');
        }

        if (filters.outOfStock) {
            params.set('outOfStock', 'true');
        } else {
            params.delete('outOfStock');
        }

        router.push(`${pathname}?${params.toString()}`);
        onClose();
    };

    const clearAllFilters = () => {
        setFilters({
            inStock: false,
            outOfStock: false,
            priceMax: 500000,
            rating: 0,
        });
        setTempPrice('500000');
        router.push(pathname);
        onClose();
    };

    const activeFiltersCount =
        (filters.priceMax < 500000 ? 1 : 0) +
        (filters.rating > 0 ? 1 : 0) +
        (filters.inStock ? 1 : 0) +
        (filters.outOfStock ? 1 : 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
                        onClick={onClose}
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-[101] max-h-[85vh] overflow-hidden flex flex-col md:hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-grilli-gold/5 to-orange-50 dark:from-grilli-gold/10 dark:to-orange-900/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-grilli-gold/20 rounded-lg">
                                    <Filter size={20} className="text-grilli-gold" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                                    {activeFiltersCount > 0 && (
                                        <p className="text-xs text-grilli-gold font-medium">
                                            {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Filter Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Availability Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Availability
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={filters.inStock}
                                            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                                            className="w-5 h-5 rounded-md border-2 border-gray-300 text-grilli-gold focus:ring-grilli-gold focus:ring-offset-0"
                                        />
                                        <span className="ml-3 text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-grilli-gold transition-colors">
                                            In Stock
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={filters.outOfStock}
                                            onChange={(e) => setFilters({ ...filters, outOfStock: e.target.checked })}
                                            className="w-5 h-5 rounded-md border-2 border-gray-300 text-grilli-gold focus:ring-grilli-gold focus:ring-offset-0"
                                        />
                                        <span className="ml-3 text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-grilli-gold transition-colors">
                                            Out of Stock
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>

                            {/* Price Range Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Price Range
                                    </h3>
                                    <span className="text-sm font-bold text-grilli-gold bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
                                        Rp 0 - {Number(filters.priceMax).toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={0}
                                    max={500000}
                                    step={10000}
                                    value={filters.priceMax}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setFilters({ ...filters, priceMax: val });
                                        setTempPrice(String(val));
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-grilli-gold"
                                />

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 font-medium">Max:</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
                                        <input
                                            type="number"
                                            value={tempPrice}
                                            onChange={(e) => setTempPrice(e.target.value)}
                                            onBlur={() => {
                                                const val = tempPrice === '' ? 0 : Number(tempPrice);
                                                setFilters({ ...filters, priceMax: val });
                                            }}
                                            className="w-full pl-10 pr-3 py-3 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:border-grilli-gold transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>

                            {/* Rating Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Min Rating
                                    </h3>
                                    <div className="flex items-center gap-1 text-grilli-gold">
                                        <span className="font-bold text-xl">{filters.rating}</span>
                                        <span className="text-sm font-semibold">+ ⭐</span>
                                    </div>
                                </div>

                                <input
                                    type="range"
                                    min={0}
                                    max={5}
                                    step={1}
                                    value={filters.rating}
                                    onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />

                                <div className="flex justify-between mt-2">
                                    {[0, 1, 2, 3, 4, 5].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFilters({ ...filters, rating: val })}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${filters.rating >= val
                                                    ? 'bg-grilli-gold text-white scale-110 shadow-lg'
                                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions - Sticky */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3">
                            <button
                                onClick={clearAllFilters}
                                className="w-full py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Clear All Filters
                            </button>
                            <button
                                onClick={applyFilters}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-grilli-gold to-orange-500 text-white font-bold shadow-lg shadow-grilli-gold/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={20} />
                                Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileFilterSheet;
