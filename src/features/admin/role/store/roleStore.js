import { ref } from "vue";
import { defineStore } from "pinia";

export const useRoles = defineStore("allRoleStore", () => {
  const roles = ref([]);

  function set(data) {
    console.log('🏪 Setting roles data in store:', data);
    if (Array.isArray(data)) {
      roles.value = data;
      console.log('✅ Roles set successfully:', roles.value.length, 'roles');
      console.log('📋 First role sample:', roles.value[0]);
    } else {
      console.warn('⚠️ Data is not an array:', data);
      roles.value = [];
    }
  }

  function getAll() {
    return roles.value;
  }
  function add(data) {
    return roles.value.push(add);
  }

  function update(id, data) {
    const idx = roles.value.findIndex((el) => el.roleUuid == id);
    if (idx == -1) return;

    roles.value.splice(idx, 1, data);
  }
  function remove(id) {
    const idx = roles.value.findIndex((el) => el.roleUuid == id);
    if (idx == -1) return;

    roles.value.splice(idx, 1);
  }

  // function updateStatus(id, status) {
  //   const idx = roles.value.findIndex((el) => el.roleUuid == id);
  //   if (idx == -1) return;

  //   roles.value[idx].roleStatus = status;
  // }

  return {
    roles,
    getAll,
    update,
    remove,
    add,
    // updateStatus,
    set,
  };
});
