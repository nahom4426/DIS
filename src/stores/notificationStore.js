import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([
    { id: 1, message: 'New order received', read: false, timestamp: Date.now() },
    { id: 2, message: 'Low stock alert', read: false, timestamp: Date.now() - 3600000 }
  ])

  const hasUnreadNotifications = computed(() => 
    notifications.value.some(n => !n.read)
  )

  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
  }

  function addNotification(message) {
    notifications.value.unshift({
      id: Date.now(),
      message,
      read: false,
      timestamp: Date.now()
    })
  }

  return {
    notifications,
    hasUnreadNotifications,
    unreadCount,
    markAllAsRead,
    addNotification
  }
})

