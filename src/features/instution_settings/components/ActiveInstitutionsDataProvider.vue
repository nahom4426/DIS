<script setup>
import { usePagination } from "@/composables/usePagination";
import { watch, computed, onMounted } from "vue";
import { debounce } from "@/utils/debounce";
import { getAllDrugs } from "@/features/service/api/drugApi";
import { useDrugStore } from "../store/DrugStore";


const props = defineProps({
  search: {
    type: String,
    default: "",
  },
});

const store = useDrugStore();

const pagination = usePagination({
  store: store,
  auto: true,
  reset: true,
  cb: (data) =>
    getAllDrugs({
      ...data,
      search: props.search.trim() || undefined,
    }),
});

onMounted(() => {
  if (props.search) {
    pagination.search.value = props.search;
    pagination.send();
  }
});

const debouncedSearch = debounce((newSearch) => {
  pagination.search.value = newSearch;
  pagination.send();
}, 300);

watch(
  () => props.search,
  (newSearch) => {
    debouncedSearch(newSearch);
  }
);

defineExpose({
  refresh: pagination.send,
  currentPage: computed(() => store.currentPage),
  itemsPerPage: computed(() => store.itemsPerPage),
  setPage: store.setPage,
  setLimit: store.setLimit,
});
</script>

<template>
  <slot
    :drugs="store.drugs"               
    :pending="pagination.pending.value"
    :currentPage="store.currentPage"
    :itemsPerPage="store.itemsPerPage"
    :totalPages="store.totalPages"
  />
</template>
