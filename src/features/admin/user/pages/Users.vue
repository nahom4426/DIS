<script setup >
import Table from '@/components/Table.vue';
import { useUserStore } from '../store/userStore';
import { getAllUser } from '../Api/UserApi';
import UserStatusRow from '../components/statusrow.vue';
import { usePagination } from '@/composables/usePagination';
import { openModal } from '@customizer/modal-x';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
import DefaultPage from "@/components/DefaultPage.vue";
  import icons from "@/utils/icons";
  
const usersStore = useUserStore();
const pagination = usePagination({
  store: usersStore,
  cb: getAllUser,
});

// When creating a new user object:
const newUser = {
  // ...other fields...
  status: "Active", // or userStatus: "Active"
  // ...other fields...
};

// Example using Axios
import axios from 'axios';

async function deactivateUser(userId) {
  try {
    const response = await axios.patch(`/auth/users/${userId}/status`, {
      status: 'Inactive'
    });
    // Handle success (e.g., show a toast, refresh user list)
  } catch (error) {
    // Handle error (e.g., show error message)
  }
}
</script>

<template>
  <DefaultPage v-slot="{ search }">
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-2">
          <span class=" flex justify-center items-center p-4 bg-primary/10 rounded">
            <div class=" bg-[#263558] rounded-full size-3"></div>
            
          </span>
          <h3>Users</h3>
        </div>

        <div class="flex items-center space-x-4">
          <button  @click.prevent="openModal('AddUser')"
            class="flex justify-center items-center gap-2 rounded-md px-6 py-4 bg-primary text-white">
               <i v-html="icons.plus_circle"></i>
            Add Users
          </button>
        </div>
      </div>

      <Table 
        :pending="pagination.pending.value" 
        :headers="{
          head: [
            'Fullname',
            'Email',
            'phoneNumber',
            //  'User Type',
            'providerName',
            'Role Name',
            'Gender',
            'userStatus',
            'Actions',
          ],
          row: [
            'fullname',
            'email',
            'mobilePhone',
            // 'userType',
            'providerName',
            'roleName',
            'gender',
            'status',
          ]
        }" 
        :rows="usersStore.users"
          :rowCom="UserStatusRow"
        :Fallback="TableRowSkeleton"
      >
       
      </Table>
    </div>
  </DefaultPage>
</template>