import ApiService from "@/service/ApiService";

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = '/api/notifications';

// Get notifications for a user
export async function getUserNotifications(userId, params = {}) {
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
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId) {
  try {
    const response = await api
      .addAuthenticationHeader()
      .put(`${path}/read/${notificationId}`);
    return response;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return { success: false, error: error.message };
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId) {
  try {
    const response = await api
      .addAuthenticationHeader()
      .put(`${path}/user/${userId}/read-all`);
    return response;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return { success: false, error: error.message };
  }
}

// Create a new notification
export async function createNotification({ userUuid, message, questionUuid }) {
  try {
    const response = await api
      .addAuthenticationHeader()
      .post(`${path}/notify`, {
        userUuid,
        message,
        questionUuid
      });
    return response;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return { success: false, error: error.message };
  }
}