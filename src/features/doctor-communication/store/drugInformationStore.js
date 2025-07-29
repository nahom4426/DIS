import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDrugInformationStore = defineStore('drugInformationStore', () => {
  const requests = ref([]);
  const currentRequest = ref(null);
  const loading = ref(false);

  const setRequests = (data) => {
    requests.value = data;
  };

  const addRequest = (request) => {
    requests.value.unshift(request); // Add to beginning for newest first
  };

  const updateRequest = (requestId, updates) => {
    const index = requests.value.findIndex(req => req.requestId === requestId);
    if (index !== -1) {
      requests.value[index] = { ...requests.value[index], ...updates };
    }
  };

  const removeRequest = (requestId) => {
    requests.value = requests.value.filter(req => req.requestId !== requestId);
  };

  const setCurrentRequest = (request) => {
    currentRequest.value = request;
  };

  const getRequestById = (requestId) => {
    return requests.value.find(req => req.requestId === requestId);
  };

  const getUserRequests = (userId) => {
    return requests.value.filter(req => req.submittedBy === userId);
  };

  const getRequestsByStatus = (status) => {
    return requests.value.filter(req => req.status === status);
  };

  return {
    requests,
    currentRequest,
    loading,
    setRequests,
    addRequest,
    updateRequest,
    removeRequest,
    setCurrentRequest,
    getRequestById,
    getUserRequests,
    getRequestsByStatus
  };
});