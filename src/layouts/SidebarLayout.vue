<template>
  <div class="sidebar-layout">
    <!-- Sidebar -->
    <aside 
      class="sidebar"
      :class="{ 'sidebar--collapsed': isCollapsed }"
    >
      <!-- Logo Section -->
      <div class="sidebar__brand">
        <div class="sidebar__logo">
          <img 
            src="@/assets/DISs.png" 
            alt="Logo" 
            :class="isCollapsed ? 'sidebar__logo--small' : 'sidebar__logo--full'"
          >
        </div>
        <div v-if="!isCollapsed" class="sidebar__brand-text">
          <h2 class="sidebar__title">DIS</h2>
          <p class="sidebar__subtitle">Drug Information System</p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar__navigation">
        <!-- Main Menu Items -->
        <ul class="sidebar__menu">
          <li v-for="item in mainMenuItems" :key="item.name" class="sidebar__menu-item">
            <router-link 
              :to="item.path"
              class="sidebar__menu-link"
              :class="{ 'sidebar__menu-link--active': $route.path === item.path }"
            >
              <span class="sidebar__menu-icon">
                <i v-html="item.icon"></i>
              </span>
              <span v-if="!isCollapsed" class="sidebar__menu-text">{{ item.name }}</span>
              <span v-if="!isCollapsed && item.badge" class="sidebar__menu-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>

        <!-- Organisation Section -->
        <div v-if="!isCollapsed" class="sidebar__section">
          <div class="sidebar__section-header">
            <span>Organisation</span>
            <button class="sidebar__section-toggle">
              <i>▲</i>
            </button>
          </div>
          <ul class="sidebar__menu">
            <li v-for="item in organisationItems" :key="item.name" class="sidebar__menu-item">
              <router-link 
                :to="item.path"
                class="sidebar__menu-link"
                :class="{ 'sidebar__menu-link--active': $route.path === item.path }"
              >
                <span class="sidebar__menu-icon">
                  <i v-html="item.icon"></i>
                </span>
                <span class="sidebar__menu-text">{{ item.name }}</span>
                <span v-if="item.expandable" class="sidebar__menu-expand">+</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Vendors Section -->
        <div v-if="!isCollapsed" class="sidebar__section">
          <div class="sidebar__section-header">
            <span>Vendors</span>
            <button class="sidebar__section-toggle">
              <i>▼</i>
            </button>
          </div>
        </div>

        <!-- Managed Service Section -->
        <div v-if="!isCollapsed" class="sidebar__section">
          <div class="sidebar__section-header">
            <span>Managed Service</span>
            <button class="sidebar__section-toggle">
              <i>▼</i>
            </button>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar__footer">
        <!-- Toggle Button -->
        <button 
          @click="toggleSidebar"
          class="sidebar__toggle"
          :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <i v-html="isCollapsed ? '→' : '←'"></i>
        </button>
        
        <!-- User Profile (when expanded) -->
        <div v-if="!isCollapsed" class="sidebar__user-container">
          <button 
            @click="toggleUserDropdown"
            class="sidebar__user"
            :class="{ 'sidebar__user--active': showUserDropdown }"
          >
            <div class="sidebar__user-avatar">
              <img 
                :src="userProfilePicture" 
                alt="User Avatar" 
                class="sidebar__avatar"
              >
            </div>
            <div class="sidebar__user-info">
              <p class="sidebar__user-name">{{ userName }}</p>
              <p class="sidebar__user-role">{{ userRole }}</p>
            </div>
            <div class="sidebar__user-menu">
              <i v-html="showUserDropdown ? '▲' : '▼'"></i>
            </div>
          </button>

          <!-- User Dropdown -->
          <div v-if="showUserDropdown" class="sidebar__user-dropdown">
            <button 
              @click="goToProfile"
              class="sidebar__dropdown-item"
            >
              <span class="sidebar__dropdown-icon">👤</span>
              <span>My Profile</span>
            </button>
            <button 
              @click="logout"
              class="sidebar__dropdown-item sidebar__dropdown-item--danger"
            >
              <span class="sidebar__dropdown-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="main-header">
        <div class="main-header__content">
          <div class="main-header__left">
            <h1 class="main-header__title">{{ pageTitle }}</h1>
            <nav class="main-header__breadcrumb">
              <span class="breadcrumb__item">Home</span>
              <span class="breadcrumb__separator">/</span>
              <span class="breadcrumb__item breadcrumb__item--current">{{ pageTitle }}</span>
            </nav>
          </div>
          <div class="main-header__right">
            <slot name="header-actions"></slot>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="main-content__body">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import imageSrc from '@/assets/img/profile.png'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)
const showUserDropdown = ref(false)

const mainMenuItems = ref([
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '🏠'
  },
  {
    name: 'Requests',
    path: '/service',
    icon: '�',
    badge: '3'
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: '📦'
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: '📈'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: '⚙️'
  }
])

const organisationItems = ref([
  {
    name: 'Overview',
    path: '/overview',
    icon: '📊'
  },
  {
    name: 'Risk Profile',
    path: '/risk-profile',
    icon: '🛡️',
    expandable: true
  },
  {
    name: 'Remediation',
    path: '/remediation',
    icon: '🔧',
    expandable: true
  },
  {
    name: 'Domains',
    path: '/domains',
    icon: '🌐',
    expandable: true
  },
  {
    name: 'Vulnerabilities',
    path: '/vulnerabilities',
    icon: '⚠️'
  },
  {
    name: 'Identity breaches',
    path: '/identity-breaches',
    icon: '👤'
  },
  {
    name: 'Data leaks',
    path: '/data-leaks',
    icon: '</>'
  },
  {
    name: 'Security profile',
    path: '/security-profile',
    icon: '⚡'
  }
])

const pageTitle = computed(() => {
  const currentItem = mainMenuItems.value.find(item => item.path === route.path)
  return currentItem?.name || 'Dashboard'
})

const userProfilePicture = computed(() => {
  const imageData = authStore.auth?.user?.imageData || authStore.imageData
  if (imageData && !imageData.startsWith("data:image/")) {
    return `data:image/png;base64,${imageData}`
  }
  return imageData || imageSrc
})

const userName = computed(() => {
  const user = authStore.auth?.user
  if (user?.firstName) {
    return `${user.firstName} ${user.lastName || ''}`.trim()
  }
  return user?.email || 'User'
})

const userRole = computed(() => {
  return authStore.auth?.user?.roleName || 'User'
})

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
  showUserDropdown.value = false
}

function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value
}

function goToProfile() {
  router.push('/profile')
  showUserDropdown.value = false
}

function logout() {
  localStorage.removeItem("userDetail")
  authStore.setAuth(null)
  router.push("/login")
  showUserDropdown.value = false
}

function handleClickOutside(event) {
  const userContainer = document.querySelector('.sidebar__user-container')
  if (userContainer && !userContainer.contains(event.target)) {
    showUserDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Layout Container */
.sidebar-layout {
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.sidebar--collapsed {
  width: 72px;
}

/* Brand Section */
.sidebar__brand {
  padding: 24px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 80px;
}

.sidebar__logo--full {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.sidebar__logo--small {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.sidebar__brand-text {
  flex: 1;
  min-width: 0;
}

.sidebar__title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.sidebar__subtitle {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

/* Navigation */
.sidebar__navigation {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.sidebar__menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar__menu-item {
  margin: 0;
  padding: 0 16px 4px 16px;
}

.sidebar__menu-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #6b7280;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.sidebar__menu-link:hover {
  background-color: #f9fafb;
  color: #374151;
}

.sidebar__menu-link--active {
  background-color: #ede9fe;
  color: #9461fd;
  font-weight: 600;
}

.sidebar__menu-link--active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #9461fd;
  border-radius: 0 2px 2px 0;
}

.sidebar__menu-icon {
  margin-right: 12px;
  font-size: 18px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar__menu-text {
  flex: 1;
}

.sidebar__menu-badge {
  background-color: #9461fd;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  font-weight: 600;
}

/* Section Headers */
.sidebar__section-header {
  padding: 16px 32px 8px 32px;
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar__section-toggle {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.sidebar__section-toggle:hover {
  color: #6b7280;
  background-color: #f3f4f6;
}

/* Expandable sections */
.sidebar__section {
  margin-bottom: 24px;
}

.sidebar__section--collapsed .sidebar__menu {
  display: none;
}

/* Plus icons for expandable items */
.sidebar__menu-expand {
  margin-left: auto;
  color: #d1d5db;
  font-size: 16px;
  transition: all 0.2s ease;
}

.sidebar__menu-link:hover .sidebar__menu-expand {
  color: #9ca3af;
}

/* Footer adjustments */
.sidebar__footer {
  border-top: 1px solid #f3f4f6;
  padding: 16px;
  margin-top: auto;
}

/* Collapsed state adjustments */
.sidebar--collapsed .sidebar__section-header {
  display: none;
}

.sidebar--collapsed .sidebar__menu-item {
  padding: 0 8px 4px 8px;
}

.sidebar--collapsed .sidebar__menu-link {
  justify-content: center;
  padding: 12px 8px;
}

.sidebar--collapsed .sidebar__menu-icon {
  margin-right: 0;
}

.sidebar--collapsed .sidebar__menu-link--active::before {
  display: none;
}

/* User Profile Container */
.sidebar__user-container {
  position: relative;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar__user:hover,
.sidebar__user--active {
  background-color: #f3f4f6;
}

.sidebar__user-avatar {
  flex-shrink: 0;
}

.sidebar__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar__user-info {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.sidebar__user-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-role {
  font-size: 11px;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-menu {
  color: #9ca3af;
  font-size: 12px;
  transition: color 0.2s ease;
}

/* User Dropdown */
.sidebar__user-dropdown {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  margin-bottom: 8px;
  z-index: 1000;
  overflow: hidden;
}

.sidebar__dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sidebar__dropdown-item:hover {
  background-color: #f9fafb;
}

.sidebar__dropdown-item--danger {
  color: #dc2626;
}

.sidebar__dropdown-item--danger:hover {
  background-color: #fef2f2;
}

.sidebar__dropdown-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
}

.main-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.main-header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-header__title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.main-header__breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.breadcrumb__item--current {
  color: #374151;
  font-weight: 500;
}

.breadcrumb__separator {
  color: #d1d5db;
}

.main-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.main-content__body {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background-color: #f8fafc;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar--collapsed {
    transform: translateX(0);
    width: 280px;
  }
  
  .main-content {
    width: 100%;
  }
}

/* Collapsed State Adjustments */
.sidebar--collapsed .sidebar__brand {
  justify-content: center;
  padding: 24px 12px;
}

.sidebar--collapsed .sidebar__menu-item {
  padding: 0 8px 4px 8px;
}

.sidebar--collapsed .sidebar__menu-link {
  justify-content: center;
  padding: 12px 8px;
}

.sidebar--collapsed .sidebar__menu-icon {
  margin-right: 0;
}

.sidebar--collapsed .sidebar__footer {
  padding: 16px 8px;
}

.sidebar--collapsed .sidebar__toggle {
  padding: 12px 8px;
}
</style>








