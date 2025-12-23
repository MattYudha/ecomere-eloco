import { useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotificationStore } from '@/app/_zustand/notificationStore';
import notificationApi from '@/lib/notification-api';
import { NotificationFilters } from '@/types/notification';
import toast from 'react-hot-toast';
import { useSocket } from './useSocket';

/**
 * Custom hook for managing notifications
 */
export const useNotifications = () => {
  const { data: session } = useAuth();
  const {
    notifications,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    selectedIds,
    setNotifications,
    setLoading,
    setError,
    setFilters,
    markAsRead,
    deleteNotification,
    clearSelection,
    setUnreadCount,
    addNotification,
  } = useNotificationStore();

  // Get current user ID
  const getCurrentUserId = useCallback(async () => {
    if (!session?.user?.email) return null;

    try {
      const response = await fetch(
        `/api/users/email/${session.user.email}`,
      );
      const userData = await response.json();
      return userData?.id || null;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  }, [session?.user?.email]);





  // Fetch notifications
  const fetchNotifications = useCallback(
    async (customFilters?: NotificationFilters) => {
      const userId = await getCurrentUserId();
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const filtersToUse = customFilters || filters;
        const response = await notificationApi.getUserNotifications(
          userId,
          filtersToUse,
        );
        setNotifications(response);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch notifications';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [filters, getCurrentUserId, setNotifications, setLoading, setError],
  );

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    try {
      const { unreadCount } = await notificationApi.getUnreadCount(userId);
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [getCurrentUserId, setUnreadCount]);

  // Socket Integration
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (newNotification) => {
      // Optimistic Update
      addNotification(newNotification);
      toast.success(newNotification.title);

      // Sync unread count
      fetchUnreadCount();
    });

    return () => {
      socket.off('notification');
    };
  }, [socket, addNotification, fetchUnreadCount]);

  // Mark single notification as read
  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationApi.updateNotification(notificationId, true);
        markAsRead(notificationId);
        toast.success('Notification marked as read');
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to mark notification as read';
        toast.error(errorMessage);
      }
    },
    [markAsRead],
  );

  // Mark multiple notifications as read
  const markSelectedAsRead = useCallback(async () => {
    const userId = await getCurrentUserId();
    const idsToMarkRead = [...selectedIds]; // Create snapshot

    if (!userId || idsToMarkRead.length === 0) return;

    try {
      await notificationApi.bulkMarkAsRead({
        notificationIds: idsToMarkRead,
        userId,
      });

      idsToMarkRead.forEach((id) => markAsRead(id));
      clearSelection();

      // Refresh unread count
      await fetchUnreadCount();

      toast.success(`${idsToMarkRead.length} notifications marked as read`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to mark notifications as read';
      toast.error(errorMessage);
    }
  }, [
    selectedIds,
    getCurrentUserId,
    markAsRead,
    clearSelection,
    fetchUnreadCount,
  ]);

  // Mark all notifications as read
  const markAllUserNotificationsAsRead = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;

    try {
      await notificationApi.markAllAsRead(userId);
      // After marking all as read, refresh the unread count and clear local notifications
      setNotifications({
        notifications: [],
        unreadCount: 0,
        total: 0,
        page: 1,
        totalPages: 1,
      }); // Clear local state
      await fetchUnreadCount(); // Ensure unread count is 0
      toast.success('All notifications marked as read');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to mark all notifications as read';
      toast.error(errorMessage);
    }
  }, [getCurrentUserId, fetchUnreadCount, setNotifications]);

  // Delete single notification
  const deleteNotificationById = useCallback(
    async (notificationId: string) => {
      const userId = await getCurrentUserId();
      if (!userId) return;

      try {
        await notificationApi.deleteNotification(notificationId, userId);
        deleteNotification(notificationId);
        await fetchUnreadCount(); // Sync badge
        toast.success('Notification deleted');
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete notification';
        toast.error(errorMessage);
      }
    },
    [getCurrentUserId, deleteNotification],
  );

  // Delete selected notifications
  const deleteSelectedNotifications = useCallback(async () => {
    const userId = await getCurrentUserId();
    const idsToDelete = [...selectedIds]; // Create snapshot

    if (!userId || idsToDelete.length === 0) {
      return;
    }

    try {
      await notificationApi.bulkDeleteNotifications({
        notificationIds: idsToDelete,
        userId,
      });

      // Update local state - remove deleted notifications
      idsToDelete.forEach((id) => deleteNotification(id));
      clearSelection();

      // Sync badge
      await fetchUnreadCount();

      // Refresh data to ensure consistency
      await fetchNotifications();

      toast.success(`${idsToDelete.length} notifications deleted`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete notifications';
      toast.error(errorMessage);
    }
  }, [
    selectedIds,
    getCurrentUserId,
    deleteNotification,
    clearSelection,
    fetchNotifications,
  ]);

  // Update filters and refetch
  const updateFilters = useCallback(
    (newFilters: Partial<NotificationFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      fetchNotifications(updatedFilters);
    },
    [filters, setFilters, fetchNotifications],
  );

  // Load more notifications (pagination)
  const loadMore = useCallback(() => {
    if (page < totalPages) {
      updateFilters({ page: page + 1 });
    }
  }, [page, totalPages, updateFilters]);

  return {
    // Data
    notifications,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    selectedIds,
    hasMore: page < totalPages,

    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markSelectedAsRead,
    markAllUserNotificationsAsRead, // Export the new function
    deleteNotificationById,
    deleteSelectedNotifications,
    updateFilters,
    loadMore,

    // Store actions (direct access)
    setFilters,
    clearSelection,
  };
};

/**
 * Hook for real-time unread count (for header badge)
 */
export const useUnreadCount = () => {
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const { data: session, status } = useAuth(); // Get status to ensure we are truly authenticated

  const fetchUnreadCount = useCallback(async () => {
    // strict check: must be authenticated and have email
    if (status !== 'authenticated' || !session?.user?.email) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      // Use relative path to avoid CORS/Env issues if on same origin
      // console.log('[useUnreadCount] Fetching user ID for email:', session.user.email);

      const userResponse = await fetch(
        `/api/users/email/${session.user.email}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!userResponse.ok) {
        // If 502/503/504 (Gateway/Proxy errors) or 404, stop noisy logging
        if (userResponse.status === 502 || userResponse.status === 503 || userResponse.status === 504) {
          console.warn(`[useUnreadCount] Backend unavailable (${userResponse.status}). Retrying later.`);
          return;
        }

        // Only log actual errors
        if (userResponse.status !== 404) {
          console.error('[useUnreadCount] Failed to fetch user ID', userResponse.status);
        }
        return;
      }

      const userData = await userResponse.json();

      if (userData?.id) {
        const response = await notificationApi.getUnreadCount(userData.id);
        // Backend returns { count: number }, support both just in case
        const count = response.count ?? response.unreadCount ?? 0;
        setUnreadCount(count);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Ignore aborts
        return;
      }
      // console.error('Error fetching unread count:', error);
    } finally {
      clearTimeout(timeoutId);
    }
  }, [session?.user?.email, status, setUnreadCount]); // Dependency on status is key

  const socket = useSocket();

  useEffect(() => {
    if (!socket || status !== 'authenticated') return;

    // Only listen if we are authenticated
    const handleNotification = () => {
      fetchUnreadCount();
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    }
  }, [socket, fetchUnreadCount, status]);

  // Auto-refresh unread count every 30 seconds
  useEffect(() => {
    if (status !== 'authenticated') return;

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Relax to 10s to reduce load

    const handleOrderCompleted = () => {
      console.log('Order completed - refreshing notifications');
      setTimeout(fetchUnreadCount, 1000);
    };

    window.addEventListener('orderCompleted', handleOrderCompleted);

    return () => {
      clearInterval(interval);
      window.removeEventListener('orderCompleted', handleOrderCompleted);
    };
  }, [fetchUnreadCount, status]);

  return {
    unreadCount,
    refreshUnreadCount: fetchUnreadCount,
  };
};