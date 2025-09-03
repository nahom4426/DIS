import { defineStore } from 'pinia';
import { ref } from 'vue';
import { computed } from "vue";

const visibleRequests = computed(() => {
  const now = Date.now();
  return store.requests.filter(req => {
    if (!req.lastActionTime) return true; // untouched rows
    // keep row only if < 24h old
    return now - req.lastActionTime < 24 * 60 * 60 * 1000;
  });
});


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
function markLocally(userUuid, newStatus) {
  const index = requests.value.findIndex(req => req.userUuid === userUuid);
  if (index !== -1) {
    requests.value[index] = {
      ...requests.value[index],
      userStatus: newStatus,
      lastActionTime: Date.now()
    };
  }
}

return {
  requests,
  loading,
  error,
  set,
  add,
  update,
  remove,
  getByUuid,
  markLocally // ✅ add here
};

  });


