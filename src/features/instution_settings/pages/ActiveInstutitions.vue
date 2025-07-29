<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import Table from "@/components/Table.vue";
import DefaultPage from "@/components/DefaultPage.vue";
import ActiveInstitutionsDataProvider from "../components/ActiveInstitutionsDataProvider.vue";
import Button from "@/components/Button.vue";
import { Status } from "@/types/interface"; // If this is TypeScript enum, you'll need to replace it or convert to a JS object.
import { addToast } from "@/toast";
import { openModal } from "@customizer/modal-x";
import { useApiRequest } from "@/composables/useApiRequest";
import {
  changeInstitutionStatus,
  deleteInstitutionStatus,
} from "../api/institutionSettingsApi";
import StatusRow from "../components/StatusRow.vue";
import { institutions } from "../store/InstitutionsStore";
import icons from "@/utils/icons";
import { useDrugStore } from "@/features/service/store/drugStore";
import { getAllDrugs, removeDrug } from "@/features/service/api/drugApi";

const emit = defineEmits(["navigate"]);
const router = useRouter();
const dataProvider = ref();
const store = useDrugStore();
const statusReq = useApiRequest();
const deleteReq = useApiRequest();

function refreshData() {
  console.log("Refreshing institution data");
  if (dataProvider.value) {
    dataProvider.value.refresh();
  }
}

function handlePageChange(page) {
  if (dataProvider.value) {
    dataProvider.value.setPage(page);
  }
}

function handleLimitChange(limit) {
  if (dataProvider.value) {
    dataProvider.value.setLimit(limit);
  }
}

function viewDetails(institution) {
  router.push(`/institution-settings/payers/${institution.payerUuid}`);
}

function openEditModal(drug) {
  console.log("Opening edit modal for drug:", drug);

  if (!drug || !drug.drugUuid) {
    console.error("Invalid drug data:", drug);
    return;
  }

  openModal("EditDrug", drug.drugUuid);
}

function handleDrugUpdated(updatedDrug) {
  console.log("Drug updated:", updatedDrug);
  store.update(updatedDrug.drugUuid, updatedDrug);
  refreshData();
  addToast({
    type: "success",
    title: "Drug Updated",
    message: `Drug "${updatedDrug.drugName}" has been updated successfully`,
  });
}

function handleStatusChange(id, newStatus) {
  statusReq.send(
    () => removeDrug(id),
    (res) => {
      if (res.success) {
        store.remove(id);
        addToast({
          type: "success",
          title: "Drug Removed",
          message: `Drug has been removed successfully`,
        });
        refreshData();
      } else {
        addToast({
          type: "error",
          title: "Remove Failed",
          message: res.error || "Failed to remove drug",
        });
      }
    }
  );
}

function handleDelete(id) {
  if (
    confirm(
      "Are you sure you want to delete this institution? This action cannot be undone."
    )
  ) {
    deleteReq.send(
      () => deleteInstitutionStatus(id),
      (res) => {
        if (res.success) {
          store.remove(id);
          addToast({
            type: "success",
            title: "Institution Deleted",
            message: "Institution has been successfully deleted",
          });
          refreshData();
        } else {
          addToast({
            type: "error",
            title: "Delete Failed",
            message: res.error || "Failed to delete institution",
          });
        }
      }
    );
  }
}

function handleActivate(id) {
  handleStatusChange(id, Status.ACTIVE);
}

function handleDeactivate(id) {
  handleStatusChange(id, Status.INACTIVE);
}

function handleAddDrug() {
  openModal("AddDrug", {
    onAdded: (newDrug) => {
      store.add(newDrug);
      refreshData();
      addToast({
        type: "success",
        title: "Drug Added",
        message: `Drug "${newDrug.drugName}" has been added successfully`,
      });
    },
  });
}

function getBaseUrl() {
  return import.meta.env.VITE_API_URL || "http://localhost:8080/api";
}

function handleImageError(event) {
  event.target.src = "/assets/placeholder-logo.png";
}
</script>

<template>
  <DefaultPage placeholder="Search Drugs">
    
    <!-- Filter Button 
     <template #filter>
      <button
        class="flex justify-center items-center gap-2 rounded-md px-6 py-4 text-primary bg-base-clr3"
      >
        <i v-html="icons.filter"></i>
        <p class="text-base">Filters</p>
      </button>
    </template>-->
    <!-- Add Button -->
    <template #add-action>
      <button
        class="btn flex justify-center items-center text-center gap-2 mx-4 btn-outline border-[1px] rounded-lg h-14 px-6 text-primary border-primary hover:bg-primary/10"
        @click="openModal('Import', 'drug')"
      >
        <i v-html="icons.add_circle" class=""></i>
        Import Drug
      </button>
      <button
        @click.prevent="handleAddDrug"
        class="btn flex justify-center items-center text-center gap-2 rounded-lg h-14 px-8 bg-primary text-white hover:bg-primary-dark"
      >
        <i v-html="icons.add_circle" class=""></i>
        Add Drug
      </button>
    </template>

    <!-- Content -->
    <template #default="{ search }">
      <ActiveInstitutionsDataProvider
        ref="dataProvider"
        :search="search"
        v-slot="{
          institutions,
          pending,
          currentPage,
          itemsPerPage,
          totalPages,
        }"
      >
        <Table
          :pending="pending"
          :headers="{
            head: [
              'Drug Name',
              'Drug Code', 
              'Category',
              'Dosage',
              'Storage',
              'Status',
              'Actions',
            ],
            row: [
              'drugName',
              'drugCode',
              'category',
              'dosage',
              'storage',
              'status',
            ],
          }"
          :rows="institutions"
          :rowCom="StatusRow"
          :cells="{
            // Remove the location cell mapping since we're now showing drug data
          }"
          :pagination="{
            currentPage,
            itemsPerPage,
            totalPages,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange
          }"
          @view="viewDetails"
          @edit="handleEdit"
        >
          <!-- :pagination="{
            currentPage,
            itemsPerPage,
            totalPages,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange
          }" -->
          <template #row>
            <StatusRow
              :rowData="institutions"
              :rowKeys="[
                'payerName',
                'email',
                'tinNumber',
                'totalContracts',
                'telephone',
                'category',
                'status',
              ]"
              :headKeys="[
                '',
                'Institution Name',
                'Email',
                'TIN Number',
                'Contact Phone',
                'Category',
                'Status',
                'Actions',
              ]"
              :onRowClick="(row) => {}"
            />
          </template>
        </Table>
      </ActiveInstitutionsDataProvider>
    </template>
  </DefaultPage>
</template>
