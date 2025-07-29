<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import icons from '@/utils/icons'
import Dropdown from '@/components/Dropdown.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const user = ref(null)

// Make profilePicture reactive to authStore changes
const profilePicture = computed(() => {
  return authStore.auth?.user?.imageData || authStore.imageData || user.value?.profilePicture || null
})

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/doctor-comm/dashboard',
    icon: icons.dashboard
  },
  {
    name: 'Recent Inquiries',
    path: '/doctor-comm/inquiries',
    icon: icons.search
  },
  {
    name: 'Full History',
    path: '/doctor-comm/history',
    icon: icons.reports
  },
  {
    name: 'Drug Lookup',
    path: '/doctor-comm/drug-lookup',
    icon: icons.search
  },
]

// Function to load user data from localStorage
function loadUserData() {
  // Try both localStorage keys
  let userData = localStorage.getItem('doctorCommUser')
  if (!userData) {
    userData = localStorage.getItem('userDetail')
  }
  
  if (userData) {
    user.value = JSON.parse(userData)
  }
}

onMounted(() => {
  loadUserData()
  
  // Listen for storage changes
  window.addEventListener('storage', loadUserData)
  
  // Listen for custom events when profile is updated
  window.addEventListener('profileUpdated', loadUserData)
})

// Watch for route changes to reload user data
watch(() => route.path, () => {
  loadUserData()
})

function goToProfile() {
  router.push('/doctor-comm/profile')
}

function logout() {
  localStorage.removeItem('doctorCommUser')
  localStorage.removeItem('userDetail')
  router.push('/doctor-comm/auth')
}

function goToNotifications() {
  router.push('/doctor-comm/inquiries')
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function toggleSidebarCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="h-screen bg-gray-50 flex overflow-hidden">
    <!-- Sidebar -->
    <div class="flex">
      <!-- Mobile sidebar overlay -->
      <div 
        v-if="sidebarOpen" 
        @click="closeSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>
      
      <!-- Sidebar -->
      <div 
        :class="[
          'fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-16' : 'w-64'
        ]"
      >
        <div class="flex flex-col h-full">
          <!-- Logo Section -->
          <div class="flex items-center px-6 py-4 border-b relative">
            <div :class="sidebarCollapsed ? 'justify-center' : 'justify-start'" class="flex items-center w-full">
              <img 
                src="/src/assets/edis-logo.jpg" 
                alt="EDIS Logo" 
                class="w-8 h-8"
                :class="sidebarCollapsed ? 'mr-0' : 'mr-3'"
              />
              <div v-if="!sidebarCollapsed">
                <h1 class="text-lg font-bold text-purple-600">EDIS</h1>
                <p class="text-xs text-gray-500">Pharmacist Portal</p>
              </div>
            </div>
            
            <!-- Collapse Toggle Button -->
            <button 
              @click="toggleSidebarCollapse"
              class="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <i 
                v-html="icons.chevron_left" 
                :class="sidebarCollapsed ? 'rotate-180' : ''"
                class="w-3 h-3 transition-transform duration-300"
              ></i>
            </button>
          </div>
          
          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              @click="closeSidebar"
              :class="[
                'flex items-center py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group',
                sidebarCollapsed ? 'px-2 justify-center' : 'px-4'
              ]"
              active-class="bg-blue-50 text-blue-700 border-r-2 border-blue-700"
            >
              <i 
                v-html="item.icon" 
                :class="sidebarCollapsed ? 'mr-0' : 'mr-3'"
                class="w-5 h-5 text-gray-400 group-hover:text-gray-600"
              ></i>
              <span v-if="!sidebarCollapsed" class="font-medium">{{ item.name }}</span>
            </router-link>
          </nav>
          
          <!-- Bottom Section -->
          <div class="px-4 py-4 border-t">
            <button 
              @click="logout"
              :class="[
                'flex items-center w-full py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors',
                sidebarCollapsed ? 'px-2 justify-center' : 'px-4'
              ]"
            >
              <i 
                v-html="icons.logout" 
                :class="sidebarCollapsed ? 'mr-0' : 'mr-3'"
                class="w-5 h-5"
              ></i>
              <span v-if="!sidebarCollapsed" class="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Navigation Bar -->
      <header class="bg-white shadow-sm border-b flex-shrink-0">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Mobile menu button and title -->
            <div class="flex items-center space-x-4">
              <button 
                @click="toggleSidebar"
                class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <i v-html="icons.menu" class="w-5 h-5"></i>
              </button>
              <div class="hidden lg:block">
                <h2 class="text-xl font-semibold text-gray-900">Ethiopian Drug Information System</h2>
                <p class="text-sm text-gray-500">Pharmacist Dashboard</p>
              </div>
            </div>
            
            <!-- Right Section: Notifications and Profile -->
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button 
                @click="goToNotifications"
                class="relative p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <i v-html="icons.bell" class="h-5 w-5"></i>
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              <!-- Profile Dropdown -->
              <Dropdown>
                <template #trigger="{ toggleDropdown }">
                  <button 
                    @click="toggleDropdown"
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      P
                    </div>
                    <div class="hidden md:block text-left">
                      <p class="text-sm font-medium text-gray-900">Pharmacist</p>
                      <p class="text-xs text-gray-500">Online</p>
                    </div>
                    <i v-html="icons.chevron_down" class="h-4 w-4 text-gray-400"></i>
                  </button>
                </template>
                
                <template #dropdown>
                  <div class="py-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div class="px-4 py-3 border-b border-gray-200">
                      <div class="font-medium text-gray-900">Pharmacist</div>
                      <div class="text-sm text-gray-500">pharmacist@hospital.com</div>
                    </div>
                    <div class="mt-2">
                      <button 
                        @click="goToProfile" 
                        class="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors"
                      >
                        <i v-html="icons.user" class="mr-3 h-4 w-4"></i>
                        Profile Info
                      </button>
                      <button 
                        @click="logout" 
                        class="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors text-red-600"
                      >
                        <i v-html="icons.logout" class="mr-3 h-4 w-4"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                </template>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content with Scroll -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-6">
          <div class="max-w-7xl mx-auto">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
main {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: #f7fafc;
}

main::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.router-link-active {
  @apply bg-blue-50 text-blue-700;
}
</style>














