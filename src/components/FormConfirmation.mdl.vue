<script setup>
import { closeModal } from '@customizer/modal-x';
import Button from './Button.vue';

const props = defineProps({
  data: Object,
});

function sendRequest() {
  if (props.data?.onConfirm) {
    props.data.onConfirm();
  }
  closeModal();
}

function cancel() {
  closeModal();
}

function getRequestTypes() {
  const types = [];
  if (props.data?.formData?.requestType?.patientSpecific) types.push('Patient Specific');
  if (props.data?.formData?.requestType?.academic) types.push('Academic');
  if (props.data?.formData?.requestType?.other) types.push('Other');
  return types.join(', ');
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-blue-600 text-white p-6 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold">Drug Information Request Summary</h2>
          <p class="text-blue-100 text-sm mt-1">Please review your information before sending</p>
        </div>
        <button @click="cancel" class="text-white hover:text-gray-200 p-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <div class="space-y-6">
          <!-- Request Type Card -->
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Request Type
            </h3>
            <div class="bg-white p-3 rounded border">
              <span class="text-blue-600 font-medium">{{ getRequestTypes() }}</span>
            </div>
          </div>

          <!-- Patient Information Card (if applicable) -->
          <div v-if="data?.formData?.requestType?.patientSpecific" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Patient Information
            </h3>
            <div class="bg-white p-4 rounded border space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Age:</span>
                  <span class="text-gray-900">{{ data.formData.patientInfo.age }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Sex:</span>
                  <span class="text-gray-900">{{ data.formData.patientInfo.sex }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Weight:</span>
                  <span class="text-gray-900">{{ data.formData.patientInfo.weight }} kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-600">Diagnosis:</span>
                  <span class="text-gray-900">{{ data.formData.patientInfo.diagnosis }}</span>
                </div>
              </div>
              
              <div v-if="data.formData.patientInfo.currentMedication" class="border-t pt-3">
                <div class="flex justify-between items-start">
                  <span class="font-medium text-gray-600">Current Medication:</span>
                  <span class="text-gray-900 text-right max-w-xs">{{ data.formData.patientInfo.currentMedication }}</span>
                </div>
              </div>
              
              <div v-if="data.formData.patientInfo.concurrentMedications" class="border-t pt-3">
                <div class="flex justify-between items-start">
                  <span class="font-medium text-gray-600">Concurrent Medications:</span>
                  <span class="text-gray-900 text-right max-w-xs">{{ data.formData.patientInfo.concurrentMedications }}</span>
                </div>
              </div>
              
              <div v-if="data.formData.patientInfo.allergies" class="border-t pt-3">
                <div class="flex justify-between items-start">
                  <span class="font-medium text-gray-600">Allergies:</span>
                  <span class="text-gray-900 text-right max-w-xs">{{ data.formData.patientInfo.allergies }}</span>
                </div>
              </div>
              
              <div v-if="data.formData.patientInfo.otherInfo" class="border-t pt-3">
                <div class="flex justify-between items-start">
                  <span class="font-medium text-gray-600">Other Information:</span>
                  <span class="text-gray-900 text-right max-w-xs">{{ data.formData.patientInfo.otherInfo }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Request/Question Card -->
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Request/Question
            </h3>
            <div class="bg-white p-4 rounded border">
              <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ data?.formData?.requestQuestion }}</p>
            </div>
          </div>

          <!-- Response Time Card -->
          <div v-if="data?.formData?.responseNeeded" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Response Time Needed
            </h3>
            <div class="bg-white p-3 rounded border">
              <span class="text-orange-600 font-medium">{{ data?.formData?.responseNeeded }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer with Send Button -->
      <div class="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
        <button 
          @click="cancel"
          class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        
        <button 
          @click="sendRequest"
          class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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

