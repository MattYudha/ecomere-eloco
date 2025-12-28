/**
 * Image optimization utilities
 */

/**
 * Common image sizes used in the application
 */
export const IMAGE_SIZES = {
    THUMBNAIL: 80,
    PRODUCT_CARD: 300,
    FULL_WIDTH: 1024,
};

/**
 * Generate a blur data URL for image placeholders
 * (This is a simplified version; in production you might use a real micro-generated placeholder)
 */
export const BLUR_DATA_URL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==';

/**
 * Get optimized sizes attribute based on usage
 */
export const getSizes = (width: number) => {
    return `(max-width: 768px) 100vw, ${width}px`;
};

/**
 * Handle image load error
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Fallback to a placeholder image if load fails
    target.src = '/images/placeholder.png'; // Ensure this file exists or use a data URI
    target.onerror = null; // Prevent infinite loop
};
