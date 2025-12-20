import React from 'react';
import {
  Notification,
  NotificationType,
  NotificationPriority,
} from '@/types/notification';
import { motion } from 'framer-motion';
import {
  FaBoxOpen,
  FaCreditCard,
  FaTag,
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaInfoCircle,
  FaCircle,
} from 'react-icons/fa';

// --- HELPERS ---

const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
};

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return <FaBoxOpen className="text-white text-lg" />;
    case NotificationType.PAYMENT_STATUS:
      return <FaCreditCard className="text-white text-lg" />;
    case NotificationType.PROMOTION:
      return <FaTag className="text-white text-lg" />;
    case NotificationType.SYSTEM_ALERT:
      return <FaExclamationTriangle className="text-white text-lg" />;
    default:
      return <FaInfoCircle className="text-white text-lg" />;
  }
};

const getTypeStyles = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return 'from-amber-500 to-orange-600 shadow-orange-500/30';
    case NotificationType.PAYMENT_STATUS:
      return 'from-emerald-500 to-green-600 shadow-emerald-500/30';
    case NotificationType.PROMOTION:
      return 'from-[#cb6112] to-orange-500 shadow-orange-500/30'; // Brand Color
    case NotificationType.SYSTEM_ALERT:
      return 'from-red-500 to-rose-600 shadow-red-500/30';
    default:
      return 'from-gray-500 to-gray-600 shadow-gray-500/30';
  }
};

interface NotificationCardProps {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onDelete,
}) => {
  const timeAgo = formatTimeAgo(notification.createdAt);

  // Extract Metadata securely
  const metadata = notification.metadata as any || {};
  const orderId = metadata.orderId || metadata.order_id; // Handle possible casing
  const amount = metadata.amount || metadata.totalAmount;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300
        ${notification.isRead
          ? 'bg-white border-gray-100 dark:bg-slate-800/50 dark:border-gray-700'
          : 'bg-white border-[#cb6112]/30 dark:bg-slate-800 dark:border-[#cb6112]/50 shadow-lg shadow-[#cb6112]/5'
        }
        ${isSelected ? 'ring-2 ring-[#cb6112] ring-offset-2 dark:ring-offset-slate-900' : ''}
      `}
    >
      {/* Unread Indicator Bar */}
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#cb6112]" />
      )}

      <div className="p-4 sm:p-5 flex gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(notification.id)}
            className="w-5 h-5 rounded border-gray-300 text-[#cb6112] focus:ring-[#cb6112]/50 cursor-pointer"
          />
        </div>

        {/* Icon Box */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ${getTypeStyles(notification.type)}`}
        >
          {getTypeIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`text-base font-bold pr-4 ${notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
              {notification.title}
            </h3>
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
              {timeAgo}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            {notification.message}
          </p>

          {/* Metadata Chips (Order ID, Amount, etc.) */}
          <div className="flex flex-wrap gap-2 mb-3">
            {orderId && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-600">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Order ID</span>
                <span className="text-xs font-mono font-medium text-gray-900 dark:text-gray-200 select-all">
                  #{typeof orderId === 'string' ? orderId.substring(0, 8).toUpperCase() : orderId}
                </span>
              </div>
            )}
            {amount && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-600">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(amount))}
                </span>
              </div>
            )}
          </div>

          {/* Detailed Customer Info (If available) */}
          {(metadata.name || metadata.address) && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-gray-600/50 text-xs text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {metadata.name && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Customer</span>
                  <span className="font-medium">{metadata.name} {metadata.lastname}</span>
                </div>
              )}
              {metadata.phone && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Phone</span>
                  <span className="font-medium">{metadata.phone}</span>
                </div>
              )}
              {(metadata.billingAddress || metadata.address) && (
                <div className="col-span-1 sm:col-span-2 flex flex-col mt-1">
                  <span className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Shipping Address</span>
                  <span className="font-medium leading-relaxed">
                    {metadata.address || metadata.billingAddress}
                    {metadata.apartment ? `, ${metadata.apartment}` : ''}
                    {metadata.city ? `, ${metadata.city}` : ''}
                    {metadata.postalCode ? `, ${metadata.postalCode}` : ''}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs font-medium text-[#cb6112] hover:text-orange-700 flex items-center gap-1 transition-colors"
              >
                <FaCheck size={10} /> Mark as Read
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="text-xs font-medium text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <FaTrash size={10} /> Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
