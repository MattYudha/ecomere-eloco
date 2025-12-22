import baseApiClient from '@/lib/api';
import { NotificationType, NotificationFilters } from '@/types/notification';

class NotificationAPI {
  private apiClient: any;

  constructor(apiClient: any) {
    this.apiClient = apiClient;
  }

  async getNotifications(userId: string) {
    const response = await this.apiClient.get(`/api/notifications/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  }

  async getUserNotifications(userId: string, filters?: NotificationFilters) {
    let url = `/api/notifications/${userId}`;
    if (filters) {
      // Remove undefined values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null)
      );
      const queryParams = new URLSearchParams(cleanFilters as any).toString();
      if (queryParams) {
        url += `?${queryParams}`;
      }
    }

    const response = await this.apiClient.get(url);
    if (!response.ok) throw new Error('Failed to fetch user notifications');
    return response.json();
  }

  async createNotification(notification: NotificationType) {
    const response = await this.apiClient.post('/api/notifications', notification);
    if (!response.ok) throw new Error('Failed to create notification');
    return response.json();
  }

  async updateNotification(notificationId: string, isRead: boolean) {
    const response = await this.apiClient.put(`/api/notifications/${notificationId}`, {
      isRead,
    });
    if (!response.ok) throw new Error('Failed to update notification');
    return response.json();
  }

  async getUnreadCount(userId: string) {
    const response = await this.apiClient.get(`/api/notifications/${userId}/unread-count`);
    if (!response.ok) throw new Error('Failed to get unread count');
    return response.json();
  }

  async bulkMarkAsRead(payload: { notificationIds: string[]; userId: string }) {
    const response = await this.apiClient.put('/api/notifications/bulk/mark-as-read', payload);
    if (!response.ok) throw new Error('Failed to bulk mark as read');
    return response.json();
  }

  async markAllAsRead(userId: string) {
    const response = await this.apiClient.put(`/api/notifications/${userId}/mark-all-read`);
    if (!response.ok) throw new Error('Failed to mark all as read');
    return response.json();
  }

  async deleteNotification(notificationId: string, userId?: string) {
    let url = `/api/notifications/${notificationId}`;
    if (userId) {
      url += `?userId=${userId}`;
    }
    const response = await this.apiClient.delete(url);
    if (!response.ok) throw new Error('Failed to delete notification');
    return response.json(); // Assuming delete endpoint returns the deleted item or success message
  }

  async bulkDeleteNotifications(payload: {
    notificationIds: string[];
    userId: string;
  }) {
    const response = await this.apiClient.delete('/api/notifications/bulk', {
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to bulk delete notifications');
    return response.json();
  }
}

// WAJIB ADA DUA EXPORT INI!!
const notificationApiInstance = new NotificationAPI(baseApiClient);
export default notificationApiInstance;