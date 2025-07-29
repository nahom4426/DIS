<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);

onMounted(() => {
  const userData = localStorage.getItem('doctorCommUser');
  if (userData) {
    user.value = JSON.parse(userData);
  } else {
    router.push('/doctor-comm/auth');
  }
});

function logout() {
  localStorage.removeItem('doctorCommUser');
  router.push('/doctor-comm/auth');
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center font-bold">
              DC
            </div>
            <h1 class="ml-3 text-xl font-bold text-gray-900">Doctor Communication</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-700">
              Welcome, {{ user?.name }}
            </div>
            <button
              @click="logout"
              class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Welcome Section -->
        <div class="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Dashboard</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- User Info Card -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-blue-800 mb-2">Your Profile</h3>
                <div class="space-y-1 text-sm text-blue-700">
                  <p><strong>Name:</strong> {{ user?.name }}</p>
                  <p><strong>Role:</strong> {{ user?.role }}</p>
                  <p><strong>Specialization:</strong> {{ user?.specialization }}</p>
                  <p><strong>License:</strong> {{ user?.license }}</p>
                  <p><strong>Hospital:</strong> {{ user?.hospital }}</p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-green-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-green-800 mb-2">Quick Actions</h3>
                <div class="space-y-2">
                  <button class="w-full text-left text-sm text-green-700 hover:text-green-900 p-2 hover:bg-green-100 rounded">
                    📝 New Consultation
                  </button>
                  <button class="w-full text-left text-sm text-green-700 hover:text-green-900 p-2 hover:bg-green-100 rounded">
                    💬 Messages
                  </button>
                  <button class="w-full text-left text-sm text-green-700 hover:text-green-900 p-2 hover:bg-green-100 rounded">
                    📋 Patient Records
                  </button>
                </div>
              </div>

              <!-- Statistics -->
              <div class="bg-purple-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-purple-800 mb-2">Today's Stats</h3>
                <div class="space-y-2 text-sm text-purple-700">
                  <p>📅 Appointments: 8</p>
                  <p>💬 New Messages: 3</p>
                  <p>🔔 Pending Reviews: 2</p>
                  <p>📊 Consultations: 12</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 text-sm">👨‍⚕️</span>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">New patient consultation request</p>
                  <p class="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </div>

              <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span class="text-green-600 text-sm">💬</span>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Message from Dr. Sarah Johnson</p>
                  <p class="text-sm text-gray-500">15 minutes ago</p>
                </div>
              </div>

              <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span class="text-yellow-600 text-sm">📋</span>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Lab results available for review</p>
                  <p class="text-sm text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>
