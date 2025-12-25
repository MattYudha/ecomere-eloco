import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActiveFilter {
    id: string;
    label: string;
    value: string | number;
    type: 'price' | 'rating' | 'category' | 'stock';
}

interface ActiveFiltersProps {
    filters: ActiveFilter[];
    onRemoveFilter: (filterId: string) => void;
    onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    filters,
    onRemoveFilter,
    onClearAll,
}) => {
    if (filters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 py-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Filters:
            </span>

            <AnimatePresence mode="popLayout">
                {filters.map((filter) => (
                    <motion.div
                        key={filter.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-grilli-gold/10 to-orange-100/50 dark:from-grilli-gold/20 dark:to-orange-900/30 border border-grilli-gold/30 dark:border-grilli-gold/40 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm">
                            <span>{filter.label}</span>
                            <button
                                onClick={() => onRemoveFilter(filter.id)}
                                className="hover:bg-grilli-gold/20 dark:hover:bg-grilli-gold/30 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${filter.label} filter`}
                            >
                                <X size={14} className="text-grilli-gold" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {filters.length > 1 && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={onClearAll}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline underline-offset-2 transition-colors"
                >
                    Clear All ({filters.length})
                </motion.button>
            )}
        </div>
    );
};

export default ActiveFilters;
