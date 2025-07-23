<script setup>
import { ref } from "vue";
import icons from "@/utils/icons";
import { toasted } from "@/utils/utils";
import DoctorRequests from "../components/DoctorRequests.vue";
import PendingRequests from "../components/PendingRequests.vue";
import CompletedRequests from "../components/CompletedRequests.vue";
import Button from "@/components/Button.vue";
import { openModal } from "@customizer/modal-x";

const items = ["Pending Requests", "In Progress", "Completed"];
const active = ref(0);

const setActive = (item) => {
  active.value = item;
};

const components = [
  {
    name: "Pending Requests",
    component: PendingRequests,
  },
  {
    name: "In Progress", 
    component: DoctorRequests,
  },
  {
    name: "Completed",
    component: CompletedRequests,
  },
];

const search = ref("");
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
      </div>

      <!-- Status Tabs -->
      <div class="bg-white rounded-lg shadow-sm p-1">
        <div class="flex space-x-1">
          <button
            v-for="(item, index) in items"
            :key="index"
            @click="setActive(index)"
            :class="[
              'flex-1 px-6 py-3 text-sm font-medium rounded-md transition-all duration-200',
              active === index
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            {{ item }}
            <span v-if="index === 0" class="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">.</span>
            <span v-if="index === 1" class="ml-2 bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">.</span>
            <span v-if="index === 2" class="ml-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">.</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="bg-white rounded-lg shadow-sm">
      <component :search="search" :is="components[active].component"></component>
    </div>
  </div>
</template>
