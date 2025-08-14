<script setup>
import { openModal } from '@customizer/modal-x';
import icons from "@/utils/icons";
import { useNotifications } from '@/composables/useNotifications';

const props = defineProps({
  rowData: {
    type: Array,
    required: true
  },
  rowKeys: {
    type: Array,
    required: true
  },
  headKeys: {
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
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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
    <tr v-for="(row, index) in rowData" :key="row.requestId" class="hover:bg-gray-50">
      <td class="px-3 py-3 text-sm text-gray-900">
        {{ index + 1 }}
      </td>
      <td class="px-3 py-3 text-sm text-gray-900 max-w-32 truncate">
        {{ row.fullName }}
      </td>
      <td class="px-3 py-3 text-sm text-gray-900 max-w-40 truncate">
        {{ row.email }}
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
      <td class="px-3 py-3 text-sm font-medium">
        <button 
          @click="viewRequest(row.requestId)"
          class="text-indigo-600 hover:text-indigo-900 text-xs"
        >
          View
        </button>
      </td>
    </tr>
  </tbody>
</template>






