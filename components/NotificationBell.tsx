'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa6';
import { useUnreadCount, useNotifications } from '@/hooks/useNotifications'; // Import useNotifications
import { useAuth } from '@/hooks/useAuth';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
}) => {
  const { data: session } = useAuth();
  const { unreadCount, refreshUnreadCount } = useUnreadCount();
  const { markAllUserNotificationsAsRead } = useNotifications(); // Use the new hook
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't show notification bell if user is not logged in
  if (!session?.user) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#cb6112] hover:bg-orange-50 dark:hover:bg-slate-800 rounded-full transition-all duration-300 focus:outline-none"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <FaBell className="w-6 h-6" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-gray-100 dark:border-[#cb6112]/20 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none z-50 overflow-hidden ring-1 ring-black/5">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#cb6112]/10 text-[#cb6112]">
                  {unreadCount} New
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={async () => {
                  await markAllUserNotificationsAsRead();
                }}
                className="text-xs font-semibold text-gray-500 hover:text-[#cb6112] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Quick Actions (View All) - Moved to bottom usually but kept simple here */}

          {/* Notification Preview */}
          <div className="max-h-[20rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
            {unreadCount === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <FaBell className="w-5 h-5 text-gray-400 dark:text-slate-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm">No new notifications</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We&apos;ll notify you when something arrives.
                </p>
              </div>
            ) : (
              <div className="p-0">
                <div className="px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-white/5">
                  Recent
                </div>
                {/* 
                    Ideally we would map through recent notifications here. 
                    Since this component currently only tracks unreadCount and links to the full page, 
                    we'll encourage the user to click through. 
                    For a full improvement, we would need to fetch the top 5 notifications here.
                 */}
                <div className="p-5 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''} requiring your attention.
                  </p>
                  <Link
                    href="/notification"
                    onClick={() => setIsDropdownOpen(false)}
                    className="inline-flex w-full items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-[#cb6112] rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-0 border-t border-gray-100 dark:border-white/5">
            <Link
              href="/notification"
              onClick={() => setIsDropdownOpen(false)}
              className="block w-full py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#cb6112] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              View Notification History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
