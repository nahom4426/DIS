<script setup>
import Table from '@/components/Table.vue';
import { useRegistrationRequestStore } from '../store/registrationRequestStore';
import { getAllRegistrationRequests } from '../Api/RegistrationRequestApi';
import RegistrationRequestRow from '../components/RegistrationRequestRow.vue';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
import DefaultPage from "@/components/DefaultPage.vue";
import { ref, onMounted } from 'vue';

const requestStore = useRegistrationRequestStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getAllRegistrationRequests();
    if (response.success) {
      requestStore.set(response.data);
    }
  } catch (error) {
    console.error('Error loading registration requests:', error);
  } finally {
    loading.value = false;
  }
});

const filteredRequests = (search) => {
  const list = requestStore.requests?.value || [];

  if (!search || search.trim() === '') {
    return list;
  }
  
  const searchTerm = search.toLowerCase().trim();
  return list.filter(request => 
    request.fullName?.toLowerCase().includes(searchTerm) ||
    request.email?.toLowerCase().includes(searchTerm) ||
    request.roleName?.toLowerCase().includes(searchTerm) ||
    request.providerName?.toLowerCase().includes(searchTerm) ||
    request.mobilePhone?.toLowerCase().includes(searchTerm) ||
    request.userStatus?.toLowerCase().includes(searchTerm) ||
    request.userType?.toLowerCase().includes(searchTerm) ||
    request.gender?.toLowerCase().includes(searchTerm)
  );
};

const tableHeaders = {
  head: ['Name', 'Email', 'Role', 'Provider', 'Mobile', 'Date', 'Status', 'Actions'],
  row: ['fullName', 'email', 'roleName', 'providerName', 'mobilePhone', 'createdAt', 'userStatus'],
};
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