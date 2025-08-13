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
        
        <!-- Profile Header - Compact -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Loading profile...</span>
          </div>
          
          <!-- Profile Content -->
          <div v-else class="flex items-center gap-6">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg overflow-hidden">
                <img 
                  v-if="profileData.profileImage" 
                  :src="profileData.profileImage" 
                  alt="Profile" 
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ getInitials(profileData.firstName, profileData.lastName) }}</span>
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
                {{ profileData.title }} {{ profileData.firstName || 'User' }} {{ profileData.lastName || 'Name' }}
              </h1>
              <p class="text-base text-gray-600 mb-1">{{ profileData.department || 'Department' }}</p>
              <p class="text-sm text-gray-500 mb-1">{{ profileData.email || 'email@example.com' }}</p>
              <p class="text-sm text-gray-500 mb-3">{{ profileData.roleName || 'Role' }}</p>
              <div class="flex gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Active</span>
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>
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
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Role</label>
                <input 
                  type="text" 
                  v-model="profileData.roleName"
                  disabled
                  class="w-full border border-gray-200 bg-gray-50 cursor-not-allowed rounded-lg px-3 py-2 text-sm"
                >
              </div>
              
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  v-model="profileData.lastName"
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
                <label class="block text-xs font-medium text-gray-700">Phone</label>
                <input 
                  type="tel" 
                  v-model="profileData.phone"
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
                <label class="block text-xs font-medium text-gray-700">Department</label>
                <select 
                  v-model="profileData.department"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
                  <option>Internal Medicine</option>
                  <option>Pedietdacs</option>
                  <option>Surcers</option>
                  <option>Obstutgics & Gynecery</option>
                  <option>Embrgency Mestcine</option>
                  <option>Cardiology & Gynecology</option>
                  <option>Nemeolory</option>
                  <option>Orthopgdicscy Medicine</option>
                  <option>Drdmatoloiy</option>
                  <option>Psyohiatrg</option>
                 <option>Raoiology</option>
                  <option>Aoesthnsiology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Dermatology</option>
                  <option>Psychiatry</option>
                  <option>Radiology</option>
                  <option>Anesthesiology</option>
                </select>
              </div>
              
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-700">License Number</label>
                <input 
                  type="text" 
                  v-model="profileData.licenseNumber"
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
                <label class="block text-xs font-medium text-gray-700">Specialization</label>
                <input 
                  type="text" 
                  v-model="profileData.specialization"
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
                <label class="block text-xs font-medium text-gray-700">Years of Experience</label>
                <input 
                  type="number" 
                  v-model="profileData.experience"
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
                <label class="block text-xs font-medium text-gray-700">Location</label>
                <select 
                  v-model="profileData.location"
                  :disabled="!isEditing"
                  :class="[
                    'w-full border rounded-lg px-3 py-2 text-sm transition-all duration-200',
                    isEditing 
                      ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  ]"
                >
                  <option>Addis Ababa, Ethiopia</option>
                  <option>Bahir Dar, Amhara</option>
                  <option>Mekelle, Tigray</option>
                  <option>Hawassa, SNNPR</option>
                  <option>Adama, Oromia</option>
                  <option>Dire Dawa, Ethiopia</option>
                  <option>Gondar, Amhara</option>
                  <option>Jimma, Oromia</option>
                  <option>Dessie, Amhara</option>
                  <option>Harar, Harari</option>
                </select>
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
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  licenseNumber: '',
  specialization: '',
  experience: 0,
  location: '',
  profileImage: null,
  title: '',
  fatherName: '',
  grandFatherName: '',
  gender: '',
  mobilePhone: '',
  roleUuid: '',
  roleName: ''
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
          const userData = response.data;
          console.log('Fetched user data:', userData);
          
          // Update profile data with fetched information
          profileData.firstName = userData.firstName || '';
          profileData.lastName = userData.lastName || userData.fatherName || '';
          profileData.fatherName = userData.fatherName || '';
          profileData.grandFatherName = userData.grandFatherName || '';
          profileData.email = userData.email || '';
          profileData.phone = userData.mobilePhone || '';
          profileData.mobilePhone = userData.mobilePhone || '';
          profileData.department = userData.department || 'Internal Medicine';
          profileData.licenseNumber = userData.licenseNumber || '';
          profileData.specialization = userData.specialization || 'Infectious Diseases';
          profileData.experience = userData.experience || 0;
          profileData.location = userData.location || 'Addis Ababa, Ethiopia';
          profileData.title = userData.title || 'Dr.';
          profileData.gender = userData.gender || '';
          profileData.roleUuid = userData.roleUuid || '';
          profileData.roleName = userData.roleName || '';
          profileData.profileImage = userData.imageData ? `data:image/png;base64,${userData.imageData}` : null;
          
          // Update auth store with fresh data
          authStore.setAuth({
            ...authStore.auth,
            user: userData
          });
          
        } else {
          console.error('Failed to fetch user details:', response.error);
          loadFromAuthStore(); // Fallback to auth store data
        }
        loading.value = false;
      }
    );
  } catch (error) {
    console.error('Error fetching user details:', error);
    loadFromAuthStore(); // Fallback to auth store data
    loading.value = false;
  }
}

// Fallback to load from auth store
function loadFromAuthStore() {
  const user = authStore.auth?.user;
  if (user) {
    profileData.firstName = user.firstName || '';
    profileData.lastName = user.lastName || user.fatherName || '';
    profileData.fatherName = user.fatherName || '';
    profileData.grandFatherName = user.grandFatherName || '';
    profileData.email = user.email || '';
    profileData.phone = user.mobilePhone || '';
    profileData.mobilePhone = user.mobilePhone || '';
    profileData.department = user.department || 'Internal Medicine';
    profileData.licenseNumber = user.licenseNumber || '';
    profileData.specialization = user.specialization || 'Infectious Diseases';
    profileData.experience = user.experience || 0;
    profileData.location = user.location || 'Addis Ababa, Ethiopia';
    profileData.title = user.title || 'Dr.';
    profileData.gender = user.gender || '';
    profileData.roleUuid = user.roleUuid || '';
    profileData.roleName = user.roleName || '';
    profileData.profileImage = user.imageData ? `data:image/png;base64,${user.imageData}` : null;
  }
}

// Load user data on mount
onMounted(() => {
  fetchUserDetails();
});

function getInitials(firstName, lastName) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
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
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    mobilePhone: profileData.phone,
    department: profileData.department,
    licenseNumber: profileData.licenseNumber,
    specialization: profileData.specialization,
    experience: profileData.experience,
    location: profileData.location
  };

  api.send(
    () => updateProfileData(authStore.auth?.user?.userUuid, updateData),
    (res) => {
      if (res.success) {
        // Update auth store with new profile data
        const updatedUser = {
          ...authStore.auth.user,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          fatherName: profileData.lastName, // Keep fatherName in sync
          email: profileData.email,
          mobilePhone: profileData.phone,
          department: profileData.department,
          licenseNumber: profileData.licenseNumber,
          specialization: profileData.specialization,
          experience: profileData.experience,
          location: profileData.location
        };

        // Update the auth store
        authStore.setAuth({
          ...authStore.auth,
          user: updatedUser
        });

        // Update localStorage
        localStorage.setItem(
          "userDetail",
          JSON.stringify(updatedUser)
        );

        isEditing.value = false;
        toasted(true, 'Profile updated successfully!');
      } else {
        toasted(false, res.error || 'Failed to update profile');
      }
    }
  );
}

function triggerFileUpload() {
  fileInput.value.click();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toasted(false, 'Please select a valid image file.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toasted(false, 'File size must be less than 5MB.');
      return;
    }
    
    // Create file reader to convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      profileData.profileImage = e.target.result;
      
      // Update auth store with new profile image
      const updatedUser = {
        ...authStore.auth.user,
        imageData: e.target.result.split(',')[1] // Remove data:image/png;base64, prefix
      };
      
      authStore.setAuth({
        ...authStore.auth,
        user: updatedUser
      });

      // Update localStorage
      localStorage.setItem(
        "userDetail",
        JSON.stringify(updatedUser)
      );
      
      console.log('Profile image updated');
    };
    reader.readAsDataURL(file);
  }
}
</script>











