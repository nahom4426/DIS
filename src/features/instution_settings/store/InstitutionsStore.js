import { defineStore } from "pinia";
import { ref } from "vue";

export const institutions = defineStore("institutionsStore", () => {
  const institutions = ref([]);
  const totalPages = ref(1);
  const currentPage = ref(1);
  const itemsPerPage = ref(25);

  function getAll() {
    return institutions.value;
  }

  function set(data) {
    console.log("Setting institutions in store:", data);

    if (!Array.isArray(data)) {
      console.error("Invalid data format for institutions:", data);
      institutions.value = [];
      return;
    }

    const mappedData = data.map(item => ({
      payerUuid: item.payerUuid || '',
      email: item.email || '',
      payerName: item.payerName || '',
      description: item.description || '',
      telephone: item.telephone || '',
      category: item.category || '',
      level: item.level || '',
      address1: item.address1 || item.address || '',
      address2: item.address2 || '',
      address3: item.address3 || '',
      state: item.state || '',
      country: item.country || 'Ethiopia',
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      status: item.status || 'ACTIVE',
      tinNumber: item.tinNumber || '',
      dependantCoverage: item.dependantCoverage || false,
      payerLogo: item.payerLogo || null,
      logoBase64: item.logoBase64 || null,
      logoPath: item.logoPath || null,
      totalContracts: item.totalContracts || 0,
      contracts: item.contracts || [],
      totalPages: item.totalPages
    }));

    institutions.value = mappedData;

    if (data.length > 0 && data[0].totalPages) {
      totalPages.value = data[0].totalPages;
    }
  }

  function setInstitutions(data) {
    console.log("Setting institutions with setInstitutions:", data);
    set(data);
  }

  function setAll(data) {
    console.log("Setting institutions with setAll:", data);

    const dataArray = Array.isArray(data)
      ? data
      : data?.content || [];

    if (!dataArray.length) {
      console.error("No valid data provided to setAll");
      return;
    }

    const mappedData = dataArray.map(item => ({
      payerUuid: item.payerUuid || '',
      email: item.email || '',
      payerName: item.payerName || '',
      description: item.description || '',
      telephone: item.telephone || '',
      category: item.category || '',
      level: item.level || '',
      address1: item.address1 || item.address || '',
      address2: item.address2 || '',
      address3: item.address3 || '',
      state: item.state || '',
      country: item.country || 'Ethiopia',
      latitude: item.latitude || 0,
      longitude: item.longitude || 0,
      status: item.status || 'ACTIVE',
      tinNumber: item.tinNumber || '',
      dependantCoverage: item.dependantCoverage || false,
      payerLogo: item.payerLogo || null,
      logoBase64: item.logoBase64 || null,
      logoPath: item.logoPath || null,
      totalContracts: item.totalContracts || 0,
      contracts: item.contracts || [],
      totalPages: item.totalPages
    }));

    console.log("Mapped institutions data:", mappedData);
    institutions.value = mappedData;

    if (dataArray.length > 0 && dataArray[0].totalPages) {
      totalPages.value = dataArray[0].totalPages;
    }
  }

  function add(data) {
    console.log("Adding institution to store:", data);
    institutions.value.unshift(data);
  }

  function update(id, data) {
    console.log(`Updating institution with UUID: ${id}`, data);

    console.log("Available payer UUIDs:", institutions.value.map(i => i.payerUuid));

    const idx = institutions.value.findIndex(el => el.payerUuid === id);
    if (idx === -1) {
      console.warn(`[Institution Store] No institution found with UUID: ${id}`);
      if (data.payerUuid) {
        console.log("Institution not found for update, adding instead:", data);
        add(data);
      }
      return;
    }

    institutions.value.splice(idx, 1, {
      ...institutions.value[idx],
      ...data,
    });
    console.log("Institution updated successfully");
  }

  function updateStatus(id, status) {
    console.log(`Updating status for institution with UUID: ${id} to ${status}`);
    update(id, { status });
  }

  function remove(id) {
    const idx = institutions.value.findIndex(el => el.payerUuid === id);
    if (idx === -1) {
      console.warn(`[Institution Store] No institution found with UUID: ${id}`);
      return;
    }

    institutions.value.splice(idx, 1);
  }

  function setPage(page) {
    currentPage.value = page;
  }

  function setLimit(limit) {
    itemsPerPage.value = limit;
  }

  function refreshData() {
    console.log("Refreshing provider data");
    if (dataProvider.value) {
      dataProvider.value.refresh();
    }
  }

  return {
    institutions,
    totalPages,
    currentPage,
    itemsPerPage,
    getAll,
    set,
    setInstitutions,
    setAll,
    add,
    update,
    updateStatus,
    remove,
    setPage,
    setLimit,
    refreshData,
  };
});
