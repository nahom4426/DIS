import { useNotificationStore } from '@/stores/notificationStore';
import  icons from '@/utils/icons';

export function useNotifications() {
  const notificationStore = useNotificationStore();

  const showSuccess = (title, message, actionUrl = null) => {
    notificationStore.addNotification({
      title,
      message,
      type: 'success',
      icon: icons.check_circle,
      actionUrl,
      actionText: actionUrl ? 'View Details' : null
    });
  };

  const showError = (title, message) => {
    notificationStore.addNotification({
      title,
      message,
      type: 'error',
      icon: icons.x_circle,
      actionUrl,
      actionText: actionUrl ? 'View Details' : null
    });
  };

  const showInfo = (title, message, actionUrl = null) => {
    notificationStore.addNotification({
      title,
      message,
      type: 'info',
      icon: icons.info_circle,
      actionUrl,
      actionText: actionUrl ? 'View Details' : null
    });
  };

  const showWarning = (title, message) => {
    notificationStore.addNotification({
      title,
      message,
      type: 'warning',
      icon: icons.exclamation_triangle
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
}
