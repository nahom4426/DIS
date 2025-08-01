<script setup>
import { defineProps, onMounted, onUnmounted } from 'vue';
import { openModal } from '@customizer/modal-x';
import { useToast } from '@/toast/store/toast';
import { institutions } from "@/features/instution_settings/store/InstitutionsStore";
import icons from "@/utils/icons";
import { changeInstutionStatus } from '../api/institutionsApi';


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
  },
  onView: {
    type: Function,
    default: () => {}
  },
  onEdit: {
    type: Function,
    default: () => {}
  },
  onActivate: {
    type: Function,
    default: () => {}
  },
  onDeactivate: {
    type: Function,
    default: () => {}
  },
  onRowClick: {
    type: Function,
    default: () => {}
  }
});

const { addToast } = useToast();
const payersStore = institutions();

function getStatusStyle(status) {
  if (status === 'ACTIVE' || status === 'Active') {
    return 'bg-[#DFF1F1] text-[#02676B]';
  } else if (status === 'INACTIVE' || status === 'Inactive') {
    return 'bg-red-100 text-red-800';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
}

function getBaseUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
}

function handleImageError(event) {
  event.target.src = '/assets/placeholder-logo.png';
}

function handleEdit(row) {
  console.log('Edit button clicked with row data:', row);
  
  openModal('EditPayer', { 
    payerUuid: row.payerUuid, 
    payer: row,
    onUpdated: (updatedPayer) => {
      console.log('Payer updated:', updatedPayer);
      payersStore.update(updatedPayer.payerUuid, updatedPayer);
    }
  });
}
function handleAddAdmin(row) {
  console.log('Add Admin button clicked with row data:', JSON.stringify(row, null, 2));
  
  // Create the role name based on payer name
  const payerName = row.payerName || '';
  console.log('Payer name:', payerName);
  
  // IMPORTANT: Don't modify the original role name format
  // Instead, use the exact format that's in the database
  const roleName = `PA_${payerName}_Manager`;
  console.log('Generated role name:', roleName);
  
  // Log the modal parameters
  const modalData = {
    payerUuid: row.payerUuid,
    payer: row,
    roleName: roleName,
    onUpdated: (updatedPayer) => {
      console.log('Payer updated:', updatedPayer);
      payersStore.update(updatedPayer.payerUuid, updatedPayer);
    }
  };
  
  console.log('Opening modal with data:', modalData);
  
  // Pass the data as a single object
  openModal('AddUser', modalData);
}

function toggleDropdown(event, rowId) {
  event.stopPropagation();
  closeAllDropdowns();
  const dropdown = document.getElementById(`dropdown-${rowId}`);
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(el => {
    el.classList.add('hidden');
  });
}

onMounted(() => {
  window.addEventListener('click', closeAllDropdowns);
});

onUnmounted(() => {
  window.removeEventListener('click', closeAllDropdowns);
});

function handleEditWithClose(row) {
  closeAllDropdowns();
  handleEdit(row);
}
function handleAddAdminWithClose(row) {
  closeAllDropdowns();
  handleAddAdmin(row);
}
function handleViewWithClose(rowId) {
  closeAllDropdowns();
  props.onView(rowId);
}

async function handleActivateWithClose(payerUuid) {
  closeAllDropdowns();
  try {
    const response = await changeInstutionStatus(payerUuid, 'ACTIVE');
    if (response.success) {
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: 'Payer has been activated successfully'
      });
      payersStore.update(payerUuid, { status: 'ACTIVE' });
    } else {
      throw new Error(response.error || 'Failed to activate payer');
    }
  } catch (error) {
    addToast({
      type: 'error',
      title: 'Activation Failed',
      message: error.message || 'An error occurred while activating the payer'
    });
  }
}

async function handleDeactivateWithClose(payerUuid) {
  closeAllDropdowns();
  try {
    const response = await changeInstutionStatus(payerUuid, 'INACTIVE');
    if (response.success) {
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: 'Payer has been deactivated successfully'
      });
      payersStore.update(payerUuid, { status: 'INACTIVE' });
    } else {
      throw new Error(response.error || 'Failed to deactivate payer');
    }
  } catch (error) {
    addToast({
      type: 'error',
      title: 'Deactivation Failed',
      message: error.message || 'An error occurred while deactivating the payer'
    });
  }
}
</script>

<template>
  <tr 
    v-for="(row, idx) in rowData" 
    :key="idx"
    @click.self="onRowClick(row)" 
    class="bg-white border-b hover:bg-gray-50 transition-colors duration-150 ease-in-out" 
  >  
    <td class="p-4 font-medium text-gray-500">{{ idx + 1 }}</td>  

    <!-- Payer Logo Column (added to match provider) -->

    <td class="p-3 py-4" v-for="key in rowKeys" :key="key">  
      <div v-if="key === 'status'" class="truncate">  
        <span 
          class="px-2.5 py-1 rounded-full text-xs font-medium"
          :class="getStatusStyle(row.status)"
        >
          {{ row.status }}
        </span>
      </div>
      <div v-else-if="key === 'totalContracts'" class="truncate">  
        <span class="text-gray-700">
          {{ row.totalContracts || 0 }}
        </span>
      </div>
      
      <div v-else-if="key === 'payerName'" class="text-gray-700 flex items-center gap-2.5 ">
       
      <div class="flex justify-center items-center">
        <img 
          v-if="row.logoBase64" 
          :src="row.logoBase64" 
          alt="Payer Logo" 
          class="h-10 w-10 object-contain rounded-full border border-gray-200"
        />
        <img 
          v-else-if="row.logoUrl" 
          :src="row.logoUrl" 
          alt="Payer Logo" 
          class="h-10 w-10 object-contain rounded-full border border-gray-200"
        />
        <!-- <img 
          v-else-if="row.logoPath" 
          :src="`${getBaseUrl()}/payer/logo/${row.logoPath}`" 
          alt="Payer Logo" 
          class="h-10 w-10 object-contain rounded-full border border-gray-200"
          @error="handleImageError"
        /> -->
        <div v-else class="h-10 w-10 text-center bg-gray-200 rounded-full flex items-center justify-center">
          <span class="text-gray-500 text-xs">No Logo</span>
        </div>
      </div>
       <div>
        {{ row.payerName }}
      </div>
      </div>
      <span v-else class="text-gray-700">
        {{ row[key] }}
      </span>
    </td>  

    <td class="p-3" >  
      <div class="dropdown-container relative ">
        <button 
          @click.stop="toggleDropdown($event, row.payerUuid || row.id)"
          class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        <div 
          :id="`dropdown-${row.payerUuid || row.id}`"
          class="dropdown-menu hidden absolute right-0 z-10 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
          <div class="py-1" role="none">
            <button 
              @click.stop="handleEditWithClose(row)"
              class="block w-full text-center py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div class="flex items-center justify-start pl-4 gap-4">
                <i v-html="icons.edits" />
                Edit
              </div>
            </button>
            <button 
              @click.stop="handleAddAdminWithClose(row)"
              class="block w-full text-center py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div class="flex items-center text-primary justify-start pl-4 gap-4">
                <i v-html="icons.assign" />
                Assign Admin
              </div>
            </button>
          
            
            <!-- <button 
              @click.stop="handleViewWithClose(row.payerUuid || row.id)"
              class="block w-full text-center py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div class="flex items-center justify-start pl-4 gap-4">
                <i v-html="icons.details" />
                Detail
              </div>
            </button> -->
            
            <template v-if="row.status">
              <button 
                v-if="row.status === 'INACTIVE' || row.status === 'Inactive'"
                @click.stop="handleActivateWithClose(row.payerUuid || row.id)"
                class="block w-full text-center py-2 text-sm text-[#28A745] hover:bg-gray-100"
              >
                <div class="flex items-center justify-start pl-4 gap-4">
                  <i v-html="icons.activate" />
                  Activate
                </div>
              </button>
             
              <button 
                v-if="row.status === 'ACTIVE' || row.status === 'Active'"
                @click.stop="handleDeactivateWithClose(row.payerUuid || row.id)"
                class="block w-full text-center py-2 text-sm text-[#DB2E48] hover:bg-gray-100"
              >
                <div class="flex items-center justify-start pl-4 gap-4">
                  <i v-html="icons.deactivate" />
                  Deactivate
                </div>
              </button>
            </template>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.dropdown-container {
  min-width: 80px;
}

.dropdown-menu {
  min-width: 150%;
  transition: all 0.2s ease-out;
  transform-origin: top right;
}

.dropdown-menu.hidden {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
}

.dropdown-menu:not(.hidden) {
  opacity: 1;
  transform: scale(1);
}

.dropdown-container button {
  width: 100%;
}
</style>
