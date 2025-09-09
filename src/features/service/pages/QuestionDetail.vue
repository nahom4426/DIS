<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUserQuestions } from '@/features/service/api/questionApi';
import Button from '@/components/Button.vue';
import { useAuthStore } from '@/stores/auth';
import { updateQuestion } from '@/features/service/api/questionApi';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const questionUuid = route.params.id;
const question = ref(null);
const answer = ref(null);
const loading = ref(true);
const error = ref(null);
const userUuid = authStore.auth?.userUuid;
const updating = ref(false);
const updateError = ref(null);
const updateSuccess = ref(false);

const editQuestion = reactive({
  patientAge: '',
  patientType: '',
  patientGender: '',
  weight: '',
  diagnosis: '',
  currentMedication: '',
  concurrentMedication: '',
  allergies: '',
  otherInformation: '',
  responseUrgency: '',
  firstName: '',
  description: ''
});

const isCompleted = computed(() => !!answer.value);

watch(question, (val) => {
  if (val) {
    editQuestion.patientAge = val.patientAge || '';
    editQuestion.patientType = val.patientType || '';
    editQuestion.patientGender = val.patientGender || '';
    editQuestion.weight = val.weight || '';
    editQuestion.diagnosis = val.diagnosis || '';
    editQuestion.currentMedication = val.currentMedication || '';
    editQuestion.concurrentMedication = val.concurrentMedication || '';
    editQuestion.allergies = val.allergies || '';
    editQuestion.otherInformation = val.otherInformation || '';
    editQuestion.responseUrgency = val.responseUrgency || '';
    editQuestion.firstName = val.firstName || '';
    editQuestion.description = val.description || '';
  }
});

async function fetchQuestionDetail() {
  loading.value = true;
  error.value = null;
  try {
    // Fetch all questions for the user (could be optimized if API supports single question fetch)
    const response = await getUserQuestions(userUuid);
    if (response.success && Array.isArray(response.data)) {
      const found = response.data.find(q => q.questionUuid === questionUuid);
      if (found) {
        question.value = found;
        answer.value = found.answer || null;
      } else {
        error.value = 'Question not found.';
      }
    } else {
      error.value = response.error || 'Failed to fetch data.';
    }
  } catch (e) {
    error.value = e.message || 'Unknown error.';
  } finally {
    loading.value = false;
  }
}
async function handleUpdate() {
  updating.value = true;
  updateError.value = null;
  updateSuccess.value = false;
  try {
    const payload = {
      questionStatus: "UNANSWERED",
      patientAge: Number(editQuestion.patientAge),
      patientType: editQuestion.patientType,
      patientGender: editQuestion.patientGender,
      weight: Number(editQuestion.weight),
      diagnosis: editQuestion.diagnosis,
      currentMedication: editQuestion.currentMedication,
      concurrentMedication: editQuestion.concurrentMedication,
      allergies: editQuestion.allergies,
      otherInformation: editQuestion.otherInformation,
      responseUrgency: editQuestion.responseUrgency,
      firstName: editQuestion.firstName,
      description: editQuestion.description
    };
    const response = await updateQuestion(questionUuid, payload);
    if (response.success) {
      updateSuccess.value = true;
      await fetchQuestionDetail();
    } else {
      updateError.value = response.error || "Update failed.";
    }
  } catch (e) {
    updateError.value = e.message || "Update failed.";
  } finally {
    updating.value = false;
  }
}

function displayValue(val) {
  if (
    !val ||
    val === "Request/Question: (use free text space)" ||
    val === "Request/Question:\n(use free text space)"
  ) {
    return "Not provided";
  }
  return val;
}

onMounted(() => {
  fetchQuestionDetail();
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
    <div v-if="loading" class="text-center py-12 text-gray-400">
      Loading details...
    </div>
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>
    <div v-else>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Question Details</h2>
      <div class="mb-6">
        <div class="text-sm text-gray-500 mb-1">
          Submitted: <span class="font-medium text-gray-700">{{ question.createdAt ? new Date(question.createdAt).toLocaleString() : 'N/A' }}</span>
        </div>
        <div class="text-sm text-gray-500 mb-1">
          Updated: <span class="font-medium text-gray-700">{{ question.updatedAt ? new Date(question.updatedAt).toLocaleString() : 'N/A' }}</span>
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">First Name:</label>
          <input v-model="editQuestion.firstName" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Patient Age:</label>
          <input v-model="editQuestion.patientAge" type="number" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Patient Gender:</label>
          <select v-model="editQuestion.patientGender" class="border rounded px-2 py-1 w-full" :disabled="isCompleted">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Type:</label>
          <input v-model="editQuestion.patientType" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Weight:</label>
          <input v-model="editQuestion.weight" type="number" step="any" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Diagnosis:</label>
          <input v-model="editQuestion.diagnosis" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Current Medication:</label>
          <input v-model="editQuestion.currentMedication" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Concurrent Medication:</label>
          <input v-model="editQuestion.concurrentMedication" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Allergies:</label>
          <input v-model="editQuestion.allergies" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Other Information:</label>
          <input v-model="editQuestion.otherInformation" class="border rounded px-2 py-1 w-full" :disabled="isCompleted" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Urgency:</label>
          <select v-model="editQuestion.responseUrgency" class="border rounded px-2 py-1 w-full" :disabled="isCompleted">
            <option value="">Select urgency</option>
            <option value="30-60 min">30-60 min</option>
            <option value="End of day">End of day</option>
            <option value="When time permits">When time permits</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-500">Status:</label>
          <span class="font-medium text-gray-700">{{ question.questionStatus || 'UNANSWERED' }}</span>
        </div>
      </div>
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Question</h3>
        <textarea
          :value="question.description || question.question || editQuestion.description || 'No question provided'"
          class="p-4 bg-gray-50 rounded border border-gray-200 text-gray-900 whitespace-pre-line w-full"
          rows="3"
          :disabled="isCompleted"
          readonly
        ></textarea>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Answer</h3>
        <div v-if="answer && (answer.answerDescription || typeof answer === 'string')" class="p-4 bg-green-50 rounded border border-green-200 text-gray-900 whitespace-pre-line">
          {{ answer.answerDescription || answer || 'No answer found.' }}
        </div>
        <div v-else class="p-4 bg-yellow-50 rounded border border-yellow-200 text-gray-700">No answer has been provided yet.</div>
      </div>
      <div class="mt-8 flex flex-col items-end gap-2">
        <div v-if="updating" class="text-blue-500 mb-2">Updating...</div>
        <div v-if="updateSuccess" class="text-green-500 mb-2">Update successful!</div>
        <div v-if="updateError" class="text-red-500 mb-2">{{ updateError }}</div>
        <div class="flex gap-2">
          <Button @click="router.back()" type="outline">Back</Button>
          <Button @click="handleUpdate" type="primary" :disabled="updating || isCompleted">
            Update
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-w-2xl {
  max-width: 42rem;
}
</style>

