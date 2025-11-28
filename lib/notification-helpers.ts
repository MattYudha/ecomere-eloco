import { PrismaClient } from '@prisma/client';
import { sendMail } from '../utils/mail'; // Assuming mail.ts is in the same utils folder
import fs from 'fs/promises';
import path from 'path';
import { formatPrice } from '@/lib/utils';
import { NotificationType, NotificationPriority } from '@/types/notification';

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
export const createOrderUpdateNotification = async (
  userId: string,
  orderStatus: string,
  orderId: string,
  totalAmount: number | null = null,
) => {
  try {
    const statusMessages: Record<string, { title: string; message: string; priority: NotificationPriority }> = {
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
          const emailTemplatePath = path.join(
            __dirname,
            '..',
            'templates',
            'orderDelivered.html',
          );
          let htmlContent = await fs.readFile(emailTemplatePath, 'utf-8');

          htmlContent = htmlContent
            .replace('{{userName}}', user.name || 'Valued Customer')
            .replace('{{orderId}}', orderId)
            .replace(
              '{{totalAmount}}',
              totalAmount ? formatPrice(totalAmount) : 'N/A',
            )
            .replace(
              '{{shopUrl}}',
              process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            )
            .replace('{{currentYear}}', new Date().getFullYear());

          await sendMail({
            to: user.email,
            subject: `Your Order #${orderId} Has Been Delivered!`,
            html: htmlContent,
          });
          console.log(`📧 Delivered email notification sent to ${user.email}`);
        }
      } catch (emailError) {
        console.error('❌ Failed to send "delivered" email:', emailError);
        // Do not block the response for email errors
      }
    }

    console.log(
      `✅ Notification created for user ${userId}: ${statusInfo.title}`,
    );
    return notification;
  } catch (error) {
    console.error('❌ Error creating order notification:', error);
    throw error;
  }
};

/**
 * Create a payment status notification
 */
export const createPaymentNotification = async (
  userId: string,
  paymentStatus: string,
  amount: number,
  orderId: string,
) => {
  try {
    const statusMessages: Record<string, { title: string; message: string; priority: NotificationPriority }> = {
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
export const createPromotionNotification = async (
  userId: string,
  title: string,
  message: string,
  promoCode: string | null = null,
  discount: number | null = null,
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
export const createSystemAlertNotification = async (
  userId: string,
  title: string,
  message: string,
  priority: NotificationPriority = 'HIGH',
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
export const createBulkNotifications = async (
  userIds: string[],
  title: string,
  message: string,
  type: NotificationType = 'SYSTEM_ALERT',
  priority: NotificationPriority = 'NORMAL',
  metadata: object = {},
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
