<script setup >
import { ref, onMounted, onUnmounted } from 'vue';
import Table from '@/components/Table.vue';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
import DefaultPage from "@/components/DefaultPage.vue";
import icons from "@/utils/icons";
import RolesDataProvider from '../components/RolesDataProvider.vue';
import { removeRoleById } from '../Api/RoleApi';
import { useApiRequest } from '@/composables/useApiRequest';
import { toasted } from '@/utils/utils';
import { useRouter } from 'vue-router';

const router = useRouter();
const deleteReq = useApiRequest();
const dataProvider = ref(null);
const showDetailModal = ref(false);
const selectedRole = ref(null);

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

function handleEditWithClose(row) {
  closeAllDropdowns();
  console.log('Navigating to edit role:', row.roleUuid);
  router.push(`/edit_role/${row?.roleUuid}`);
}

function handleDetailWithClose(row) {
  closeAllDropdowns();
  console.log('Showing details for role:', row);
  selectedRole.value = row;
  showDetailModal.value = true;
}

function handleDeleteWithClose(roleUuid) {
  closeAllDropdowns();
  handleDelete(roleUuid);
}

function handleDelete(id) {
  console.log('Attempting to delete role:', id);
  if (confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
    deleteReq.send(
      () => removeRoleById(id),
      (res) => {
        console.log('Delete response:', res);
        if (res.success) {
          toasted(true, "Role deleted successfully");
          if (dataProvider.value) {
            dataProvider.value.refresh();
          }
        } else {
          toasted(false, "", res.error || "Failed to delete role");
        }
      }
    );
  }
}

function closeDetailModal() {
  showDetailModal.value = false;
  selectedRole.value = null;
}

onMounted(() => {
  window.addEventListener('click', closeAllDropdowns);
});

onUnmounted(() => {
  window.removeEventListener('click', closeAllDropdowns);
});
</script>

<template>
   <DefaultPage  placeholder="Search Roles">
    <template #filter>
      <button
        class="flex justify-center items-center gap-2 rounded-md px-6 py-4 text-primary bg-base-clr3"
      >
        <i v-html="icons.filter"></i>
        <p class="text-base">Filters</p>
      </button>
    </template>

    <template #add-action>
      <button
        class="flex justify-center items-center gap-2 rounded-md px-6 py-4 bg-primary text-white"
        @click.prevent="$router.push('/create-role')"
      >
        <i v-html="icons.plus_circle"></i>
        <p class="text-base">Add Role</p>
      </button>
    </template>

    <template #default="{ search }">
      <RolesDataProvider
        ref="dataProvider"
        :search="search"
        v-slot="{ roles, pending }"
      >
        {{ console.log('Roles in template:', roles) }}
        
        <Table 
          :pending="pending" 
          :headers="{
            head: [
              'Role Name',
              'Role Description',
              'Actions',
            ],
            row: [
              'roleName',
              'roleDescription',
            ]
          }" 
          :rows="roles"
          :Fallback="TableRowSkeleton"
          :customActions="true"
        >
          <template #actions="{row}">
            <div class="dropdown-container relative w-full h-10 flex items-center">
              <button 
                @click.stop="toggleDropdown($event, row.roleUuid)"
                class="inline-flex items-center justify-center p-2 w-full h-full text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
                type="button"
                :title="`Actions for ${row.roleName}`"
              >
                <i v-html="icons.threeDots" class="text-lg"></i>
              </button>

              <div 
                :id="`dropdown-${row.roleUuid}`"
                class="dropdown-menu hidden absolute right-0 top-full z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 mt-1"
              >
                <div class="py-2" role="menu">
                  <button 
                    @click.stop="handleEditWithClose(row)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
                    role="menuitem"
                  >
                    <i v-html="icons.edits" class="text-blue-600"></i>
                    <span class="font-medium">Edit Role</span>
                  </button>
                  
                  <button 
                    @click.stop="handleDetailWithClose(row)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-3"
                    role="menuitem"
                  >
                    <i v-html="icons.details" class="text-green-600"></i>
                    <span class="font-medium">View Details</span>
                  </button>
                  
                  <div class="border-t border-gray-100 my-1"></div>
                  
                  <button 
                    @click.stop="handleDeleteWithClose(row.roleUuid)"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3"
                    role="menuitem"
                  >
                    <i v-html="icons.trash || icons.delete" class="text-red-600"></i>
                    <span class="font-medium">Delete Role</span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </Table>
      </RolesDataProvider>
    </template>
  </DefaultPage>
  </template>
