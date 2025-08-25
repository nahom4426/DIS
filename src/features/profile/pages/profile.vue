<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import ProfileForm from "../components/ProfileForm.vue";
import SecurityForm from "../components/SecurityForm.vue";
import Button from "@/components/Button.vue";
import { useApiRequest } from "@/composables/useApiRequest";
import { updateProfileData, uploadProfilePicture } from "../api/profileApi";
import { convertBase64Image, toasted } from "@/utils/utils";
import { useForm } from "@/components/new_form_builder/useForm";
import icons from "@/utils/icons";
import imageSrc from '@/assets/img/profile.png'; // fallback image
import cardImage from '@/assets/img/profile.png'; // your provided image

const auth = useAuthStore();
const user = auth.auth?.user || {};

//const profilePicture = ref(profileData.imageData || cardImage || imageSrc);
const profilePicture = computed(() => profileData.imageData || cardImage || imageSrc);

async function processProfilePicture() {
  if (profilePicture.value && !profilePicture.value.startsWith("data:image/")) {
    profilePicture.value = `data:image/png;base64,${profilePicture.value}`;
    return
  }

}

processProfilePicture();

const fileInput = ref(null);
const api=useApiRequest()
const profileApi=useApiRequest()
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toasted(false, "Please select a valid image file.");
    return;
  }

  const formData = new FormData();
  formData.append("profilePicture", file);

  const reader = new FileReader();

  reader.onload = (e) => {
    const base64Image = e.target.result;

    profileApi.send(
      () => uploadProfilePicture(formData),
      (res) => {
        if (res.success) {
          profilePicture.value = base64Image;
          authStore.setProfile(base64Image);

          // Update the user object with new image data
          const updatedUser = {
            ...(authStore.auth?.user || {}),
            imageData: base64Image,
            profilePicture: base64Image
          };
          
          authStore.setAuth({
            ...authStore.auth,
            user: updatedUser
          });

          // Update both localStorage keys for compatibility
          localStorage.setItem("userDetail", JSON.stringify(updatedUser));
          localStorage.setItem("doctorCommUser", JSON.stringify(updatedUser));

          // Dispatch custom event to notify DoctorCommLayout
          window.dispatchEvent(new CustomEvent('profileUpdated'));

          toasted(true, "Profile picture updated successfully!");
        } else {
          toasted(false, res.error || "Failed to update profile picture.");
        }
      }
    );
  };

  reader.onerror = () => {
    toasted(false, "Error reading image file.");
  };

  reader.readAsDataURL(file); // Trigger FileReader to get base64
};


const active = ref(0);

const setActive = (item) => {
  active.value = item;
};
const components = [
  {
    name: "Profile",
    component: ProfileForm,
  },
  {
    name: "Security",
    component: SecurityForm,
  },
];
const {submit}=useForm('ProfileForm');

const authStore=useAuthStore();
function handleUpdateProfile({values}){
  
  
  api.send(()=>updateProfileData(authStore.auth?.user?.userUuid,values),res=>{
    if(res.success){

    }
    toasted(res.success,'Profile Updated Successfully',res.error)
  })
}

function goToAdminDashboard() {
  // Replace with your actual route
  window.location.href = '/admin/dashboard';
}
</script>
<template>
  <div class="max-w-full min-h-full">
    <div class="relative h-screen overflow-hidden">
      <div class="h-56 rounded-2xl bg-primary"></div>
      <div class="flex gap-8 absolute top-28 left-8 right-8">
        <div class="bg-white w-fit h-fit space-y-4 rounded-2xl p-4">
          <img
            :src="profilePicture || imageSrc"
            class="rounded-lg w-[259px] h-[206px] object-cover"
            alt="Profile"
          />

          <!-- Hidden file input -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />

          <button
            @click.prevent="triggerFileInput"
            class="flex h-12 gap-4 items-center w-full rounded text-white justify-center font-medium bg-primary hover:bg-primary/80"
            size="xs"
            type="primary"
          >
          <i v-if="profileApi.pending.value" v-html="icons.spinner"/>
          <p v-else>Change Photo</p>
            
          </button>
        </div>
        <div class="bg-white w-full space-y-14 p-6 rounded-2xl">
         <div class=" flex w-full justify-between items-center">
           <div class="flex border border-base-clr rounded w-fit">
            <div
              v-for="(item, index) in components"
              :key="index"
              @click="setActive(index)"
              :class="[
                'px-4 py-3 transition-colors cursor-pointer duration-300',
                active === index
                  ? index === 0
                    ? 'bg-base-clr w-fit text-white rounded-l font-medium'
                    : 'bg-base-clr text-white rounded-r  font-medium'
                  : '',
              ]"
            >
              {{ item.name }}
            </div>
          </div>
          <Button v-if="active===0" :pending="api.pending.value" @click.prevent="submit(handleUpdateProfile)" class=" bg-[#FFD665]  font-medium leading-5" type="">Edit</Button>
         </div>
          <component
            :is="components[active].component"
          ></component>
        </div>
      </div>
    </div>
    <!-- Breadcrumb and Admin Dashboard Button -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <span class="text-gray-500">home /</span>
        <span class="font-semibold text-gray-700">profile</span>
      </div>
      <Button @click="goToAdminDashboard" type="primary" class="bg-blue-500 text-white px-4 py-2 rounded shadow">
        Admin Dashboard
      </Button>
    </div>

    <!-- Profile Card -->
    <div class="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-8 flex items-center justify-between mb-8 shadow">
      <div class="flex items-center gap-6">
        <div class="relative">
          <img
            :src="profilePicture"
            alt="Profile"
            class="w-24 h-24 rounded-lg object-cover border-4 border-white shadow"
          />
          <!-- Camera icon overlay (optional) -->
          <span class="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4m6 0l-6-3"/>
            </svg>
          </span>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Dr. {{ user.firstName || "User Name" }} {{ user.lastName || "" }}</h2>
          <p class="text-gray-600">{{ user.department || "Department" }}</p>
          <p class="text-gray-500">{{ user.email || "email@example.com" }}</p>
          <div class="flex gap-2 mt-2">
            <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Verified</span>
          </div>
        </div>
      </div>
      <Button type="primary" class="bg-blue-500 text-white px-4 py-2 rounded shadow">
        Edit Profile
      </Button>
    </div>

    <!-- Personal Information Table -->
    <div class="bg-white rounded-xl shadow p-8">
      <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label class="block text-gray-500 text-sm mb-1">First Name</label>
          <div class="text-gray-800 font-medium">{{ user.firstName || "" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">Last Name</label>
          <div class="text-gray-800 font-medium">{{ user.lastName || "" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">Email</label>
          <div class="text-gray-800 font-medium">{{ user.email || "" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">Phone</label>
          <div class="text-gray-800 font-medium">{{ user.phone || "" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">Department</label>
          <div class="text-gray-800 font-medium">{{ user.department || "" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">License Number</label>
          <div class="text-gray-800 font-medium">{{ user.licenseNumber || "" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">Specialization</label>
          <div class="text-gray-800 font-medium">{{ user.specialization || "" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">Years of Experience</label>
          <div class="text-gray-800 font-medium">{{ user.yearsOfExperience || "0" }}</div>
        </div>
        <div>
          <label class="block text-gray-500 text-sm mb-1">Location</label>
          <div class="text-gray-800 font-medium">{{ user.location || "" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here if needed */
</style>

