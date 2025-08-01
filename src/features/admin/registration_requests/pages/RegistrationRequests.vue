<script setup>
import Table from '@/components/Table.vue';
import { useRegistrationRequestStore } from '../store/registrationRequestStore';
import { getAllRegistrationRequests } from '../Api/RegistrationRequestApi';
import RegistrationRequestRow from '../components/RegistrationRequestRow.vue';
import TableRowSkeleton from '@/components/TableRowSkeleton.vue';
import DefaultPage from "@/components/DefaultPage.vue";
import { ref, onMounted, computed } from 'vue';

const requestStore = useRegistrationRequestStore();
const loading = ref(false);

// Initialize store with data on mount
onMounted(async () => {
  loading.value = true;
  try {
    const response = await getAllRegistrationRequests();
    console.log('API Response:', response);
    if (response.success) {
      requestStore.set(response.data.requests);
      console.log('Store after set:', requestStore.requests);
    }
  } catch (error) {
    console.error('Error loading registration requests:', error);
  } finally {
    loading.value = false;
  }
});

// Search functionality
const filteredRequests = (search) => {
  if (!search || search.trim() === '') {
    return requestStore.requests;
  }
  
  const searchTerm = search.toLowerCase().trim();
  return requestStore.requests.filter(request => 
    request.fullName.toLowerCase().includes(searchTerm) ||
    request.email.toLowerCase().includes(searchTerm) ||
    request.userType.toLowerCase().includes(searchTerm) ||
    request.licenseNumber.toLowerCase().includes(searchTerm) ||
    request.status.toLowerCase().includes(searchTerm)
  );
};

const tableHeaders = {
  head: ['Name', 'Email', 'Type', 'License', 'Date', 'Status', 'Actions'],
  row: ['index', 'fullName', 'email', 'userType', 'licenseNumber', 'submittedDate', 'status', 'actions'],
};
</script>

<template>
  <DefaultPage placeholder="Search registration requests...">
    <template #first>
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold text-gray-900">Registration Requests</h1>
          <p class="text-sm text-gray-600">Review and manage doctor and pharmacist registration requests</p>
          <p class="text-xs text-blue-600">Total requests: {{ requestStore.requests.length }}</p>
        </div>
      </div>
    </template>

    <template #default="{ search }">
      <div class="bg-white rounded-lg shadow">
        <!-- Debug info -->
        <div class="p-4 bg-gray-100 text-sm">
          <p>Store requests count: {{ requestStore.requests.length }}</p>
          <p>Filtered count: {{ filteredRequests(search).length }}</p>
          <p>Loading: {{ loading }}</p>
          <p>Search: "{{ search }}"</p>
        </div>
        
        <Table
          :headers="tableHeaders"
          :rows="filteredRequests(search)"
          :rowCom="RegistrationRequestRow"
          :pending="loading"
          :Fallback="TableRowSkeleton"
        />
      </div>
    </template>
  </DefaultPage>
</template>


