<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>
      <form @submit.prevent="handleChangePassword">
        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
          <div class="relative">
            <input :type="showOld ? 'text' : 'password'" v-model="form.oldPassword" placeholder="Enter old password" class="w-full border rounded-lg px-3 py-2 pr-10 text-base" />
            <span @click="showOld = !showOld" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
              <i v-html="showOld ? icons.eye : icons.eyeSlash" />
            </span>
          </div>
        </div>
        <div class="mb-4 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div class="relative">
            <input :type="showNew ? 'text' : 'password'" v-model="form.newPassword" placeholder="Enter new password" class="w-full border rounded-lg px-3 py-2 pr-10 text-base" />
            <span @click="showNew = !showNew" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
              <i v-html="showNew ? icons.eye : icons.eyeSlash" />
            </span>
          </div>
        </div>
        <div class="mb-6 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <div class="relative">
            <input :type="showConfirm ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="Confirm new password" class="w-full border rounded-lg px-3 py-2 pr-10 text-base" />
            <span @click="showConfirm = !showConfirm" class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
              <i v-html="showConfirm ? icons.eye : icons.eyeSlash" />
            </span>
          </div>
        </div>
        <div v-if="error" class="mb-4 text-red-600 text-sm">{{ error }}</div>
        <div v-if="success" class="mb-4 text-green-600 text-sm">{{ success }}</div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-base hover:bg-blue-700 transition">Change Password</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { changePassword } from '@/features/profile/api/changepassApi.js';
import icons from '@/utils/icons';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const error = ref('');
const success = ref('');
const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

async function handleChangePassword() {
  error.value = '';
  success.value = '';
  if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
    error.value = 'All fields are required.';
    return;
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'New password and confirm password do not match.';
    return;
  }
  try {
    const userUuid = authStore.auth?.userUuid;
    const res = await changePassword(userUuid, {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword,
      confirmPassword: form.value.confirmPassword
    });
    // Accept any 2xx response as success, or check for a message
    if ((res.status && res.status >= 200 && res.status < 300) || (res.data && (res.data.success || res.data.message?.toLowerCase().includes('success')))) {
      success.value = 'Password changed successfully.';
      setTimeout(() => {
        router.replace('/dashboard');
      }, 1200);
    } else {
      error.value = res.data?.message || 'Failed to change password.';
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to change password.';
  }
}
</script>

<style scoped>
input {
  outline: none;
}
</style>
