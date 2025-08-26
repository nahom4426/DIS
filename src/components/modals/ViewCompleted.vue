<template>
  <div class="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
    <h2 class="text-xl font-bold mb-4">Completed Request Details</h2>
    <div v-if="request">
      <div class="mb-2"><strong>Request ID:</strong> {{ request.requestId }}</div>
      <div class="mb-2"><strong>Type:</strong> {{ request.requestType }}</div>
      <div class="mb-2"><strong>Patient:</strong> {{ request.patientInfo ? request.patientInfo : 'N/A' }}</div>
      <div class="mb-2"><strong>Question:</strong> {{ request.question }}</div>
      <div class="mb-2"><strong>Response Needed:</strong> {{ request.responseNeeded }}</div>
      <div class="mb-2"><strong>Submitted At:</strong> {{ request.submittedAt }}</div>
      <div class="mb-2"><strong>Completed At:</strong> {{ request.completedAt }}</div>
      <div class="mb-2"><strong>Completed By:</strong> {{ request.completedBy }}</div>
      <div class="mb-2"><strong>Status:</strong> {{ request.status }}</div>
      <div class="mb-2"><strong>Priority:</strong> {{ request.priority }}</div>
    </div>
    <div v-else>
      <p>No request data found.</p>
    </div>
    <div class="mt-6 text-right">
      <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
    </div>
  </div>
</template>

<script setup>
import { closeModal } from "@customizer/modal-x";
import { useModal } from "@customizer/modal-x/store/modal";
const { modals } = useModal();

const props = defineProps({
  request: Object
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
