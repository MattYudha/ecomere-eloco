// *********************
// WhatsApp Utility Functions
// File: lib/whatsapp.ts
// Purpose: Generate WhatsApp links with context-aware messages
// *********************

/**
 * WhatsApp business number (without + and spaces)
 */
export const WHATSAPP_NUMBER = '6289514538998';

/**
 * Generate WhatsApp link with custom message
 * @param message - Pre-filled message
 * @returns WhatsApp web/app link
 */
export const getWhatsAppLink = (message: string = ''): string => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodedMessage}` : ''}`;
};

/**
 * Generate WhatsApp link for product inquiry
 * @param productName - Name of the product
 * @param productUrl - URL of the product page
 * @returns WhatsApp link with product inquiry message
 */
export const getProductWhatsAppLink = (productName: string, productUrl?: string): string => {
    const message = productUrl
        ? `Halo, saya mau tanya tentang produk *${productName}*\n\n${productUrl}`
        : `Halo, saya mau tanya tentang produk *${productName}*`;

    return getWhatsAppLink(message);
};

/**
 * Generate WhatsApp link for cart assistance
 * @param itemCount - Number of items in cart
 * @returns WhatsApp link with cart assistance message
 */
export const getCartWhatsAppLink = (itemCount: number = 0): string => {
    const message = itemCount > 0
        ? `Halo, saya butuh bantuan dengan pesanan saya (${itemCount} item di keranjang)`
        : `Halo, saya butuh bantuan dengan pesanan saya`;

    return getWhatsAppLink(message);
};

/**
 * Generate WhatsApp link for checkout assistance
 * @param orderTotal - Total order amount
 * @returns WhatsApp link with checkout assistance message
 */
export const getCheckoutWhatsAppLink = (orderTotal?: string): string => {
    const message = orderTotal
        ? `Halo, saya butuh bantuan untuk menyelesaikan checkout (Total: ${orderTotal})`
        : `Halo, saya butuh bantuan untuk menyelesaikan checkout`;

    return getWhatsAppLink(message);
};

/**
 * Generate WhatsApp link for general inquiry
 * @returns WhatsApp link with general inquiry message
 */
export const getGeneralWhatsAppLink = (): string => {
    return getWhatsAppLink('Halo, saya mau bertanya tentang produk Eloqo');
};

/**
 * Open WhatsApp in new tab/window
 * @param link - WhatsApp link
 */
export const openWhatsApp = (link: string): void => {
    window.open(link, '_blank', 'noopener,noreferrer');
};
