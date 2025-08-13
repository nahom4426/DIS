<script setup>
import { ref } from "vue";
import Table from "@/components/Table.vue";
import DefaultPage from "@/components/DefaultPage.vue";
import PrivilegesDataProvider from "../components/PrivilegesDataProvider.vue";
import icons from "@/utils/icons";
import { useRouter } from "vue-router";
import { useApiRequest } from "@/composables/useApiRequest";
import { deletePrivilege } from "../Api/PrivilegeApi";
import { toasted } from "@/utils/utils";

const router = useRouter();
const dataProvider = ref();

// Add missing variables
const selectedprivilege = ref(null);
const showDetailModal = ref(false);

// Add missing API request composable
const deleteReq = useApiRequest();

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
  console.log('Navigating to edit privilege:', row.privilegeUuid);
  router.push(`/edit_privilege/${row?.privilegeUuid}`);
}

function handleDetailWithClose(row) {
  closeAllDropdowns();
  console.log('Showing details for privilege:', row);
  selectedprivilege.value = row;
  showDetailModal.value = true;
}

function handleDeleteWithClose(privilegeUuid) {
  closeAllDropdowns();
  handleDelete(privilegeUuid);
}

function handleDelete(id) {
  console.log('Attempting to delete privilege:', id);
  if (confirm("Are you sure you want to delete this privilege? This action cannot be undone.")) {
    deleteReq.send(
      () => deletePrivilege(id),
      (res) => {
        console.log('Delete response:', res);
        if (res.success) {
          toasted(true, "privilege deleted successfully");
          if (dataProvider.value) {
            dataProvider.value.refresh();
          }
        } else {
          toasted(false, "", res.error || "Failed to delete privilege");
        }
      }
    );
  }
}
</script>

<template>
  <DefaultPage  placeholder="Search Privileges">
    <!-- <template #filter>
      <button
        class="flex justify-center items-center gap-2 rounded-md px-6 py-4 text-primary bg-base-clr3"
      >
        <i v-html="icons.filter"></i>
        <p class="text-base">Filters</p>
      </button>
    </template> -->

    <template #add-action>
      <button
        class="flex justify-center items-center gap-2 rounded-md px-6 py-4 bg-primary text-white"
        @click="$router.push('/add_privilege')"
      >
        <i v-html="icons.plus_circle"></i>
        <p class="text-base">Add Privilege</p>
      </button>
    </template>

    <template #default="{ search }">
      <PrivilegesDataProvider
        ref="dataProvider"
        :search="search"
        v-slot="{ privileges, pending }"
      >
        <Table
          :pending="pending"
          :headers="{
            head: ['Privilege Name', 'Description', 'Category', 'Actions'],
            row: ['privilegeName', 'privilegeDescription', 'privilegeCategory'],
          }"
          :rows="Array.isArray(privileges) ? privileges : []"
        >
         <template #actions="{row}">
            <div class="dropdown-container relative w-full h-10 flex items-center">
              <button 
                @click.stop="toggleDropdown($event, row.privilegeUuid)"
                class="inline-flex items-center justify-center p-2 w-full h-full text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
                type="button"
                :title="`Actions for ${row.privilegeName}`"
              >
                <i v-html="icons.threeDots" class="text-lg"></i>
              </button>

              <div 
                :id="`dropdown-${row.privilegeUuid}`"
                class="dropdown-menu hidden absolute right-0 top-full z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 mt-1"
              >
                <div class="py-2" privilege="menu">
                  <button 
                    @click.stop="handleEditWithClose(row)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
                    privilege="menuitem"
                  >
                    <i v-html="icons.edits" class="text-blue-600"></i>
                    <span class="font-medium">Edit privilege</span>
                  </button>
                  
                  <button 
                    @click.stop="handleDetailWithClose(row)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-3"
                    privilege="menuitem"
                  >
                    <i v-html="icons.details" class="text-green-600"></i>
                    <span class="font-medium">View Details</span>
                  </button>
                  
                  <div class="border-t border-gray-100 my-1"></div>
                  
                  <button 
                    @click.stop="handleDeleteWithClose(row.privilegeUuid)"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3"
                    privilege="menuitem"
                  >
                    <i v-html="icons.trash || icons.delete" class="text-red-600"></i>
                    <span class="font-medium">Delete privilege</span>
                  </button>
                </div>
              </div>
            </div>
          </template>
    
         
        </Table>
      </PrivilegesDataProvider>
    </template>
  </DefaultPage>
</template>
