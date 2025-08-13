import { defineStore } from "pinia";
import { ref } from "vue";

export const useDrugStore = defineStore("drugStore", () => {
  const drugs = ref([]);
  const totalPages = ref(1);
  const currentPage = ref(1);
  const itemsPerPage = ref(25);

  function getAll() {
    return drugs.value;
  }

  function set(data) {
    console.log("Setting drugs in store:", data);

    let dataArray = [];
    if (Array.isArray(data)) {
      dataArray = data;
    } else if (data?.content && Array.isArray(data.content)) {
      dataArray = data.content;
    } else if (typeof data === "object" && data !== null) {
      dataArray = [data];
    }

    if (!dataArray.length) {
      console.error("No valid drug data provided");
      return;
    }

    drugs.value = dataArray.map(item => ({
      drugName: item.drugName || "",
      dosage: item.dosage || "",
      indications: item.indications || "",
      cautions: item.cautions || "",
      drugInteractions: item.drug_interactions || "",
      contraindications: item.contraindications || "",
      sideEffects: item.side_effects || "",
      doseAndAdministration: item.dose_and_administration || "",
      storage: item.storage || "",
      subcategories: item.subcategories || "",
      categories: item.categories || "",
      totalPages: item.totalPages || 0
    }));

    if (dataArray[0]?.totalPages) {
      totalPages.value = dataArray[0].totalPages;
    }
  }

  function add(drug) {
    drugs.value.unshift(drug);
  }

  function update(drugName, data) {
    const idx = drugs.value.findIndex(d => d.drugName === drugName);
    if (idx === -1) {
      console.warn(`[Drug Store] No drug found with name: ${drugName}`);
      return;
    }
    drugs.value.splice(idx, 1, {
      ...drugs.value[idx],
      ...data
    });
  }

  function remove(drugName) {
    const idx = drugs.value.findIndex(d => d.drugName === drugName);
    if (idx !== -1) {
      drugs.value.splice(idx, 1);
    }
  }

  function setPage(page) {
    currentPage.value = page;
  }

  function setLimit(limit) {
    itemsPerPage.value = limit;
  }

  return {
    drugs,
    totalPages,
    currentPage,
    itemsPerPage,
    getAll,
    set,
    add,
    update,
    remove,
    setPage,
    setLimit
  };
});
