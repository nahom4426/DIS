<template>
  <div class="h-full flex flex-col">
    <!-- Back Button -->
    <div class="p-6 pb-0">
      <button 
        @click="$emit('back')"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <i class="text-base">←</i>
        <span class="text-sm">Back</span>
      </button>
    </div>

    <!-- Single Profile Card -->
    <div class="flex-1 p-6 pt-4">
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col">
        
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-8">
            <div class="mb-4">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg overflow-hidden">
                <img 
                  v-if="profileData.imageData" 
                  :src="'data:image/png;base64,' + profileData.imageData" 
                  alt="Profile" 
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ getInitials(profileData.firstName, profileData.fatherName) }}</span>
              </div>
            </div>
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-3 text-gray-600">Loading profile...</span>
            </div>
          </div>
          
          <!-- Profile Content -->
          <div v-else class="flex items-center gap-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg overflow-hidden">
                <img 
                  v-if="profileData.imageData" 
                  :src="'data:image/png;base64,' + profileData.imageData" 
                  alt="Profile" 
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ getInitials(profileData.firstName, profileData.fatherName) }}</span>
              </div>
              <button 
                @click="triggerFileUpload"
                class="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <i class="text-gray-600 text-xs">📷</i>
              </button>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                @change="handleFileUpload"
                class="hidden"
              />
            </div>
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 mb-1">
                {{ profileData.title }} {{ profileData.firstName || 'User' }} {{ profileData.fatherName || 'Name' }} {{ profileData.grandFatherName || '' }}
              </h1>
              <p class="text-base text-gray-600 mb-1">{{ profileData.userType || 'User Type' }}</p>
              <p class="text-base text-gray-600 mb-1">{{ profileData.roleName || '' }}</p>
              <p class="text-sm text-gray-500 mb-1">{{ profileData.email || 'email@example.com' }}</p>
              <p class="text-sm text-gray-500 mb-3">{{ profileData.mobilePhone || 'Phone' }}</p>
              <div class="flex gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {{ profileData.userStatus || 'Status' }}
                </span>
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {{ profileData.userType || 'Type' }}
                </span>
              </div>
            </div>
            <div>
              <button
                @click="fetchUserDetails"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mr-2"
                :disabled="loading"
              >
                🔄 Refresh
              </button>
              <button
                @click="toggleEdit"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isEditing 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                ]"
              >
                {{ isEditing ? 'Cancel' : 'Edit Profile' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Personal Information Form -->
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          <form @submit.prevent="saveProfile" class="h-full flex flex-col">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Title</label>
                <input 
                  type="text" 
                  v-model="profileData.title"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
              </div>
              
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">First Name</label>
                <input 
                  type="text" 
                  v-model="profileData.firstName"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Father's Name</label>
                <input 
                  type="text" 
                  v-model="profileData.fatherName"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
              </div>

              <!-- <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  v-model="profileData.userName"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
              </div> -->

               <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Grandfather's Name</label>
                <input 
                  type="text" 
                  v-model="profileData.grandFatherName"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Gender</label>
                <select 
                  v-model="profileData.gender"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">User Type</label>
                <input 
                  type="text" 
                  v-model="profileData.userType"
                  disabled
                  class="w-full border border-gray-200 bg-gray-50 cursor-not-allowed rounded-lg px-3 py-2 text-sm"
                >
              </div>
              
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  v-model="profileData.email"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
              </div>
              
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Mobile Phone</label>
                <input 
                  type="tel" 
                  v-model="profileData.mobilePhone"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
              </div>
              
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">User Status</label>
                <input 
                  type="text" 
                  v-model="profileData.userStatus"
                  disabled
                  class="w-full border border-gray-200 bg-gray-50 cursor-not-allowed rounded-lg px-3 py-2 text-sm"
                >
              </div>
              
             

              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Role Name</label>
                <input 
                  type="text" 
                  v-model="profileData.roleName"
                  disabled
                  class="w-full border border-gray-200 bg-gray-50 cursor-not-allowed rounded-lg px-3 py-2 text-sm"
                >
              </div>
            </div>

            <div v-if="isEditing" class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="cancelEdit"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="api.pending.value"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium text-sm shadow-lg disabled:opacity-50"
              >
                {{ api.pending.value ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useApiRequest } from '@/composables/useApiRequest';
import { updateProfileData } from '@/features/profile/api/profileApi';
import { getUserById } from '@/features/admin/user/Api/UserApi';
import { toasted } from '@/utils/utils';

const emit = defineEmits(['back']);
const authStore = useAuthStore();
const api = useApiRequest();
const userApi = useApiRequest();

const isEditing = ref(false);
const originalData = ref({});
const fileInput = ref(null);
const loading = ref(false);

const profileData = reactive({
  email: '',
  title: '',
  firstName: '',
  userName: '',
  fatherName: '',
  grandFatherName: '', // <-- Add this line
  roleName: '',        // <-- Add this line
  gender: 'Male',
  mobilePhone: '',
  userStatus: '',
  userType: '',
  providerUuid: '',
  roleUuid: '',
  imageData: null
});

// Fetch user details from API
async function fetchUserDetails() {
  loading.value = true;
  try {
    const userUuid = authStore.auth?.user?.userUuid;
    if (!userUuid) {
      console.error('No user UUID found');
      loadFromAuthStore();
      return;
    }

    userApi.send(
      () => getUserById(userUuid),
      (response) => {
        if (response.success && response.data) {
          Object.assign(profileData, response.data);
          
          // Update auth store with fresh data
          authStore.setAuth({
            ...authStore.auth,
            user: response.data
          });
          
          // Update localStorage
          localStorage.setItem("userDetail", JSON.stringify(response.data));
        } else {
          console.error('No user data found in response:', response);
          loadFromAuthStore();
        }
        loading.value = false;
      },
      (error) => {
        console.error('API call failed:', error);
        loadFromAuthStore();
        loading.value = false;
      }
    );
  } catch (error) {
    console.error('Error fetching user details:', error);
    loadFromAuthStore();
    loading.value = false;
  }
}

// Fallback to load from auth store
function loadFromAuthStore() {
  const user = authStore.auth?.user || JSON.parse(localStorage.getItem('userDetail') || '{}');
  if (user) {
    Object.assign(profileData, {
      email: user.email || '',
      title: user.title || '',
      firstName: user.firstName || '',
      userName: user.userName || '',
      fatherName: user.fatherName || '',
      grandFatherName: user.grandFatherName || '', // <-- Add this line
      roleName: user.roleName || '',               // <-- Add this line
      gender: user.gender || 'Male',
      mobilePhone: user.mobilePhone || '',
      userStatus: user.userStatus || '',
      userType: user.userType || '',
      providerUuid: user.providerUuid || '',
      roleUuid: user.roleUuid || '',
      imageData: user.imageData || null
    });
  }
}

// Load user data on mount
onMounted(() => {
  fetchUserDetails();
});

function getInitials(firstName, fatherName) {
  return `${firstName?.charAt(0) || ''}${fatherName?.charAt(0) || ''}`.toUpperCase();
}

function toggleEdit() {
  if (isEditing.value) {
    cancelEdit();
  } else {
    originalData.value = { ...profileData };
    isEditing.value = true;
  }
}

function cancelEdit() {
  Object.assign(profileData, originalData.value);
  isEditing.value = false;
}

function saveProfile() {
  const updateData = {
    title: profileData.title,
    firstName: profileData.firstName,
    userName: profileData.userName,
    fatherName: profileData.fatherName,
    gender: profileData.gender,
    mobilePhone: profileData.mobilePhone,
    email: profileData.email
  };

  api.send(
    () => updateProfileData(authStore.auth?.user?.userUuid, updateData),
    (res) => {
      if (res.success) {
        const updatedUser = {
          ...authStore.auth.user,
          ...updateData
        };

        authStore.setAuth({
          ...authStore.auth,
          user: updatedUser
        });

        localStorage.setItem("userDetail", JSON.stringify(updatedUser));

        isEditing.value = false;
        toasted(true, 'Profile updated successfully!');
        fetchUserDetails();
      } else {
        toasted(false, res.error || 'Failed to update profile');
      }
    },
    (error) => {
      console.error('Profile update failed:', error);
      toasted(false, 'Failed to update profile');
    }
  );
}

function triggerFileUpload() {
  fileInput.value.click();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toasted(false, 'Please select a valid image file.');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    toasted(false, 'File size must be less than 5MB.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Data = e.target.result.split(',')[1];
    profileData.imageData = base64Data;
    
    const updatedUser = {
      ...authStore.auth.user,
      imageData: base64Data
    };
    
    authStore.setAuth({
      ...authStore.auth,
      user: updatedUser
    });

    localStorage.setItem("userDetail", JSON.stringify(updatedUser));
    toasted(true, 'Profile image updated successfully!');
  };
  reader.onerror = () => {
    toasted(false, 'Failed to process image. Please try again.');
  };
  reader.readAsDataURL(file);
}
</script>