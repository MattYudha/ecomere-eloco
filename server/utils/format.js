/**
 * Format price to IDR currency string
 * Matches the logic in lib/utils.ts
 * @param {number} price 
 * @returns {string} Formatted price (e.g. "Rp. 15.000")
 */
const formatPrice = (price) => {
    // Manual formatting to ensure "Rp. 15.000" format (with dot and space, no decimals)
    return 'Rp. ' + new Intl.NumberFormat('id-ID').format(price);
};

module.exports = {
    formatPrice,
};
