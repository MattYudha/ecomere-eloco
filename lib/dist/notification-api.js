"use strict";
exports.__esModule = true;
exports.notificationApi = void 0;
var api_1 = require("@/lib/api");
var NotificationAPI = /** @class */ (function () {
    function NotificationAPI(apiClient) {
        this.apiClient = apiClient;
    }
    NotificationAPI.prototype.getNotifications = function (userId) {
        return this.apiClient.get("/api/notifications/" + userId);
    };
    NotificationAPI.prototype.getUserNotifications = function (userId, filters) {
        return this.apiClient.get("/api/notifications/" + userId, {
            params: filters || {}
        });
    };
    NotificationAPI.prototype.createNotification = function (notification) {
        return this.apiClient.post('/api/notifications', notification);
    };
    NotificationAPI.prototype.updateNotification = function (notificationId, isRead) {
        return this.apiClient.put("/api/notifications/" + notificationId, {
            isRead: isRead
        });
    };
    NotificationAPI.prototype.getUnreadCount = function (userId) {
        return this.apiClient.get("/api/notifications/" + userId + "/unread-count");
    };
    NotificationAPI.prototype.bulkMarkAsRead = function (payload) {
        return this.apiClient.put('/api/notifications/bulk/mark-as-read', payload);
    };
    NotificationAPI.prototype.markAllAsRead = function (userId) {
        return this.apiClient.put("/api/notifications/" + userId + "/mark-all-read");
    };
    NotificationAPI.prototype.deleteNotification = function (notificationId, userId) {
        return this.apiClient["delete"]("/api/notifications/" + notificationId, {
            params: { userId: userId }
        });
    };
    NotificationAPI.prototype.bulkDeleteNotifications = function (payload) {
        return this.apiClient.post('/api/notifications/bulk/delete', payload);
    };
    return NotificationAPI;
}());
// WAJIB ADA DUA EXPORT INI!!
exports.notificationApi = new NotificationAPI(api_1["default"]);
exports["default"] = exports.notificationApi;
