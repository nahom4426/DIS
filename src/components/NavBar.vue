<script setup>
<<<<<<< HEAD
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import icons from '@/utils/icons';
import imageSrc from '@/assets/img/profile.png';
=======
import icons from "@/utils/icons";
import { useAuthStore } from "@/stores/auth";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import imageSrc from '@/assets/img/profile.png'
>>>>>>> 768174987201b4037df05a855d37a2dcc595fb5e

const router = useRouter();
const authStore = useAuthStore();
const isScrolled = ref(false);

// Use a computed property for the profile picture so it updates reactively
const profilePicture = computed(() => {
  const img = authStore.auth?.user?.imageData;
  if (!img) return imageSrc;
  return img.startsWith("data:image/") ? img : `data:image/png;base64,${img}`;
});

// Dropdown states
const languageDropdownOpen = ref(false);
const profileDropdownOpen = ref(false);

// Close all dropdowns
function closeAllDropdowns() {
  languageDropdownOpen.value = false;
  profileDropdownOpen.value = false;
}

// Toggle specific dropdown and close others
function toggleLanguageDropdown() {
  const wasOpen = languageDropdownOpen.value;
  closeAllDropdowns();
  languageDropdownOpen.value = !wasOpen;
}

function toggleProfileDropdown() {
  const wasOpen = profileDropdownOpen.value;
  closeAllDropdowns();
  profileDropdownOpen.value = !wasOpen;
}

// Close dropdowns when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.dropdown-container')) {
    closeAllDropdowns();
  }
}

// Handle scroll effect
onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 10;
  });
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function logout() {
  closeAllDropdowns();
  localStorage.removeItem("userDetail");
  window.location.href = "/login";
}

function goToProfile() {
  closeAllDropdowns();
  router.push('/profile');
}

function goToSettings() {
  closeAllDropdowns();
  router.push('/settings');
}

const props = defineProps({
  breadcrumbs: Object,
});
</script>

<template>
  <div
    class="h-navbar-height bg-white/80 backdrop-blur-md flex items-center sticky top-0 z-50 justify-between px-6 transition-all duration-300 shadow-sm"
    :class="{
      'shadow-md': isScrolled,
      'border-b border-gray-100': !isScrolled
    }"
  >
    <!-- Left Section -->
    <div class="flex items-center gap-6">
      <button 
        @click="$router.back()"
        class="p-2 rounded-full hover:bg-primary/10 transition-colors duration-200 group"
        aria-label="Go back"
      >
        <i 
          v-html="icons.chevron_left" 
          class="text-gray-600 group-hover:text-primary transition-colors duration-200"
        />
      </button>

      <div class="flex flex-col">
        <h1 class="text-lg font-semibold text-gray-800">
          {{
            breadcrumbs.breadcrumbs[breadcrumbs.breadcrumbs.length - 1]?.name ||
            "DIS"
          }}
        </h1>
        <p v-if="breadcrumbs.breadcrumbs.length > 1" class="text-xs text-gray-500 flex items-center gap-1">
          <span v-for="(crumb, index) in breadcrumbs.breadcrumbs" :key="index">
            <span v-if="index > 0">/</span>
            <span class="hover:text-primary transition-colors">{{ crumb.name }}</span>
          </span>
        </p>
      </div>
    </div>

    <!-- Center Section -->
    <div class="hidden md:block">
      <div class="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-lg shadow-inner backdrop-blur-sm border border-white/50">
        <span class="text-primary font-medium text-sm md:text-base animate-pulse">
          {{ authStore.auth?.user?.companyName || 'Admin Dashboard' }}
        </span>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-4">
      <!-- Language Selector -->
      <div class="dropdown-container relative">
        <button
          @click.stop="toggleLanguageDropdown"
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
        >
          <span class="text-sm font-medium text-gray-700 group-hover:text-primary">ENG</span>
          <i 
            v-html="icons.chevron_down" 
            class="text-xs text-gray-500 group-hover:text-primary transition-transform duration-200"
            :class="{ 'rotate-180': languageDropdownOpen }"
          />
        </button>
        
        <div
          v-if="languageDropdownOpen"
          class="absolute shadow-lg border p-2 mt-2 rounded-lg flex flex-col gap-1 w-40 bg-white/95 backdrop-blur-sm z-50"
        >
          <button 
            @click="closeAllDropdowns"
            class="p-2 text-left hover:bg-gray-50 rounded-md transition-colors"
          >
            English
          </button>
          <button 
            @click="closeAllDropdowns"
            class="p-2 text-left hover:bg-gray-50 rounded-md transition-colors"
          >
            Amharic
          </button>
        </div>
      </div>

      <!-- User Profile -->
      <div class="dropdown-container relative">
        <div
          @click.stop="toggleProfileDropdown"
          class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
        >
          <div class="relative">
            <div class="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow">
              <img
                :src="profilePicture || imageSrc"
                alt="User avatar"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                @error="handleImageError"
              />
            </div>
            <span class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          
          <div class="hidden md:flex flex-col items-start">
            <span class="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[120px]">
              {{ authStore.auth.user?.firstName + " " + authStore.auth.user?.fatherName || "User" }}
            </span>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
              {{ authStore.auth?.user?.roleName || 'Admin' }}
            </span>
          </div>
          
          <i 
            v-html="icons.chevron_down" 
            class="text-xs text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': profileDropdownOpen }"
          />
        </div>

        <!-- Dropdown Menu -->
        <div
          v-if="profileDropdownOpen"
          class="absolute right-0 shadow-xl border border-gray-100 p-2 mt-2 rounded-xl flex flex-col gap-1 w-56 bg-white/95 backdrop-blur-sm z-50"
        >
          <div class="px-3 py-2 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-800">{{ authStore.auth.user?.firstName }} {{ authStore.auth.user?.fatherName }}</p>
            <p class="text-xs text-gray-500">{{ authStore.auth?.user?.email }}</p>
          </div>
          
          <button
            @click="goToProfile"
            class="p-2 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
          >
            <i v-html="icons.profile" class="text-gray-500 group-hover:text-primary" />
            <span class="text-sm">My Profile</span>
          </button>
          
          <button
            @click="goToSettings"
            class="p-2 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
          >
            <i v-html="icons.settings" class="text-gray-500 group-hover:text-primary" />
            <span class="text-sm">Settings</span>
          </button>
          
          <div class="border-t border-gray-100 my-1"></div>
          
          <button
            @click="logout"
            class="p-2 flex items-center gap-3 rounded-lg hover:bg-red-50 text-red-500 transition-all duration-200 group"
          >
            <i v-html="icons.logout" class="group-hover:text-red-600" />
            <span class="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animation for dropdown entrance */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Pulse animation for active status */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-pulse {
  animation: pulse 2s infinite;
}

/* Smooth transitions */
.transition-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
</style>
