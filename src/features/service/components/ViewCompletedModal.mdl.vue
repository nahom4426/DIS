<script setup>
import { ref, onMounted } from 'vue';
// import { getUserQuestions } from '@/features/service/api/questionApi';
import { getUserQuestions } from '@/features/service/api/questionApi';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  questionUuid: {
    type: String,
    required: true
  }
});

const authStore = useAuthStore();
const request = ref(null);
const loading = ref(true);
const error = ref(null);

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function fetchRequestDetail() {
  loading.value = true;
  error.value = null;
  if (!props.questionUuid) {
    error.value = 'No question selected. Please try again.';
    loading.value = false;
    return;
  }
  try {
    const userUuid = authStore.auth?.userUuid;
    const response = await getUserQuestions(userUuid);

    if (response.success && Array.isArray(response.data)) {
      const found = response.data.find(q => q.questionUuid === props.questionUuid);
      if (found) {
        request.value = found;
      } else {
        error.value = `Request not found for questionUuid: ${props.questionUuid}`;
      }
    } else {
      error.value = response.error || 'Request not found.';
    }
  } catch (e) {
    error.value = e.message || 'Unknown error.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRequestDetail();
});
</script>

<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Completed Request Details</h2>
    <div v-if="loading" class="text-center py-12 text-gray-400">Loading details...</div>
    <div v-else-if="error" class="text-center py-12 text-red-500">{{ error }}</div>
    <div v-else>
      <div class="mb-6 space-y-1">
        <div class="text-sm text-gray-500">Submitted: <span class="font-medium text-gray-700">{{ formatDate(request.createdAt) }}</span></div>
        <div class="text-sm text-gray-500">Updated: <span class="font-medium text-gray-700">{{ formatDate(request.updatedAt) }}</span></div>
        <div class="text-sm text-gray-500">Type: <span class="font-medium text-gray-700">{{ request.patientType }}</span></div>
        <div class="text-sm text-gray-500">Urgency: <span class="font-medium text-gray-700">{{ request.responseUrgency }}</span></div>
        <div class="text-sm text-gray-500">Status: <span class="font-medium text-gray-700">{{ request.questionStatus }}</span></div>
        <div class="text-sm text-gray-500">Completed By: <span class="font-medium text-gray-700">{{ request.answer?.answerGiverFirstName || '-' }}</span></div>
        <div class="text-sm text-gray-500">First Name: <span class="font-medium text-gray-700">{{ request.firstName }}</span></div>
        <div class="text-sm text-gray-500">Patient Age: <span class="font-medium text-gray-700">{{ request.patientAge }}</span></div>
        <div class="text-sm text-gray-500">Patient Gender: <span class="font-medium text-gray-700">{{ request.patientGender }}</span></div>
        <div class="text-sm text-gray-500">Weight: <span class="font-medium text-gray-700">{{ request.weight }}</span></div>
        <div class="text-sm text-gray-500">Diagnosis: <span class="font-medium text-gray-700">{{ request.diagnosis }}</span></div>
        <div class="text-sm text-gray-500">Current Medication: <span class="font-medium text-gray-700">{{ request.currentMedication }}</span></div>
        <div class="text-sm text-gray-500">Concurrent Medication: <span class="font-medium text-gray-700">{{ request.concurrentMedication }}</span></div>
        <div class="text-sm text-gray-500">Allergies: <span class="font-medium text-gray-700">{{ request.allergies }}</span></div>
        <div class="text-sm text-gray-500">Other Information: <span class="font-medium text-gray-700">{{ request.otherInformation }}</span></div>
      </div>
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Question</h3>
        <div class="p-4 bg-gray-50 rounded border border-gray-200 text-gray-900 whitespace-pre-line">
          {{ request.description || 'No question found.' }}
        </div>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Answer</h3>
        <div v-if="request.answer && (request.answer.answerDescription || typeof request.answer === 'string')" class="p-4 bg-green-50 rounded border border-green-200 text-gray-900 whitespace-pre-line">
          {{ request.answer.answerDescription || request.answer || 'No answer found.' }}
        </div>
        <div v-else class="p-4 bg-yellow-50 rounded border border-yellow-200 text-gray-700">No answer has been provided yet.</div>
      </div>
      <div class="mt-8 flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Close</button>
      </div>
    </div>
  </div>
</template>

<!-- NOTE: The parent component must pass a valid questionUuid prop to this modal.
     Example usage in parent:
     <ViewCompletedModalMdl :questionUuid="selectedQuestionUuid" @close="closeModal" /> -->


