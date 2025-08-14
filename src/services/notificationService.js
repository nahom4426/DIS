import ApiService from "@/service/ApiService";

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = "/notifications";

export const notificationService = {
  // Get user notifications
  async getUserNotifications(userId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api
        .addAuthenticationHeader()
        .get(`${path}/user/${userId}?${queryString}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return { success: false, error: error.message };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api
        .addAuthenticationHeader()
        .put(`${path}/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return { success: false, error: error.message };
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      const response = await api
        .addAuthenticationHeader()
        .put(`${path}/user/${userId}/read-all`);
      return response;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return { success: false, error: error.message };
    }
  },

  // Create new notification
  async createNotification(notificationData) {
    try {
      const response = await api
        .addAuthenticationHeader()
        .post(path, notificationData);
      return response;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return { success: false, error: error.message };
    }
  }
};