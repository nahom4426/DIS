<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['confirm', 'cancel']);

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}

function getRequestTypes() {
  const requestType = props.data?.requestType || props.data?.formData?.requestType;
  switch(requestType) {
    case 'patientSpecific':
      return 'Patient Specific';
    case 'academic':
      return 'Academic';
    case 'other':
      return 'Other';
    default:
      return requestType || 'Not specified';
  }
}

// Helper function to get patient info
function getPatientInfo() {
  return props.data?.patientInfo || props.data?.formData?.patientInfo || {};
}

// Helper function to get form data
function getFormData() {
  return props.data?.formData || props.data || {};
}

function getQuestionText() {
  return getFormData().description || 
         getFormData().requestQuestion || 
         props.data?.description || 
         props.data?.requestQuestion || 
         'No question provided';
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh]">
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
            <div class="bg-white p-4 rounded border">
              <span class="text-lg text-gray-900 font-medium">{{ getRequestTypes() }}</span>
            </div>
          </div>

          <!-- Patient Information Card -->
          <div v-if="(data?.requestType === 'patientSpecific' || data?.formData?.requestType === 'patientSpecific')" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Patient Information
            </h3>
            <div class="bg-white p-6 rounded border">
              <!-- Basic Patient Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-600">Age:</label>
                  <div class="text-gray-900 font-medium">{{ getPatientInfo().patientAge || 'Not provided' }}</div>
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-600">Sex:</label>
                  <div class="text-gray-900 font-medium capitalize">{{ getPatientInfo().patientGender || 'Not provided' }}</div>
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-600">Weight:</label>
                  <div class="text-gray-900 font-medium">{{ getPatientInfo().weight ? `${getPatientInfo().weight} kg` : 'Not provided' }}</div>
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-600">Diagnosis:</label>
                  <div class="text-gray-900 font-medium">{{ getPatientInfo().diagnosis || 'Not provided' }}</div>
                </div>
              </div>

              <!-- Medication Information -->
              <div class="space-y-4">
                <div v-if="getPatientInfo().currentMedication" class="border-t pt-4">
                  <label class="text-sm font-medium text-gray-600 block mb-2">Current Medication:</label>
                  <div class="text-gray-900 bg-gray-50 p-3 rounded border">{{ getPatientInfo().currentMedication }}</div>
                </div>
                
                <div v-if="getPatientInfo().concurrentMedications" class="border-t pt-4">
                  <label class="text-sm font-medium text-gray-600 block mb-2">Concurrent Medications:</label>
                  <div class="text-gray-900 bg-gray-50 p-3 rounded border">{{ getPatientInfo().concurrentMedications }}</div>
                </div>
                
                <div v-if="getPatientInfo().allergies" class="border-t pt-4">
                  <label class="text-sm font-medium text-gray-600 block mb-2">Allergies:</label>
                  <div class="text-gray-900 bg-gray-50 p-3 rounded border">{{ getPatientInfo().allergies }}</div>
                </div>
                
                <div v-if="getPatientInfo().otherInfo" class="border-t pt-4">
                  <label class="text-sm font-medium text-gray-600 block mb-2">Other Information:</label>
                  <div class="text-gray-900 bg-gray-50 p-3 rounded border whitespace-pre-wrap">{{ getPatientInfo().otherInformation }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Request/Question Card - Should always be visible -->
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Request/Question
            </h3>
            <div class="bg-white p-4 rounded border">
              <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ getFormData().description || 'No question provided' }}</p>
            </div>
          </div>

          <!-- Response Information - Should always be visible -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Preferred Response Card -->
            <div v-if="getFormData().preferredResponse" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Preferred Response
              </h3>
              <div class="bg-white p-3 rounded border">
                <span class="text-gray-900 font-medium">{{ getFormData().preferredResponse }}</span>
              </div>
            </div>

            <!-- Response Time Card -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Response Time Needed
              </h3>
              <div class="bg-white p-3 rounded border">
                <span class="text-gray-900 font-medium">{{ getFormData().responseUrgency || 'Not specified' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <button 
          @click="cancel"
          class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium"
        >
          Cancel
        </button>
        <button 
          @click="confirm"
          class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

