<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import icons from '@/utils/icons'
import Button from '@/components/Button.vue'
import { toasted } from '@/utils/utils'

const router = useRouter()
const fileInput = ref(null)
const profilePicture = ref(null)

const profileData = ref({
  name: 'Dr. Sarah Johnson',
  email: 'pharmacist@hospital.com',
  phone: '+1 (555) 123-4567',
  department: 'Pharmacy Department',
  hospital: 'Central Medical Hospital',
  license: 'PH-2024-001234',
  experience: '8 years',
  specialization: 'Clinical Pharmacy',
  joinDate: '2016-03-15'
})

const isEditing = ref(false)

// Load existing profile picture from localStorage
const userData = localStorage.getItem('doctorCommUser')
if (userData) {
  const user = JSON.parse(userData)
  profilePicture.value = user.profilePicture || null
  // Update profileData with stored user data
  Object.assign(profileData.value, user)
}

function goBack() {
  router.back()
}

function toggleEdit() {
  isEditing.value = !isEditing.value
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files[0]
  
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    toasted(false, 'Please select a valid image file.')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    profilePicture.value = e.target.result
    toasted(true, 'Profile picture updated!')
  }
  
  reader.onerror = () => {
    toasted(false, 'Error reading image file.')
  }
  
  reader.readAsDataURL(file)
}

function saveProfile() {
  // Save profile data including image to localStorage
  const updatedUser = {
    ...profileData.value,
    profilePicture: profilePicture.value
  }
  
  localStorage.setItem('doctorCommUser', JSON.stringify(updatedUser))
  toasted(true, 'Profile updated successfully!')
  isEditing.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="text-blue-600 hover:text-blue-400 font-medium transition-colors duration-200">
          &lt; Back
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Profile Information</h1>
          <p class="text-gray-600">Manage your profile details</p>
        </div>
      </div>
      
      <Button 
        @click="isEditing ? saveProfile() : toggleEdit()"
        :type="isEditing ? 'primary' : 'secondary'"
      >
        <i v-html="isEditing ? icons.save : icons.edit" class="mr-2"></i>
        {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
      </Button>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
        <div class="flex items-center space-x-6">
          <!-- Profile Picture -->
          <div class="relative">
            <div class="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              <img 
                :src="profilePicture || 'https://via.placeholder.com/96x96?text=Profile'"
                class="w-full h-full rounded-full object-cover"
                alt="Profile Picture"
              />
            </div>
            
            <!-- Edit Profile Picture Button -->
            <button 
              v-if="isEditing"
              @click="triggerFileInput"
              class="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors"
              title="Change profile picture"
            >
              <i v-html="icons.camera || icons.edit" class="w-4 h-4"></i>
            </button>
            
            <!-- Hidden file input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            />
          </div>
          
          <!-- Profile Info -->
          <div class="text-white">
            <h2 class="text-2xl font-bold">{{ profileData.name }}</h2>
            <p class="text-blue-100">{{ profileData.specialization }}</p>
            <p class="text-blue-200 text-sm">{{ profileData.department }}</p>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                v-model="profileData.name"
                :disabled="!isEditing"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="profileData.email"
                :disabled="!isEditing"
                type="email"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                v-model="profileData.phone"
                :disabled="!isEditing"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          <!-- Professional Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Professional Information</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input 
                v-model="profileData.department"
                :disabled="!isEditing"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
              <input 
                v-model="profileData.hospital"
                :disabled="!isEditing"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input 
                v-model="profileData.license"
                :disabled="!isEditing"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input 
                v-model="profileData.specialization"
                :disabled="!isEditing"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



