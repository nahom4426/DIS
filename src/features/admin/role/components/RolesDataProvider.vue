<script setup>
import { watch } from "vue";
import { removeUndefined } from "@/utils/utils.js";
import { getAllRoles } from "../Api/RoleApi";
import { useRoles } from "../store/roleStore";
import { usePagination } from "@/composables/usePagination";

const props = defineProps({
  search: String,
});

const roles = useRoles();

const pagination = usePagination({
  store: roles,
  cb: (data) => {
    console.log('🚀 Pagination callback data:', data);
    return getAllRoles({ ...data, ...removeUndefined({ search: props.search }) });
  },
  auto: false,
});

if (!roles.roles.length) {
  console.log('📡 Sending initial roles request...');
  pagination.send();
}

watch(
  () => props.search,
  () => {
    console.log('🔍 Search changed, sending new roles request...');
    pagination.send();
  }
);

function refresh() {
  pagination.send();
}

defineExpose({
  refresh
});
</script>
<template>
  <slot
    :roles="roles.roles"
    :pending="pagination.pending.value"
    :error="pagination.error.value"
    :refresh="refresh"
  />
</template>
