import {
  PrismaClient,
  notification_type,
  notification_priority,
} from '@prisma/client';

import { sendMail } from '@/lib/utils/mail';
import fs from 'fs/promises';
import path from 'path';
import { formatPrice } from '@/lib/utils';

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
  const statusMessages: Record<
    string,
    { title: string; message: string; priority: notification_priority }
  > = {
    pending: {
      title: 'Order Received',
      message: `Thank you! Your order #${orderId} has been received and is being processed.`,
      priority: notification_priority.NORMAL,
    },
    confirmed: {
      title: 'Order Confirmed',
      message: `Pesanan Anda dengan nomor #${orderId} telah berhasil dikonfirmasi.`,
      priority: notification_priority.HIGH,
    },
    processing: {
      title: 'Order Processing',
      message: `Your order #${orderId} is currently being processed.`,
      priority: notification_priority.NORMAL,
    },
    shipped: {
      title: 'Order Shipped',
      message: `Your order #${orderId} has been shipped.`,
      priority: notification_priority.HIGH,
    },
    delivered: {
      title: 'Order Delivered',
      message: `Your order #${orderId} has been delivered.`,
      priority: notification_priority.HIGH,
    },
    cancelled: {
      title: 'Order Cancelled',
      message: `Your order #${orderId} has been cancelled.`,
      priority: notification_priority.URGENT,
    },
  };

  const statusInfo =
    statusMessages[orderStatus.toLowerCase()] || {
      title: 'Order Update',
      message: `Order #${orderId} status updated to ${orderStatus}`,
      priority: notification_priority.NORMAL,
    };

  const notificationId = await generateId();

  const notification = await prisma.notification.create({
    data: {
      id: notificationId,
      userId,
      title: statusInfo.title,
      message: statusInfo.message,
      type: notification_type.ORDER_UPDATE,
      priority: statusInfo.priority,
      isRead: false,
      metadata: {
        orderId,
        status: orderStatus,
        ...(totalAmount && { totalAmount }),
      },
      updatedAt: new Date(),
    },
  });

  // Email on delivered
  if (orderStatus.toLowerCase() === 'delivered') {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.email) {
      const emailTemplatePath = path.join(
        __dirname,
        '..',
        'templates',
        'orderDelivered.html',
      );

      let html = await fs.readFile(emailTemplatePath, 'utf-8');

      html = html
       .replace('{{userName}}', user.email || 'Customer')
        .replace('{{orderId}}', orderId)
        .replace(
          '{{totalAmount}}',
          totalAmount ? formatPrice(totalAmount) : 'N/A',
        )
        .replace(
          '{{shopUrl}}',
          process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        )
        .replace('{{currentYear}}', String(new Date().getFullYear()));

      await sendMail({
        to: user.email,
        subject: `Order #${orderId} Delivered`,
        html,
      });
    }
  }

  return notification;
};

/**
 * Payment notification
 */
export const createPaymentNotification = async (
  userId: string,
  paymentStatus: string,
  amount: number,
  orderId: string,
) => {
  const map: Record<
    string,
    { title: string; message: string; priority: notification_priority }
  > = {
    success: {
      title: 'Payment Successful',
      message: `Payment ${formatPrice(amount)} received.`,
      priority: notification_priority.HIGH,
    },
    failed: {
      title: 'Payment Failed',
      message: `Payment failed for order #${orderId}.`,
      priority: notification_priority.URGENT,
    },
    pending: {
      title: 'Payment Pending',
      message: `Payment pending for order #${orderId}.`,
      priority: notification_priority.NORMAL,
    },
  };

  const info =
    map[paymentStatus.toLowerCase()] || {
      title: 'Payment Update',
      message: `Payment status updated.`,
      priority: notification_priority.NORMAL,
    };

  return prisma.notification.create({
    data: {
      id: await generateId(),
      userId,
      title: info.title,
      message: info.message,
      type: notification_type.PAYMENT_STATUS,
      priority: info.priority,
      isRead: false,
      metadata: { orderId, paymentStatus, amount },
      updatedAt: new Date(),
    },
  });
};

/**
 * Promotion notification
 */
export const createPromotionNotification = async (
  userId: string,
  title: string,
  message: string,
  promoCode?: string,
  discount?: number,
) => {
  return prisma.notification.create({
    data: {
      id: await generateId(),
      userId,
      title,
      message,
      type: notification_type.PROMOTION,
      priority: notification_priority.NORMAL,
      isRead: false,
      metadata: {
        ...(promoCode && { promoCode }),
        ...(discount && { discount }),
      },
      updatedAt: new Date(),
    },
  });
};

/**
 * System alert
 */
export const createSystemAlertNotification = async (
  userId: string,
  title: string,
  message: string,
  priority: notification_priority = notification_priority.HIGH,
) => {
  return prisma.notification.create({
    data: {
      id: await generateId(),
      userId,
      title,
      message,
      type: notification_type.SYSTEM_ALERT,
      priority,
      isRead: false,
      metadata: { alertType: 'system' },
      updatedAt: new Date(),
    },
  });
};

/**
 * Bulk notifications
 */
export const createBulkNotifications = async (
  userIds: string[],
  title: string,
  message: string,
  type: notification_type = notification_type.SYSTEM_ALERT,
  priority: notification_priority = notification_priority.NORMAL,
  metadata: object = {},
) => {
  const data = await Promise.all(
    userIds.map(async (userId) => ({
      id: await generateId(),
      userId,
      title,
      message,
      type,
      priority,
      isRead: false,
      metadata,
      updatedAt: new Date(),
    })),
  );

  await prisma.notification.createMany({ data });
  return data.length;
};
