"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBulkNotifications = exports.createSystemAlertNotification = exports.createPromotionNotification = exports.createPaymentNotification = exports.createOrderUpdateNotification = void 0;
const client_1 = require("@prisma/client");
const mail_1 = require("../utils/mail"); // Assuming mail.ts is in the same utils folder
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("@/lib/utils");
const prisma = new client_1.PrismaClient();
/**
 * Generate ID using nanoid with dynamic import
 */
const generateId = async () => {
    try {
        const { nanoid } = await Promise.resolve().then(() => __importStar(require('nanoid')));
        return nanoid();
    }
    catch (error) {
        console.error('Error generating nanoid:', error);
        // Fallback ID generation
        return Math.random().toString(36).substr(2, 10);
    }
};
/**
 * Create an order update notification
 */
const createOrderUpdateNotification = async (userId, orderStatus, orderId, totalAmount = null) => {
    try {
        const statusMessages = {
            pending: {
                title: 'Order Received',
                message: `Thank you! Your order #${orderId} has been received and is being processed.`,
                priority: 'NORMAL',
            },
            confirmed: {
                title: 'Order Confirmed',
                message: `Pesanan Anda dengan nomor #${orderId} telah berhasil dikonfirmasi. Kami akan segera menghubungi Anda untuk proses selanjutnya dan mempersiapkan pengiriman.`,
                priority: 'HIGH',
            },
            processing: {
                title: 'Order Processing',
                message: `Your order #${orderId} is currently being processed and will ship soon.`,
                priority: 'NORMAL',
            },
            shipped: {
                title: 'Order Shipped',
                message: `Excellent! Your order #${orderId} has been shipped and is on its way to you.`,
                priority: 'HIGH',
            },
            delivered: {
                title: 'Order Delivered',
                message: `Your order #${orderId} has been successfully delivered. We hope you love your new items!`,
                priority: 'HIGH',
            },
            cancelled: {
                title: 'Order Cancelled',
                message: `Your order #${orderId} has been cancelled. If you have any questions, please contact our support.`,
                priority: 'URGENT',
            },
        };
        const statusInfo = statusMessages[orderStatus.toLowerCase()] || {
            title: 'Order Update',
            message: `Your order #${orderId} status has been updated to: ${orderStatus}`,
            priority: 'NORMAL',
        };
        const notificationId = await generateId();
        const notification = await prisma.notification.create({
            data: {
                id: notificationId,
                userId: userId,
                title: statusInfo.title,
                message: statusInfo.message,
                type: 'ORDER_UPDATE',
                priority: statusInfo.priority,
                isRead: false,
                metadata: {
                    orderId: orderId,
                    status: orderStatus,
                    ...(totalAmount && { totalAmount: totalAmount }),
                },
            },
        });
        // If order is delivered, send a professional email
        if (orderStatus.toLowerCase() === 'delivered') {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                });
                if (user && user.email) {
                    const emailTemplatePath = path_1.default.join(__dirname, '..', 'templates', 'orderDelivered.html');
                    let htmlContent = await promises_1.default.readFile(emailTemplatePath, 'utf-8');
                    htmlContent = htmlContent
                        .replace('{{userName}}', user.name || 'Valued Customer')
                        .replace('{{orderId}}', orderId)
                        .replace('{{totalAmount}}', totalAmount ? (0, utils_1.formatPrice)(totalAmount) : 'N/A')
                        .replace('{{shopUrl}}', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
                        .replace('{{currentYear}}', new Date().getFullYear());
                    await (0, mail_1.sendMail)({
                        to: user.email,
                        subject: `Your Order #${orderId} Has Been Delivered!`,
                        html: htmlContent,
                    });
                    console.log(`📧 Delivered email notification sent to ${user.email}`);
                }
            }
            catch (emailError) {
                console.error('❌ Failed to send "delivered" email:', emailError);
                // Do not block the response for email errors
            }
        }
        console.log(`✅ Notification created for user ${userId}: ${statusInfo.title}`);
        return notification;
    }
    catch (error) {
        console.error('❌ Error creating order notification:', error);
        throw error;
    }
};
exports.createOrderUpdateNotification = createOrderUpdateNotification;
/**
 * Create a payment status notification
 */
const createPaymentNotification = async (userId, paymentStatus, amount, orderId) => {
    try {
        const statusMessages = {
            success: {
                title: 'Payment Successful',
                message: `Your payment of ${(0, utils_1.formatPrice)(amount)} has been successfully processed for order #${orderId}.`,
                priority: 'HIGH',
            },
            failed: {
                title: 'Payment Failed',
                message: `Unfortunately, your payment of ${(0, utils_1.formatPrice)(amount)} for order #${orderId} could not be processed. Please try again.`,
                priority: 'URGENT',
            },
            pending: {
                title: 'Payment Pending',
                message: `Your payment of ${(0, utils_1.formatPrice)(amount)} for order #${orderId} is currently being processed.`,
                priority: 'NORMAL',
            },
        };
        const statusInfo = statusMessages[paymentStatus.toLowerCase()] || {
            title: 'Payment Update',
            message: `Your payment status for order #${orderId} has been updated.`,
            priority: 'NORMAL',
        };
        const notificationId = await generateId();
        const notification = await prisma.notification.create({
            data: {
                id: notificationId,
                userId: userId,
                title: statusInfo.title,
                message: statusInfo.message,
                type: 'PAYMENT_STATUS',
                priority: statusInfo.priority,
                isRead: false,
                metadata: {
                    orderId: orderId,
                    paymentStatus: paymentStatus,
                    amount: amount,
                },
            },
        });
        console.log(`✅ Payment notification created for user ${userId}: ${statusInfo.title}`);
        return notification;
    }
    catch (error) {
        console.error('❌ Error creating payment notification:', error);
        throw error;
    }
};
exports.createPaymentNotification = createPaymentNotification;
/**
 * Create a promotional notification
 */
const createPromotionNotification = async (userId, title, message, promoCode = null, discount = null) => {
    try {
        const notificationId = await generateId();
        const notification = await prisma.notification.create({
            data: {
                id: notificationId,
                userId: userId,
                title: title,
                message: message,
                type: 'PROMOTION',
                priority: 'NORMAL',
                isRead: false,
                metadata: {
                    ...(promoCode && { promoCode: promoCode }),
                    ...(discount && { discount: discount }),
                },
            },
        });
        console.log(`✅ Promotion notification created for user ${userId}: ${title}`);
        return notification;
    }
    catch (error) {
        console.error('❌ Error creating promotion notification:', error);
        throw error;
    }
};
exports.createPromotionNotification = createPromotionNotification;
/**
 * Create a system alert notification
 */
const createSystemAlertNotification = async (userId, title, message, priority = 'HIGH') => {
    try {
        const notificationId = await generateId();
        const notification = await prisma.notification.create({
            data: {
                id: notificationId,
                userId: userId,
                title: title,
                message: message,
                type: 'SYSTEM_ALERT',
                priority: priority,
                isRead: false,
                metadata: {
                    alertType: 'system',
                },
            },
        });
        console.log(`✅ System alert notification created for user ${userId}: ${title}`);
        return notification;
    }
    catch (error) {
        console.error('❌ Error creating system alert notification:', error);
        throw error;
    }
};
exports.createSystemAlertNotification = createSystemAlertNotification;
/**
 * Bulk create notifications for multiple users
 */
const createBulkNotifications = async (userIds, title, message, type = 'SYSTEM_ALERT', priority = 'NORMAL', metadata = {}) => {
    try {
        // Generate all IDs first
        const notificationData = await Promise.all(userIds.map(async (userId) => {
            const notificationId = await generateId();
            return {
                id: notificationId,
                userId: userId,
                title: title,
                message: message,
                type: type,
                priority: priority,
                isRead: false,
                metadata: metadata,
            };
        }));
        await prisma.notification.createMany({
            data: notificationData,
        });
        console.log(`✅ Bulk notifications created for ${userIds.length} users: ${title}`);
        return notificationData.length;
    }
    catch (error) {
        console.error('❌ Error creating bulk notifications:', error);
        throw error;
    }
};
exports.createBulkNotifications = createBulkNotifications;
