<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUserQuestions, updateQuestion } from '@/features/service/api/questionApi';
import Button from '@/components/Button.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const questionUuid = route.params.id;
const userUuid = authStore.auth?.userUuid;

const loading = ref(true);
const error = ref(null);
const question = ref(null);
const form = reactive({
  description: '',
  responseUrgency: '',
  patientType: '',
  patientAge: 0,
  patientGender: '',
  weight: 0,
  diagnosis: '',
  currentMedication: '',
  concurrentMedication: '',
  allergies: '',
  otherInformation: ''
});

async function fetchQuestion() {
  loading.value = true;
  error.value = null;
  try {
    const response = await getUserQuestions(userUuid);
    if (response.success && Array.isArray(response.data)) {
      const found = response.data.find(q => q.questionUuid === questionUuid);
      if (found) {
        question.value = found;
        Object.assign(form, {
          description: found.description || '',
          responseUrgency: found.responseUrgency || '',
          patientType: found.patientType || '',
          patientAge: found.patientAge || 0,
          patientGender: found.patientGender || '',
          weight: found.weight || 0,
          diagnosis: found.diagnosis || '',
          currentMedication: found.currentMedication || '',
          concurrentMedication: found.concurrentMedication || '',
          allergies: found.allergies || '',
          otherInformation: found.otherInformation || ''
        });
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
  loading.value = true;
  error.value = null;
  try {
    const updateData = { ...form };
    const response = await updateQuestion(questionUuid, updateData);
    if (response.success) {
      router.back();
    } else {
      error.value = response.error || 'Failed to update question.';
    }
  } catch (e) {
    error.value = e.message || 'Unknown error.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchQuestion();
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
    <div v-if="loading" class="text-center py-12 text-gray-400">
      Loading question...
    </div>
    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>
    <div v-else>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Update Question</h2>
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" rows="4" class="w-full border rounded px-2 py-1"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Response Urgency</label>
          <input v-model="form.responseUrgency" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Patient Type</label>
          <input v-model="form.patientType" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Patient Age</label>
          <input type="number" v-model="form.patientAge" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Patient Gender</label>
          <input v-model="form.patientGender" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <input type="number" v-model="form.weight" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
          <input v-model="form.diagnosis" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Medication</label>
          <input v-model="form.currentMedication" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Concurrent Medication</label>
          <input v-model="form.concurrentMedication" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
          <input v-model="form.allergies" class="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Other Information</label>
          <textarea v-model="form.otherInformation" rows="2" class="w-full border rounded px-2 py-1"></textarea>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button type="outline" @click="router.back()">Cancel</Button>
          <Button type="primary" :disabled="loading" @click="handleUpdate">Update</Button>
        </div>
      </form>
    </div>
  </div>
</template>
