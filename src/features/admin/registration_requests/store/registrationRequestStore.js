import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRegistrationRequestStore = defineStore('registrationRequests', () => {
  const requests = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Pagination
  const totalItems = ref(0);
  const totalPages = ref(1);
  const currentPage = ref(0);
  const pageSize = ref(25);

  function set(data) {
    // expects { requests, totalItems, totalPages, currentPage, pageSize }
    requests.value = data?.requests || [];
    totalItems.value = data?.totalItems ?? 0;
    totalPages.value = data?.totalPages ?? 1;
    currentPage.value = data?.currentPage ?? 0;
    pageSize.value = data?.pageSize ?? 25;
  }

  function add(request) {
    requests.value.unshift(request);
  }

  function update(userUuid, updates) {
    const index = requests.value.findIndex(req => req.userUuid === userUuid);
    if (index !== -1) {
      requests.value.splice(index, 1, { ...requests.value[index], ...updates });
    }
  }

  function remove(userUuid) {
    const index = requests.value.findIndex(req => req.userUuid === userUuid);
    if (index !== -1) {
      requests.value.splice(index, 1);
    }
  }

  function getByUuid(userUuid) {
    return requests.value.find(req => req.userUuid === userUuid);
  }

  function setLoading(v) { loading.value = v; }
  function setError(e) { error.value = e; }

  function clear() {
    requests.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
    currentPage.value = 0;
    pageSize.value = 25;
    loading.value = false;
    error.value = null;
  }

  return {
    requests,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    set,
    add,
    update,
    remove,
    getByUuid,
    setLoading,
    setError,
    clear,
  };
});
