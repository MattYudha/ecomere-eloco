// *********************
// Utility functions for search feature
// File: lib/searchUtils.ts
// Purpose: Sanitization, escaping, and validation for search
// *********************

/**
 * Escape RegExp special characters to prevent crashes
 * @param str - String to escape
 * @returns Escaped string safe for RegExp
 */
export const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Sanitize search query
 * @param query - Raw search query
 * @returns Sanitized query
 */
export const sanitizeQuery = (query: string): string => {
    return query
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
        .slice(0, 50); // Max 50 characters
};

/**
 * Validate search query
 * @param query - Search query to validate
 * @returns True if valid
 */
export const isValidQuery = (query: string): boolean => {
    const sanitized = query.trim();
    return sanitized.length >= 2 && sanitized.length <= 50;
};

/**
 * Save search to history (localStorage)
 * @param query - Search query to save
 */
export const saveSearchHistory = (query: string): void => {
    if (typeof window === 'undefined') return;

    try {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const updated = [query, ...history.filter((q: string) => q !== query)].slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to save search history:', error);
    }
};

/**
 * Get search history from localStorage
 * @returns Array of recent searches
 */
export const getSearchHistory = (): string[] => {
    if (typeof window === 'undefined') return [];

    try {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch (error) {
        console.error('Failed to get search history:', error);
        return [];
    }
};

/**
 * Clear search history
 */
export const clearSearchHistory = (): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem('searchHistory');
    } catch (error) {
        console.error('Failed to clear search history:', error);
    }
};
