<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import icons from "@/utils/icons";
import DrugInformationRequestForm from "@/components/DrugInformationRequestForm.vue";
import ProfilePage from "@/components/ProfilePage.vue";
import Dropdown from "@/components/Dropdown.vue";
import { BellIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const showInquiryForm = ref(false);
const showProfile = ref(false);
const isCollapsed = ref(false);
const showUserDropdown = ref(false);
const showMobileMenu = ref(false);

// Computed property to determine if we should show the New Inquiry button
const showNewInquiryButton = computed(() => {
  return route.name === "doctor-requests" && !showProfile.value;
});

function handleNewInquiry() {
  showInquiryForm.value = true;
  showProfile.value = false;
}

function handleFormSubmit(formData) {
  console.log("Form submitted:", formData);
  showInquiryForm.value = false;
}

function closeForm() {
  console.log("Closing form");
  showInquiryForm.value = false;
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}

function navigateTo(path) {
  router.push(path);
  showInquiryForm.value = false;
  showProfile.value = false;
  showMobileMenu.value = false;
}

function goToProfile() {
  showProfile.value = true;
  showInquiryForm.value = false;
  showUserDropdown.value = false;
}

function closeProfile() {
  showProfile.value = false;
}

function logout() {
  localStorage.removeItem("userDetail");
  localStorage.removeItem("authToken");
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Mobile Menu Overlay -->
    <div 
      v-if="showMobileMenu" 
      class="fixed inset-0 z-50 lg:hidden"
      @click="showMobileMenu = false"
    >
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div class="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl">
        <!-- Mobile Sidebar Content -->
        <div class="flex flex-col h-full">
          <!-- Mobile Logo -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <img
                src="/src/assets/mainlogo.png"
                alt="DIS Logo"
                class="w-12 h-10"
              />
              <div>
                <h2 class="text-lg font-bold text-gray-900">EDIS</h2>
                <p class="text-xs text-gray-500">Drug Information System</p>
              </div>
            </div>
          </div>
          
          <!-- Mobile Navigation -->
          <nav class="flex-1 p-4">
            <ul class="space-y-2">
              <li>
                <button
                  @click="navigateTo('/')"
                  :class="[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    route.name === 'dashboard'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  <i v-html="icons.dashboard || icons.home" class="text-xl"></i>
                  <span class="font-medium">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  @click="navigateTo('/doctor-requests')"
                  :class="[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    route.name === 'doctor-requests'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50',
                  ]"
                >
                  <i v-html="icons.request" class="text-xl"></i>
                  <span class="font-medium">Requests</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="flex h-screen">
      <!-- Desktop Sidebar -->
      <div
        :class="[
          'hidden lg:flex bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-all duration-300 flex-col relative',
          isCollapsed ? 'w-20' : 'w-72',
        ]"
      >
        <!-- Collapse/Expand Button -->
        <button
          @click="toggleSidebar"
          class="absolute -right-4 top-8 z-10 w-8 h-8 bg-white border-2 border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200"
          :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <i
            v-html="isCollapsed ? icons.chevron_right : icons.chevron_left"
            class="text-gray-600 text-sm transition-transform duration-200"
          ></i>
        </button>

        <!-- Logo Section -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                src="/src/assets/mainlogo.png"
                alt="DIS Logo"
                :class="isCollapsed ? 'w-10 h-8' : 'w-16 h-14'"
                class="transition-all duration-300"
              />
              
            </div>
            <div v-if="!isCollapsed" class="transition-all duration-300">
              <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EDIS</h2>
              <p class="text-xs text-gray-500 font-medium">Ethiopian Drug Information System</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-6 overflow-y-auto">
          <ul class="space-y-3">
            <!-- Dashboard -->
            <li>
              <button
                @click="navigateTo('/')"
                :class="[
                  'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                  route.name === 'dashboard'
                    ? 'bg-gradient-to-r from-[#9461fd] to-[#7c3aed] text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#9461fd]/10 hover:to-[#9461fd]/10 hover:text-[#9461fd]',
                ]"
              >
                <div class="relative z-10 flex items-center gap-4 w-full">
                  <i
                    v-html="icons.dashboard || icons.home"
                    :class="[
                      'text-xl flex-shrink-0 transition-colors duration-200',
                      route.name === 'dashboard' ? 'text-white' : 'text-gray-500 group-hover:text-[#9461fd]',
                    ]"
                  ></i>
                  <span
                    v-if="!isCollapsed"
                    class="font-semibold transition-all duration-200"
                  >Dashboard</span>
                </div>

                <!-- Active indicator -->
                <div
                  v-if="route.name === 'dashboard'"
                  class="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"
                ></div>

                <!-- Tooltip for collapsed state -->
                <div
                  v-if="isCollapsed"
                  class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl"
                >
                  Dashboard
                </div>
              </button>
            </li>

            <!-- Requests -->
            <li>
              <button
                @click="navigateTo('/doctor-requests')"
                :class="[
                  'w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                  route.name === 'doctor-requests'
                    ? 'bg-gradient-to-r from-[#9461fd] to-[#9461fd] text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#9461fd]/10 hover:to-[#9461fd]/10 hover:text-[#9461fd]',
                ]"
              >
                <div class="relative z-10 flex items-center gap-4 w-full">
                  <i
                    v-html="icons.request"
                    :class="[
                      'text-xl flex-shrink-0 transition-colors duration-200',
                      route.name === 'doctor-requests' ? 'text-white' : 'text-gray-500 group-hover:text-[#9461fd]',
                    ]"
                  ></i>
                  <span
                    v-if="!isCollapsed"
                    class="font-semibold transition-all duration-200"
                  >Requests</span>
                 
                </div>

                <!-- Active indicator -->
                <div
                  v-if="route.name === 'doctor-requests'"
                  class="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"
                ></div>

                <!-- Tooltip for collapsed state -->
                <div
                  v-if="isCollapsed"
                  class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl"
                >
                  Requests
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navigation -->
        <nav class="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
              <!-- Left Section -->
              <div class="flex items-center gap-4">
                <!-- Mobile menu button -->
                <button
                  @click="toggleMobileMenu"
                  class="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <i v-html="icons.menu" class="text-xl"></i>
                </button>
                
                <div>
                  <h1 class="text-2xl font-bold bg-gradient-to-r from-[#9461fd] to-[#7c3aed] bg-clip-text text-transparent">
                    Hospital Name
                  </h1>
                  <p class="text-sm text-gray-500 font-medium">Professional Healthcare Platform</p>
                </div>
              </div>

              <!-- Right Section - User Menu -->
              <div class="flex items-center gap-4">

                <!-- Notifications -->
                <button class="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                  <component
                    :is="icons.bell || BellIcon"
                    class="w-6 h-6 transition-colors"
                    aria-label="Notifications"
                  />
                  <span class="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-pulse"></span>
                  <span class="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
                </button>

                <!-- User Profile Dropdown -->
                <div class="relative">
                  <button
                    @click="showUserDropdown = !showUserDropdown"
                    class="flex items-center gap-3 pl-4 pr-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-200 shadow-sm hover:shadow-md"
                  >
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
                      DR
                    </div>
                    <div class="hidden sm:block text-left">
                      <div class="text-sm font-semibold text-gray-900">Dr. Amanda Ross</div>
                      <div class="text-xs text-gray-500">Internal Medicine</div>
                    </div>
                    <i
                      v-html="icons.chevron_down || icons.down"
                      class="text-gray-400 text-sm transition-transform duration-200"
                      :class="{ 'rotate-180': showUserDropdown }"
                    ></i>
                  </button>

                  <!-- Dropdown Menu -->
                  <div
                    v-if="showUserDropdown"
                    class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <!-- User Info Header -->
                    <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                          DR
                        </div>
                        <div>
                          <div class="font-semibold text-gray-900">Dr. Amanda Ross</div>
                          <div class="text-sm text-gray-600">Internal Medicine</div>
                          <div class="text-xs text-gray-500">amanda.ross@hospital.com</div>
                        </div>
                      </div>
                    </div>

                    <!-- Menu Items -->
                    <div class="py-2">
                      <button
                        @click="goToProfile(); showUserDropdown = false;"
                        class="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <span class="mr-3 text-gray-500" v-html="icons.user || icons.profile"></span>
                        My Profile
                      </button>

                      <button
                        @click="showUserDropdown = false"
                        class="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <span class="mr-3 text-gray-500" v-html="icons.settings || icons.cog"></span>
                        Settings
                      </button>

                      <hr class="my-2 border-gray-100" />

                      <button
                        @click="logout(); showUserDropdown = false;"
                        class="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span class="mr-3 text-red-500" v-html="icons.logout || icons.exit"></span>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <!-- Main Content Area -->
        <div class="flex-1 overflow-auto">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Header - Hidden when showing profile or form -->
            <div v-if="!showInquiryForm && !showProfile" class="mb-8">
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    {{ route.meta?.title || "Medical Communications" }}
                  </h1>
                  <p class="text-gray-600">Manage your medical requests and communications efficiently</p>
                </div>

                <!-- New Inquiry Button - Only shown on doctor-requests page -->
                <button
                  v-if="showNewInquiryButton"
                  @click="handleNewInquiry"
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i v-html="icons.plus || icons.add" class="text-lg"></i>
                  New Inquiry
                </button>
              </div>
            </div>

            <!-- Main Content -->
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 min-h-96 h-[calc(100vh-240px)] overflow-hidden">
              <!-- Show Profile Page -->
              <div
                v-if="showProfile"
                class="h-full overflow-y-auto custom-scrollbar"
              >
                <ProfilePage @back="closeProfile" />
              </div>

              <!-- Show Drug Information Request Form when New Inquiry is clicked -->
              <div
                v-else-if="showInquiryForm"
                class="h-full overflow-y-auto custom-scrollbar"
              >
                <DrugInformationRequestForm
                  @submit="handleFormSubmit"
                  @back="closeForm"
                />
              </div>

              <!-- Default Router View when form is not shown -->
              <div v-else class="h-full overflow-y-auto custom-scrollbar">
                <RouterView />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #6366f1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #4f46e5);
}

/* Smooth animations */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass morphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}
</style>














