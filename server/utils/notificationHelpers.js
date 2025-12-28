const { PrismaClient } = require('@prisma/client');
const { sendMail } = require('./mail.js');
const fs = require('fs').promises;
const path = require('path');
const { formatPrice } = require('./format.js');
const { logDebug } = require('../utils/debug');
const socketIo = require('./socket');

const prisma = new PrismaClient();

/**
 * Generate ID using nanoid with dynamic import
 */
const generateId = async () => {
  try {
    const { nanoid } = await import('nanoid');
    return nanoid();
  } catch (error) {
    console.error('Error generating nanoid:', error);
    // Fallback ID generation
    return Math.random().toString(36).substr(2, 10);
  }
};

/**
 * Create an order update notification
 */
const createOrderUpdateNotification = async (
  userId,
  orderStatus,
  orderId,
  totalAmount = null,
  extraMetadata = {},
) => {
  try {
    const statusMessages = {
      pending: {
        title: 'Pesanan Update: Pending ⏳',
        message: `Asyik, pesanan hari ini! Pesanan nomor #${orderId} kamu sudah masuk nih dan statusnya Pending. Tim kami akan segera cek, mohon ditunggu sebentar ya!`,
        priority: 'NORMAL',
      },
      confirmed: {
        title: 'Pesanan Dikonfirmasi ✅',
        message: `Pesanan nomor #${orderId} kamu sudah dikonfirmasi nih! Kami akan segera menghubungi kamu buat proses selanjutnya. Stay tuned ya!`,
        priority: 'HIGH',
      },
      processing: {
        title: 'Pesanan Update: Processing 🛠️',
        message: `Kabar baik! Pesanan nomor #${orderId} kamu lagi kami proses dengan teliti. Kami pastikan semuanya aman sebelum dikirim. Harap bersabar ya!`,
        priority: 'NORMAL',
      },
      shipped: {
        title: 'Pesanan Update: Shipped 🚚',
        message: `Yeay! Pesanan nomor #${orderId} sudah meluncur 🚀 dan dalam perjalanan ke alamatmu. Siap-siap terima paket kebahagiaan ya!`,
        priority: 'HIGH',
      },
      delivered: {
        title: 'Pesanan Selesai',
        message: `Hore! Pesanan Anda #${orderId} telah sampai. Jangan lupa beri ulasan ya!`,
        priority: 'HIGH',
      },
      cancelled: {
        title: 'Pesanan Update: Cancelled 🚫',
        message: `Yah, mohon maaf banget ya 🙏. Pesanan nomor #${orderId} kamu statusnya jadi Cancelled nih. Tapi jangan sedih, kamu bisa tanya admin kami kalau bingung. Yuk belanja lagi!`,
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
          ...extraMetadata,
        },
      },
    });

    // Emit Real-time Notification
    try {
      const io = socketIo.getIO();
      io.to(`user_${userId}`).emit('notification', notification);
      console.log('[NOTIFICATION] socket_emitted', {
        userId,
        notificationId: notification.id,
        type: 'ORDER_UPDATE',
        status: orderStatus,
      });
      logDebug(`📡 Socket event emitted to user_${userId}`);
    } catch (socketError) {
      console.error('[NOTIFICATION] socket_error', {
        userId,
        error: socketError.message,
      });
    }

    console.log('[NOTIFICATION] notification_created', {
      userId,
      notificationId: notification.id,
      type: 'ORDER_UPDATE',
      status: orderStatus,
      priority: statusInfo.priority,
      title: statusInfo.title,
    });

    logDebug(`✅ Notification created for user ${userId}: ${statusInfo.title}`, {
      notificationId: notification.id
    });

    return notification;
  } catch (error) {
    logDebug('❌ Error creating order notification helper', error);
    console.error('❌ Error creating order notification:', error);
    throw error;
  }
};

/**
 * Create a payment status notification
 */
const createPaymentNotification = async (
  userId,
  paymentStatus,
  amount,
  orderId,
) => {
  try {
    const statusMessages = {
      success: {
        title: 'Payment Successful',
        message: `Your payment of ${formatPrice(amount)} has been successfully processed for order #${orderId}.`,
        priority: 'HIGH',
      },
      failed: {
        title: 'Payment Failed',
        message: `Unfortunately, your payment of ${formatPrice(amount)} for order #${orderId} could not be processed. Please try again.`,
        priority: 'URGENT',
      },
      pending: {
        title: 'Payment Pending',
        message: `Your payment of ${formatPrice(amount)} for order #${orderId} is currently being processed.`,
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

    console.log(
      `✅ Payment notification created for user ${userId}: ${statusInfo.title}`,
    );
    return notification;
  } catch (error) {
    console.error('❌ Error creating payment notification:', error);
    throw error;
  }
};

/**
 * Create a promotional notification
 */
const createPromotionNotification = async (
  userId,
  title,
  message,
  promoCode = null,
  discount = null,
) => {
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

    console.log(
      `✅ Promotion notification created for user ${userId}: ${title}`,
    );
    return notification;
  } catch (error) {
    console.error('❌ Error creating promotion notification:', error);
    throw error;
  }
};

/**
 * Create a system alert notification
 */
const createSystemAlertNotification = async (
  userId,
  title,
  message,
  priority = 'HIGH',
) => {
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

    console.log(
      `✅ System alert notification created for user ${userId}: ${title}`,
    );
    return notification;
  } catch (error) {
    console.error('❌ Error creating system alert notification:', error);
    throw error;
  }
};

/**
 * Bulk create notifications for multiple users
 */
const createBulkNotifications = async (
  userIds,
  title,
  message,
  type = 'SYSTEM_ALERT',
  priority = 'NORMAL',
  metadata = {},
) => {
  try {
    // Generate all IDs first
    const notificationData = await Promise.all(
      userIds.map(async (userId) => {
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
      }),
    );

    await prisma.notification.createMany({
      data: notificationData,
    });

    console.log(
      `✅ Bulk notifications created for ${userIds.length} users: ${title}`,
    );
    return notificationData.length;
  } catch (error) {
    console.error('❌ Error creating bulk notifications:', error);
    throw error;
  }
};

module.exports = {
  createOrderUpdateNotification,
  createPaymentNotification,
  createPromotionNotification,
  createSystemAlertNotification,
  createBulkNotifications,
};
