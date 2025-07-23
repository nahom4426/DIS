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

// Notifications
const notifications = ref([
  {
    id: 1,
    title: "New Order",
    message: "Order #1234 has been placed",
    time: "2 min ago",
    type: "info",
    read: false
  },
  {
    id: 2,
    title: "Low Stock Alert",
    message: "Paracetamol is running low",
    time: "1 hour ago",
    type: "warning",
    read: false
  },
  {
    id: 3,
    title: "System Update",
    message: "System will be updated tonight",
    time: "3 hours ago",
    type: "info",
    read: true
  }
]);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

// User profile computed properties
const userInitials = computed(() => {
  const user = authStore.auth?.user;
  if (!user) return "";
  
  const firstName = user.firstName || "";
  const lastName = user.lastName || user.fatherName || "";
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
});

const userFullName = computed(() => {
  const user = authStore.auth?.user;
  if (!user) return "";
  
  const fullName = `${user.firstName || ""} ${user.lastName || user.fatherName || ""}`.trim();
  return fullName;
});

const userRole = computed(() => {
  return authStore.auth?.user?.roleName || "";
});

function markAllAsRead() {
  notifications.value = notifications.value.map(n => ({...n, read: true}));
}

function goToProfile() {
  router.push("/profile");
}

function logout() {
  // Clear user session/token
  localStorage.removeItem("userDetail");
  localStorage.removeItem("authToken");
  authStore.setAuth(null);
  
  // Redirect to login screen
  router.push("/login");
}

function changeTheme(themeId) {
  themeStore.setTheme(themeId);
}
</script>

<template>
  <header class="w-full h-16 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
    <div class="h-full px-4 lg:px-6 flex items-center justify-between">
      <!-- Left Section: Brand & Navigation -->
      <div class="flex items-center gap-6 flex-1 min-w-0">
        <!-- Logo/Brand Area -->
        <div class="flex items-center gap-3">
          <button 
            @click="onSidebarToggle"
            class="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <span v-html="icons.menu" class="w-5 h-5"></span>
          </button>
          
          <div class="hidden lg:flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span class="text-white font-bold text-sm">HC</span>
            </div>
            <span class="font-semibold text-gray-900">Health Connect</span>
          </div>
        </div>
        
        <!-- Modern Breadcrumbs -->
        <nav class="flex-1 min-w-0 hidden md:block">
          <div class="flex items-center gap-2 text-sm">
            <div v-for="(crumb, index) in breadcrumbs.breadcrumbs" :key="index" class="flex items-center gap-2">
              <router-link 
                v-if="index < breadcrumbs.breadcrumbs.length - 1" 
                :to="crumb.path" 
                class="px-3 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 truncate"
              >
                {{ crumb.name }}
              </router-link>
              <div 
                v-else 
                class="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-900 font-medium truncate"
              >
                {{ crumb.name }}
              </div>
              
              <span 
                v-if="index < breadcrumbs.breadcrumbs.length - 1" 
                class="text-gray-300"
                v-html="icons.chevron_right"
              ></span>
            </div>
          </div>
        </nav>
      </div>
      
      <!-- Center Section: Search -->
      <div class="hidden xl:flex items-center flex-shrink-0 mx-8">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-80 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          >
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" v-html="icons.search"></span>
        </div>
      </div>
      
      <!-- Right Section: Actions & Profile -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Quick Actions -->
        <div class="flex items-center gap-1">
          <!-- Search (Mobile) -->
          <button class="xl:hidden p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200">
            <span v-html="icons.search" class="w-5 h-5 text-gray-600"></span>
          </button>
          
          <!-- Theme Selector -->
          <Dropdown v-slot="{ setRef, toggleDropdown }">
            <button 
              ref="setRef"
              @click="toggleDropdown"
              class="p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 group"
              aria-label="Change theme"
            >
              <span v-html="icons.palette" class="w-5 h-5 text-gray-600 group-hover:text-blue-600"></span>
            </button>
            
            <template #dropdown>
              <div class="py-3 w-64">
                <div class="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-100">
                  Choose Theme
                </div>
                <div class="mt-3 space-y-1 px-2">
                  <button 
                    v-for="theme in themeStore.themes" 
                    :key="theme.id"
                    @click="changeTheme(theme.id)"
                    class="flex items-center w-full px-3 py-2.5 text-sm text-left rounded-lg hover:bg-gray-50 transition-all duration-200"
                    :class="{'bg-blue-50 border border-blue-200': themeStore.activeTheme === theme.id}"
                  >
                    <div class="w-4 h-4 rounded-full mr-3 border-2 border-gray-200" :style="`background: linear-gradient(135deg, ${theme.colors?.primary || '#3b82f6'}, ${theme.colors?.secondary || '#8b5cf6'})`"></div>
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{{ theme.name }}</div>
                      <div class="text-xs text-gray-500 mt-0.5">{{ theme.description }}</div>
                    </div>
                    <span v-if="themeStore.activeTheme === theme.id" class="text-blue-600" v-html="icons.check"></span>
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
              class="p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 relative group"
              aria-label="Notifications"
            >
              <span v-html="icons.bell" class="w-5 h-5 text-gray-600 group-hover:text-blue-600"></span>
              <span 
                v-if="unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-medium shadow-lg"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
            
            <template #dropdown>
              <div class="py-3 w-96">
                <div class="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                  <span class="text-sm font-semibold text-gray-900">Notifications</span>
                  <button 
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div 
                    v-if="notifications.length === 0"
                    class="px-4 py-8 text-center text-gray-500 text-sm"
                  >
                    <span v-html="icons.bell" class="w-8 h-8 mx-auto mb-2 text-gray-300"></span>
                    <p>No notifications yet</p>
                  </div>
                  <div 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    class="px-4 py-3 hover:bg-gray-50 transition-all duration-200 border-l-3"
                    :class="{
                      'border-red-400 bg-red-50/30': notification.type === 'danger' && !notification.read,
                      'border-amber-400 bg-amber-50/30': notification.type === 'warning' && !notification.read,
                      'border-blue-400 bg-blue-50/30': notification.type === 'info' && !notification.read,
                      'border-transparent': notification.read
                    }"
                  >
                    <div class="flex justify-between items-start mb-1">
                      <span class="font-medium text-sm text-gray-900">{{ notification.title }}</span>
                      <span class="text-xs text-gray-500 ml-2">{{ notification.time }}</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ notification.message }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
        
        <!-- Divider -->
        <div class="w-px h-6 bg-gray-200 mx-2"></div>
        
        <!-- User Profile -->
        <Dropdown v-slot="{ setRef, toggleDropdown }">
          <button 
            ref="setRef"
            @click="toggleDropdown"
            class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 group"
          >
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm shadow-lg">
              {{ userInitials }}
            </div>
            <div class="hidden lg:block text-left">
              <div class="text-sm font-semibold text-gray-900">{{ userFullName }}</div>
              <div class="text-xs text-gray-500">{{ userRole }}</div>
            </div>
            <span class="hidden lg:block text-gray-400 group-hover:text-gray-600 transition-colors" v-html="icons.chevron_down"></span>
          </button>
          
          <template #dropdown>
            <div class="py-3 w-64">
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-lg">
                    {{ userInitials }}
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">{{ userFullName }}</div>
                    <div class="text-sm text-gray-500">{{ userRole }}</div>
                  </div>
                </div>
              </div>
              <div class="mt-2 space-y-1 px-2">
                <button class="flex items-center w-full px-3 py-2.5 text-sm text-left rounded-lg hover:bg-gray-50 transition-all duration-200">
                  <span v-html="icons.user" class="w-4 h-4 mr-3 text-gray-500"></span>
                  Profile Settings
                </button>
                <button class="flex items-center w-full px-3 py-2.5 text-sm text-left rounded-lg hover:bg-gray-50 transition-all duration-200">
                  <span v-html="icons.settings" class="w-4 h-4 mr-3 text-gray-500"></span>
                  Preferences
                </button>
                <hr class="my-2 border-gray-100">
                <button 
                  @click="logout"
                  class="flex items-center w-full px-3 py-2.5 text-sm text-left rounded-lg hover:bg-red-50 text-red-600 transition-all duration-200"
                >
                  <span v-html="icons.logout" class="w-4 h-4 mr-3"></span>
                  Sign Out
                </button>
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
  </header>
</template>
