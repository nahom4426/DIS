<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/themeStore";
import Dropdown from "@/components/Dropdown.vue";
import icons from "@/utils/icons";

const props = defineProps({
  breadcrumbs: {
    type: Object,
    required: true
  },
  onSidebarToggle: {
    type: Function,
    required: true
  },
  sidebarOpen: {
    type: Boolean,
    required: true
  }
});

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const showThemeSelector = ref(false);
const showNotifications = ref(false);
const notifications = ref([
  {
    id: 1,
    title: "Low Stock Alert",
    message: "Amoxicillin 500mg is running low on stock",
    time: "10 minutes ago",
    read: false,
    type: "warning"
  },
  {
    id: 2,
    title: "Expiry Alert",
    message: "5 drugs will expire within 30 days",
    time: "2 hours ago",
    read: false,
    type: "danger"
  },
  {
    id: 3,
    title: "New Order Received",
    message: "New purchase order #12345 has been created",
    time: "Yesterday",
    read: true,
    type: "info"
  }
]);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

const userInitials = computed(() => {
  const user = authStore.user;
  if (!user) return "U";
  
  const firstName = user.firstName || "";
  const lastName = user.lastName || user.fatherName || "";
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
});

const userFullName = computed(() => {
  const user = authStore.user;
  if (!user) return "User";
  
  return `${user.firstName || ""} ${user.lastName || user.fatherName || ""}`.trim();
});

const userRole = computed(() => {
  return authStore.user?.roleName || "User";
});

function markAllAsRead() {
  notifications.value = notifications.value.map(n => ({...n, read: true}));
}

function logout() {
  localStorage.removeItem("userDetail");
  router.push("/login");
}

function changeTheme(themeId) {
  themeStore.setTheme(themeId);
  showThemeSelector.value = false;
}
</script>

<template>
  <div class="px-4 h-full flex items-center justify-between">
    <!-- Left Section: Breadcrumbs and Toggle -->
    <div class="flex items-center gap-4">
      <!-- Sidebar Toggle Button -->
      <button 
        @click="onSidebarToggle"
        class="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <span v-html="icons.menu"></span>
      </button>
      
      <!-- Breadcrumbs -->
      <nav class="hidden sm:flex">
        <ol class="flex items-center space-x-2">
          <li v-for="(crumb, index) in breadcrumbs.breadcrumbs" :key="index" class="flex items-center">
            <router-link 
              v-if="index < breadcrumbs.breadcrumbs.length - 1" 
              :to="crumb.path" 
              class="text-neutral-500 hover:text-primary-600 text-sm"
            >
              {{ crumb.name }}
            </router-link>
            <span 
              v-else 
              class="text-neutral-900 font-medium text-sm"
            >
              {{ crumb.name }}
            </span>
            
            <span 
              v-if="index < breadcrumbs.breadcrumbs.length - 1" 
              class="mx-2 text-neutral-400"
              v-html="icons.chevron_right"
            ></span>
          </li>
        </ol>
      </nav>
    </div>
    
    <!-- Right Section: Actions and Profile -->
    <div class="flex items-center gap-2">
      <!-- Theme Selector -->
      <Dropdown v-slot="{ setRef, toggleDropdown }">
        <button 
          ref="setRef"
          @click="toggleDropdown"
          class="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative"
          aria-label="Change theme"
        >
          <span v-html="icons.palette"></span>
        </button>
        
        <template #dropdown>
          <div class="py-2 w-56">
            <div class="px-4 py-2 text-sm font-medium text-neutral-900 border-b border-neutral-200">
              Select Theme
            </div>
            <div class="mt-2 space-y-1">
              <button 
                v-for="theme in themeStore.themes" 
                :key="theme.id"
                @click="changeTheme(theme.id)"
                class="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 transition-colors"
                :class="{'bg-neutral-50': themeStore.activeTheme === theme.id}"
              >
                <div class="w-4 h-4 rounded-full mr-3" :class="`bg-primary-${theme.id === 'default' ? '500' : '600'}`"></div>
                <div>
                  <div class="font-medium">{{ theme.name }}</div>
                  <div class="text-xs text-neutral-500">{{ theme.description }}</div>
                </div>
              </button>
            </div>
          </div>
        </template>
      </Dropdown>
      
      <!-- Notifications -->
      <Dropdown v-slot="{ setRef, toggleDropdown }">
        <button 
          ref="setRef"
          @click="toggleDropdown"
          class="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative"
          aria-label="Notifications"
        >
          <span v-html="icons.bell"></span>
          <span 
            v-if="unreadCount > 0"
            class="absolute top-1 right-1 w-4 h-4 bg-error text-white text-xs flex items-center justify-center rounded-full"
          >
            {{ unreadCount }}
          </span>
        </button>
        
        <template #dropdown>
          <div class="py-2 w-80">
            <div class="px-4 py-2 flex items-center justify-between border-b border-neutral-200">
              <span class="text-sm font-medium text-neutral-900">Notifications</span>
              <button 
                v-if="unreadCount > 0"
                @click="markAllAsRead"
                class="text-xs text-primary-600 hover:text-primary-700"
              >
                Mark all as read
              </button>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div 
                v-if="notifications.length === 0"
                class="px-4 py-6 text-center text-neutral-500 text-sm"
              >
                No notifications
              </div>
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="px-4 py-3 hover:bg-neutral-50 transition-colors border-l-2"
                :class="{
                  'border-error': notification.type === 'danger' && !notification.read,
                  'border-warning': notification.type === 'warning' && !notification.read,
                  'border-info': notification.type === 'info' && !notification.read,
                  'border-transparent': notification.read,
                  'bg-neutral-50': !notification.read
                }"
              >
                <div class="flex justify-between items-start">
                  <span class="font-medium text-sm">{{ notification.title }}</span>
                  <span class="text-xs text-neutral-500">{{ notification.time }}</span>
                </div>
                <p class="text-xs text-neutral-600 mt-1">{{ notification.message }}</p>
              </div>
            </div>
            <div class="px-4 py-2 border-t border-neutral-200">
              <button class="text-xs text-primary-600 hover:text-primary-700 w-full text-center">
                View all notifications
              </button>
            </div>
          </div>
        </template>
      </Dropdown>
      
      <!-- User Profile -->
      <Dropdown v-slot="{ setRef, toggleDropdown }">
        <button 
          ref="setRef"
          @click="toggleDropdown"
          class="flex items-center gap-2 ml-2"
        >
          <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
            {{ userInitials }}
          </div>
          <div class="hidden md:block text-left">
            <div class="text-sm font-medium">{{ userFullName }}</div>
            <div class="text-xs text-neutral-500">{{ userRole }}</div>
          </div>
          <span class="hidden md:block text-neutral-400" v-html="icons.chevron_down"></span>
        </button>
        
        <template #dropdown>
          <div class="py-2 w-56">
            <div class="px-4 py-3 border-b border-neutral-200">
              <div class="font-medium">{{ userFullName }}</div>
              <div class="text-sm text-neutral-500">{{ userRole }}</div>
            </div>
            <div class="mt-2">
              <router-link 
                to="/profile" 
                class="flex items-center px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
              >
                <span class="mr-3" v-html="icons.user"></span>
                My Profile
              </router-link>
              <router-link 
                to="/settings" 
                class="flex items-center px-4 py-2 text-sm hover:bg-neutral-100 transition-colors"
              >
                <span class="mr-3" v-html="icons.settings"></span>
                Settings
              </router-link>
              <button 
                @click="logout" 
                class="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-neutral-100 transition-colors text-error"
              >
                <span class="mr-3" v-html="icons.logout"></span>
                Sign Out
              </button>
            </div>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>