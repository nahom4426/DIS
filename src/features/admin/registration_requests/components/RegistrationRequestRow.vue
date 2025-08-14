<script setup>
import { ref } from 'vue';
import { openModal } from '@customizer/modal-x';
import icons from "@/utils/icons";
import { useNotifications } from '@/composables/useNotifications';

const props = defineProps({
  rowData: {
    type: Array,
    required: true
  }
});

const { showSuccess, showInfo } = useNotifications();

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  showDropdown.value[user.userUuid] = false;
}

function handleEdit(user) {
  openModal('EditUser', {
    userUuid: user.userUuid,
    user: user
  });
  showDropdown.value[user.userUuid] = false;
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

const viewRequest = (requestId) => {
  openModal('ViewRegistrationRequest', { requestId });
};

const approveRequest = async (requestId) => {
  // ... approval logic
  showSuccess(
    'Request Approved',
    'The registration request has been approved successfully.',
    '/registration'
  );
};

const rejectRequest = async (requestId) => {
  // ... rejection logic
  showInfo(
    'Request Rejected',
    'The registration request has been rejected.',
    '/registration'
  );
};
</script>

<template>
  <tbody>
    <tr v-for="(row, index) in rowData" :key="row.userUuid" class="hover:bg-gray-50 border-b border-gray-100">
      
      <!-- Profile Picture -->
      <td class="px-4 py-3">
        <div class="flex items-center justify-center">
          <img 
            v-if="row.profilePicture" 
            :src="row.profilePicture" 
            :alt="`${row.firstName} ${row.fatherName}`"
            class="h-12 w-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
          <div v-else class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-200 shadow-sm">
            <span class="text-white font-semibold text-sm">{{ row.firstName?.charAt(0) }}{{ row.fatherName?.charAt(0) }}</span>
          </div>
        </div>
      </td>
      
      <!-- Full Name -->
      <td class="px-4 py-3">
        <div class="text-sm font-semibold text-gray-900">
          {{ row.title }} {{ row.firstName }} {{ row.fatherName }}
        </div>
      </td>
      
      <!-- Email -->
      <td class="px-4 py-3">
        <div class="text-sm text-gray-900 max-w-40 truncate" :title="row.email">
          {{ row.email }}
        </div>
      </td>
      <td class="px-3 py-3 text-sm text-gray-900 capitalize">
        {{ row.role }}
      </td>
      <td class="px-3 py-3 text-sm text-gray-900">
        {{ row.providerName }}
      </td>
      <td class="px-3 py-3 text-sm text-gray-900">
        {{ row.mobilePhone }}
      </td>
      <td class="px-3 py-3 text-sm text-gray-900">
        {{ formatDate(row.submittedDate) }}
      </td>
      <td class="px-3 py-3">
        <span :class="getStatusClass(row.status)" class="px-2 py-1 text-xs font-medium rounded-full capitalize">
          {{ row.status }}
        </span>
      </td>
      
      <!-- Gender -->
      <td class="px-4 py-3">
        <div class="text-sm text-gray-900 capitalize">
          {{ row.gender }}
        </div>
      </td>
      
      <!-- User Type -->
      <td class="px-4 py-3">
        <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getUserTypeColor(row.userType)]">
          {{ row.userType }}
        </span>
      </td>
      
      <!-- Role -->
      <td class="px-4 py-3">
        <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', getRoleColor(row.roleName)]">
          {{ row.roleName }}
        </span>
      </td>
      
      <!-- Provider -->
      <td class="px-4 py-3">
        <div class="text-sm text-gray-900 font-medium">
          {{ row.providerName }}
        </div>
      </td>
      
      <!-- Status -->
      <td class="px-4 py-3">
        <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', getStatusColor(row.userStatus)]">
          {{ row.userStatus }}
        </span>
        <div v-if="row.deleted" class="text-xs text-red-600 mt-1">
          (Deleted)
        </div>
      </td>
      
      <!-- Created Date -->
      <td class="px-4 py-3">
        <div class="text-sm text-gray-900">
          {{ formatDate(row.createdAt) }}
        </div>
      </td>
      
      <!-- UUID -->
      <td class="px-4 py-3">
        <div class="flex items-center space-x-2">
          <code class="text-xs bg-gray-100 px-2 py-1 rounded font-mono max-w-24 truncate" :title="row.userUuid">
            {{ row.userUuid.substring(0, 8) }}...
          </code>
          <button 
            @click="copyToClipboard(row.userUuid)"
            class="text-gray-400 hover:text-gray-600 text-xs"
            title="Copy full UUID"
          >
            📋
          </button>
        </div>
      </td>
      
      <!-- Actions -->
      <td class="px-4 py-3 text-right relative">
        <Button
          size="sm"
          type="secondary"
          @click="toggleDropdown(row.userUuid)"
          class="inline-flex items-center"
        >
          <component :is="icons.dots_vertical" class="h-4 w-4" />
        </Button>
        
        <div v-if="showDropdown[row.userUuid]" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
          <div class="py-1">
            <button @click="handleView(row)" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              <component :is="icons.eye" class="h-4 w-4 mr-2" />
              View Details
            </button>
            <button @click="handleEdit(row)" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              <component :is="icons.edit" class="h-4 w-4 mr-2" />
              Edit User
            </button>
            <hr class="my-1">
            <button @click="copyToClipboard(JSON.stringify(row, null, 2))" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              📋 Copy All Data
            </button>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<<<<<<< HEAD
=======





>>>>>>> 914adcad66d095f313eaa8c6281f53d4ca0760d7
