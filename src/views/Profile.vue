<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-900">User Profile</h1>
        <p class="text-gray-600 mt-1">Manage your personal information and account settings</p>
      </div>
      
      <!-- Profile Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                v-model="userProfile.firstName"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                v-model="userProfile.lastName"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="userProfile.email"
                type="email" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input 
                v-model="userProfile.roleName"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                readonly
              >
            </div>
          </div>
          
          <!-- Security Settings -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                v-model="passwordData.currentPassword"
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                v-model="passwordData.newPassword"
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                v-model="passwordData.confirmPassword"
                type="password" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-8 flex gap-4">
          <button 
            @click="saveProfile"
            class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Save Changes
          </button>
          <button 
            @click="cancelChanges"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userProfile = ref({
  firstName: '',
  lastName: '',
  email: '',
  roleName: ''
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  // Load user data from auth store
  const user = authStore.auth?.user
  if (user) {
    userProfile.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || user.fatherName || '',
      email: user.email || '',
      roleName: user.roleName || ''
    }
  }
})

function saveProfile() {
  // Validate password if changing
  if (passwordData.value.newPassword) {
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
      alert('New passwords do not match')
      return
    }
  }
  
  // Update auth store with new profile data
  const updatedUser = {
    ...authStore.auth.user,
    ...userProfile.value
  }
  
  authStore.setAuth({
    ...authStore.auth,
    user: updatedUser
  })
  
  alert('Profile updated successfully!')
}

function cancelChanges() {
  router.push('/dashboard')
}
</script>