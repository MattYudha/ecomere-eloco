const { PrismaClient } = require('@prisma/client');
const { sendMail } = require('../utils/mail.js');
const fs = require('fs').promises;
const path = require('path');
const { formatPrice } = require('../utils/format.js');

const prisma = new PrismaClient();

// In-memory cache for tracking sent emails (simple idempotency)
// In production, consider using Redis or database table
const sentEmailCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Clean up old cache entries periodically
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of sentEmailCache.entries()) {
        if (now - timestamp > CACHE_TTL) {
            sentEmailCache.delete(key);
        }
    }
}, 60 * 60 * 1000); // Clean every hour

/**
 * Generate cache key for idempotency
 */
function getEmailCacheKey(orderId, status, userId) {
    return `${orderId}:${status}:${userId}`;
}

/**
 * Check if email was already sent (idempotency)
 */
function wasEmailSent(orderId, status, userId) {
    const key = getEmailCacheKey(orderId, status, userId);
    return sentEmailCache.has(key);
}

/**
 * Mark email as sent
 */
function markEmailAsSent(orderId, status, userId) {
    const key = getEmailCacheKey(orderId, status, userId);
    sentEmailCache.set(key, Date.now());
}

/**
 * Send order shipped email notification
 * Async fire-and-forget pattern - does not block caller
 * 
 * @param {string} userId - User ID
 * @param {object} orderData - Order details
 * @returns {Promise<void>}
 */
async function sendOrderShippedEmail(userId, orderData) {
    // Fire-and-forget: wrap in setImmediate to not block caller
    setImmediate(async () => {
        const startTime = Date.now();

        try {
            // Idempotency check
            if (wasEmailSent(orderData.id, 'shipped', userId)) {
                console.log('[EMAIL] email_skipped', {
                    reason: 'already_sent',
                    orderId: orderData.id,
                    userId,
                });
                return;
            }

            // Get user details
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user || !user.email) {
                console.log('[EMAIL] email_skipped', {
                    reason: 'user_not_found_or_no_email',
                    userId,
                });
                return;
            }

            // Load email template
            const templatePath = path.join(
                __dirname,
                '..',
                'templates',
                'orderShipped.html'
            );

            let htmlContent = await fs.readFile(templatePath, 'utf-8');

            // Prepare tracking URL
            let trackingUrl = '#';
            if (orderData.trackingNumber && orderData.courier) {
                // Generate tracking URL based on courier
                const courierUrls = {
                    jne: `https://www.jne.co.id/id/tracking/trace/${orderData.trackingNumber}`,
                    jnt: `https://www.jet.co.id/track/${orderData.trackingNumber}`,
                    sicepat: `https://www.sicepat.com/checkAwb/${orderData.trackingNumber}`,
                    anteraja: `https://www.anteraja.id/tracking/${orderData.trackingNumber}`,
                    pos: `https://www.posindonesia.co.id/id/tracking/${orderData.trackingNumber}`,
                };

                trackingUrl = courierUrls[orderData.courier?.toLowerCase()] || '#';
            }

            // Replace template variables
            htmlContent = htmlContent
                .replace(/{{userName}}/g, user.name || orderData.name || 'Valued Customer')
                .replace(/{{orderId}}/g, orderData.id)
                .replace(/{{totalAmount}}/g, formatPrice(orderData.total))
                .replace(/{{trackingNumber}}/g, orderData.trackingNumber || 'Akan segera diupdate')
                .replace(/{{courier}}/g, orderData.courier || 'Kurir')
                .replace(/{{courierService}}/g, orderData.courierService || 'Regular')
                .replace(/{{trackingUrl}}/g, trackingUrl)
                .replace(/{{customerName}}/g, orderData.name)
                .replace(/{{shippingAddress}}/g, `${orderData.adress}, ${orderData.city}, ${orderData.country} ${orderData.postalCode}`)
                .replace(/{{shopUrl}}/g, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
                .replace(/{{currentYear}}/g, new Date().getFullYear());

            // Send email with timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Email timeout')), 10000)
            );

            const sendPromise = sendMail({
                to: user.email,
                subject: `Pesanan #${orderData.id} Sudah Dikirim! 🚚`,
                html: htmlContent,
            });

            await Promise.race([sendPromise, timeoutPromise]);

            // Mark as sent (idempotency)
            markEmailAsSent(orderData.id, 'shipped', userId);

            const duration = Date.now() - startTime;
            console.log('[EMAIL] email_sent', {
                orderId: orderData.id,
                userId,
                userEmail: user.email,
                status: 'shipped',
                duration: `${duration}ms`,
            });
        } catch (error) {
            const duration = Date.now() - startTime;

            if (error.message === 'Email timeout') {
                console.error('[EMAIL] email_timeout', {
                    orderId: orderData.id,
                    userId,
                    duration: `${duration}ms`,
                });
            } else {
                console.error('[EMAIL] email_error', {
                    orderId: orderData.id,
                    userId,
                    error: error.message,
                    duration: `${duration}ms`,
                });
            }

            // Don't throw - fire-and-forget pattern
            // Email failure should not affect order processing
        }
    });
}

/**
 * Send order delivered email notification
 * (Keeping existing functionality)
 */
async function sendOrderDeliveredEmail(userId, orderData) {
    setImmediate(async () => {
        try {
            if (wasEmailSent(orderData.id, 'delivered', userId)) {
                console.log('[EMAIL] email_skipped', {
                    reason: 'already_sent',
                    orderId: orderData.id,
                    userId,
                });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user || !user.email) {
                console.log('[EMAIL] email_skipped', {
                    reason: 'user_not_found_or_no_email',
                    userId,
                });
                return;
            }

            const templatePath = path.join(
                __dirname,
                '..',
                'templates',
                'orderDelivered.html'
            );

            let htmlContent = await fs.readFile(templatePath, 'utf-8');

            htmlContent = htmlContent
                .replace(/{{userName}}/g, user.name || 'Valued Customer')
                .replace(/{{orderId}}/g, orderData.id)
                .replace(/{{totalAmount}}/g, formatPrice(orderData.total))
                .replace(/{{shopUrl}}/g, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
                .replace(/{{currentYear}}/g, new Date().getFullYear());

            await sendMail({
                to: user.email,
                subject: `Pesanan #${orderData.id} Telah Sampai! 📦`,
                html: htmlContent,
            });

            markEmailAsSent(orderData.id, 'delivered', userId);

            console.log('[EMAIL] email_sent', {
                orderId: orderData.id,
                userId,
                userEmail: user.email,
                status: 'delivered',
            });
        } catch (error) {
            console.error('[EMAIL] email_error', {
                orderId: orderData.id,
                userId,
                error: error.message,
            });
        }
    });
}

module.exports = {
    sendOrderShippedEmail,
    sendOrderDeliveredEmail,
};
