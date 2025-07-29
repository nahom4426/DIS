import { defineStore } from "pinia";
import { ref } from "vue";

export const useRegistrationRequestStore = defineStore("registrationRequestStore", () => {
  const requests = ref([]);
  const request = ref(null);

  const set = (data) => {
    requests.value = data;
  };

  const add = (data) => {
    requests.value.push(data);
  };

  const update = (id, data) => {
    const index = requests.value.findIndex(req => req.requestId === id);
    if (index !== -1) {
      requests.value[index] = { ...requests.value[index], ...data };
    }
  };

  const remove = (id) => {
    requests.value = requests.value.filter(req => req.requestId !== id);
  };

  const setRequest = (data) => {
    request.value = data;
  };

  const getById = (id) => {
    return requests.value.find(req => req.requestId === id);
  };

  return {
    requests,
    request,
    set,
    add,
    update,
    remove,
    setRequest,
    getById
  };
});


