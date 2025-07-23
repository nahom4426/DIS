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
            </div>
          </div>
        </template>
      </Dropdown>

      <!-- User Profile Dropdown -->
      <Dropdown v-slot="{ setRef, toggleDropdown }">
        <button 
          @click="toggleDropdown"
          class="flex items-center gap-3 ml-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="User profile menu"
        >
          <!-- Profile Avatar -->
          <div class="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
            DR
          </div>
          
          <!-- User Info -->
          <div class="hidden md:block text-left">
            <div class="text-sm font-semibold text-gray-800">Dr. {{ userFullName }}</div>
            <div class="text-xs text-gray-500">{{ userRole }}</div>
          </div>
          
          <!-- Dropdown Arrow -->
          <span class="hidden md:block text-gray-400 transition-transform duration-200" v-html="icons.chevron_down"></span>
        </button>
        
        <template #dropdown>
          <div class="py-2 w-56">
            <!-- User Info Header -->
            <div class="px-4 py-3 border-b border-neutral-200">
              <div class="font-semibold text-gray-800">Dr. {{ userFullName }}</div>
              <div class="text-sm text-gray-500">{{ userRole }}</div>
            </div>
            
            <!-- Menu Items -->
            <div class="mt-2 space-y-1">
              <button 
                @click="goToProfile" 
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-neutral-100 transition-colors"
              >
                <span class="mr-3 text-gray-500" v-html="icons.user"></span>
                Profile
              </button>
              
              <button 
                @click="logout" 
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <span class="mr-3 text-red-500" v-html="icons.logout"></span>
                Log Out
              </button>
            </div>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
