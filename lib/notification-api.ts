import baseApiClient from '@/lib/api';
import { NotificationType, NotificationFilters } from '@/types/notification';

class NotificationAPI {
  private apiClient: any;

  constructor(apiClient: any) {
    this.apiClient = apiClient;
  }

  getNotifications(userId: string) {
    return this.apiClient.get(`/api/notifications/${userId}`);
  }

  getUserNotifications(userId: string, filters?: NotificationFilters) {
    return this.apiClient.get(`/api/notifications/${userId}`, {
      params: filters || {},
    });
  }

  createNotification(notification: NotificationType) {
    return this.apiClient.post('/api/notifications', notification);
  }

  updateNotification(notificationId: string, isRead: boolean) {
    return this.apiClient.put(`/api/notifications/${notificationId}`, {
      isRead,
    });
  }

  getUnreadCount(userId: string) {
    return this.apiClient.get(`/api/notifications/${userId}/unread-count`);
  }

  bulkMarkAsRead(payload: { notificationIds: string[]; userId: string }) {
    return this.apiClient.put('/api/notifications/bulk/mark-as-read', payload);
  }

  markAllAsRead(userId: string) {
    return this.apiClient.put(`/api/notifications/${userId}/mark-all-read`);
  }

  deleteNotification(notificationId: string, userId?: string) {
    return this.apiClient.delete(`/api/notifications/${notificationId}`, {
      params: { userId },
    });
  }

  bulkDeleteNotifications(payload: {
    notificationIds: string[];
    userId: string;
  }) {
    return this.apiClient.post('/api/notifications/bulk/delete', payload);
  }
}

// WAJIB ADA DUA EXPORT INI!!
export default new NotificationAPI(baseApiClient);
