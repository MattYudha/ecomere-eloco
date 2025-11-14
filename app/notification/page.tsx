'use client';

import React, { useEffect } from 'react';
import { SectionTitle } from '@/components';
import { useNotifications } from '@/hooks/useNotifications';
import { FaBell, FaSpinner } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const NotificationPage = () => {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    deleteNotificationById,
    unreadCount,
    fetchUnreadCount
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Refresh unread count when notifications change
  useEffect(() => {
    fetchUnreadCount();
  }, [notifications, fetchUnreadCount]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    fetchNotifications(); // Refresh list after marking as read
  };

  const handleDelete = async (id: string) => {
    await deleteNotificationById(id);
    fetchNotifications(); // Refresh list after deleting
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 relative overflow-hidden">
      <SectionTitle title="Notification Center" path="Home | Notifications" />
      <div className="relative z-10 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-semibold rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>

          {loading && (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400 flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" /> Loading notifications...
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
              Error: {error}
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="p-6 text-center text-gray-600 dark:text-gray-400">
              <FaBell className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-lg font-medium">No notifications yet!</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                We&apos;ll let you know when something new happens.
              </p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 flex items-start space-x-4 ${
                    !notification.isRead ? 'bg-indigo-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  } hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors duration-200`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <FaBell className={`w-5 h-5 ${!notification.isRead ? 'text-indigo-600' : 'text-gray-400 dark:text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
