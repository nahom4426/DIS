<script setup>
import { ref } from 'vue';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit', 'back']);

function getRequestTypes() {
  const types = [];
  if (props.formData.requestType.patientSpecific) types.push('DIS');
  if (props.formData.patientType.academic) types.push('Academic');
  if (props.formData.requestType.other) types.push('Other');
  return types.join(', ');
}

function handleSend() {
  const submissionData = {
    ...props.formData,
    submittedAt: new Date().toISOString()
  };
  
  console.log('Sending request:', submissionData);
  emit('submit', submissionData);
}

function goBack() {
  emit('back');
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="flex-shrink-0 p-6 bg-white border-b border-gray-200">
      <div class="flex items-center gap-3">
        <button 
          @click="goBack"
          class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-sm font-medium">Back to Form</span>
        </button>
        <div class="h-4 w-px bg-gray-300"></div>
        <h1 class="text-2xl font-bold text-gray-900">Review Your Request</h1>
      </div>
      <p class="text-gray-600 mt-2">Please review your drug information request before sending</p>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Request Type Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Request Type
            </h3>
          </div>
          <div class="p-6">
            <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {{ getRequestTypes() }}
            </div>
          </div>
        </div>

        <!-- Patient Information Card -->
        <div v-if="formData.requestType === 'patientSpecific'" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
          <div class="bg-white p-4 rounded border space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span class="font-medium">Age:</span> {{ formData.patientInfo.patientAge }}</div>
              <div><span class="font-medium">Sex:</span> {{ formData.patientInfo.patientGender }}</div>
              <div><span class="font-medium">Weight:</span> {{ formData.patientInfo.weight }} kg</div>
              <div><span class="font-medium">Diagnosis:</span> {{ formData.patientInfo.diagnosis }}</div>
            </div>
            <div v-if="formData.patientInfo.currentMedication" class="space-y-2">
              <div><span class="font-medium">Current Medication:</span> {{ formData.patientInfo.currentMedication }}</div>
            </div>
            <div v-if="formData.patientInfo.concurrentMedications" class="space-y-2">
              <div><span class="font-medium">Concurrent Medications:</span> {{ formData.patientInfo.concurrentMedications }}</div>
            </div>
            <div v-if="formData.patientInfo.allergies" class="space-y-2">
              <div><span class="font-medium">Allergies:</span> {{ formData.patientInfo.allergies }}</div>
            </div>
            <div v-if="formData.patientInfo.otherInfo" class="space-y-2">
              <div><span class="font-medium">Other Information:</span> {{ formData.patientInfo.otherInfo }}</div>
            </div>
          </div>
        </div>

        <!-- Request/Question Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-purple-50 px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Request/Question
            </h3>
          </div>
          <div class="p-6">
            <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ formData.requestQuestion }}</p>
            </div>
          </div>
        </div>

        <!-- Response Time Card -->
        <div v-if="formData.responseNeeded" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-orange-50 px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Response Time Needed
            </h3>
          </div>
          <div class="p-6">
            <div class="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              {{ formData.responseNeeded }}
            </div>
          </div>
        </div>

        <!-- Preferred Response Card -->
        <div v-if="formData.preferredResponse" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-indigo-50 px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <svg class="w-5 h-5 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Preferred Response Method
            </h3>
          </div>
          <div class="p-6">
            <div class="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium">
              {{ formData.preferredResponse }}
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Fixed Send Button -->
    <div class="flex-shrink-0 p-6 bg-white border-t border-gray-200">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <button 
          @click="goBack"
          class="text-gray-600 hover:text-gray-800 px-6 py-3 text-sm font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Edit
        </button>
        
        <button 
          @click="handleSend"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          Send Request
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}s

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
