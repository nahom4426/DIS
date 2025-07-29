<script setup>
import { ref, reactive } from 'vue';
import Button from '@/components/Button.vue';
import { openModal } from '@customizer/modal-x';
import { submitDrugInformationRequest } from '@/features/service/api/drugInformationApi';
import { useApiRequest } from '@/composables/useApiRequest';
import { useAuthStore } from '@/stores/auth';
import { toasted } from '@/utils/utils';

const authStore = useAuthStore();
const submitReq = useApiRequest();

const formData = reactive({
  requestType: '',
  patientInfo: {
    age: '',
    sex: '',
    weight: '',
    diagnosis: '',
    currentMedication: '',
    concurrentMedications: '',
    allergies: '',
    otherInfo: ''
  },
  requestQuestion: '',
  preferredResponse: '',
  responseNeeded: ''
});

const showConfirmation = ref(false);
const emit = defineEmits(['submit', 'back', 'showConfirmation']);

function validateForm() {
  const errors = [];

  // Validate request type
  if (!formData.requestType) {
    errors.push('Please select a request type');
  }

  // Validate patient info if patient specific is selected
  if (formData.requestType === 'patientSpecific') {
    if (!formData.patientInfo.age.trim()) errors.push('Age is required for patient specific requests');
    if (!formData.patientInfo.sex) errors.push('Sex is required for patient specific requests');
    if (!formData.patientInfo.weight.trim()) errors.push('Weight is required for patient specific requests');
    if (!formData.patientInfo.diagnosis.trim()) errors.push('Diagnosis is required for patient specific requests');
  }

  // Validate required fields
  if (!formData.requestQuestion.trim()) {
    errors.push('Request/Question field is required');
  }

  if (!formData.responseNeeded) {
    errors.push('Please select response time needed');
  }

  return errors;
}

function handleSubmit() {
  console.log('=== SUBMIT BUTTON CLICKED ===');
  console.log('Form data:', formData);
  
  const errors = validateForm();
  console.log('Validation errors:', errors);
  
  if (errors.length > 0) {
    console.log('Form has errors, showing alert');
    alert('Please fix the following errors:\n\n' + errors.join('\n'));
    return;
  }

  console.log('Form is valid, navigating to confirmation page');
  // Emit event to parent to show confirmation page
  emit('showConfirmation', formData);
}

function confirmSubmission() {
  const submissionData = {
    requestType: formData.requestType,
    patientInfo: formData.patientInfo,
    requestQuestion: formData.requestQuestion,
    preferredResponse: formData.preferredResponse,
    responseNeeded: formData.responseNeeded,
    submittedAt: new Date().toISOString(),
    submittedBy: authStore.auth?.user?.userUuid || authStore.auth?.user?.id || 'Current User',
    submitterName: authStore.auth?.user?.firstName + ' ' + (authStore.auth?.user?.lastName || authStore.auth?.user?.fatherName || ''),
    submitterEmail: authStore.auth?.user?.email,
    status: 'Pending Review'
  };

  console.log('Submitting form data to API:', submissionData);
  
  // Submit to API
  submitReq.send(
    () => submitDrugInformationRequest(submissionData),
    (response) => {
      if (response.success) {
        console.log('Request submitted successfully:', response.data);
        
        // Also save to localStorage as backup
        const existingRequests = JSON.parse(localStorage.getItem('drugInformationRequests') || '[]');
        existingRequests.push({
          ...submissionData,
          requestId: response.data.requestId || Date.now().toString()
        });
        localStorage.setItem('drugInformationRequests', JSON.stringify(existingRequests));
        
        toasted(true, 'Drug information request submitted successfully!');
        emit('submit', response.data);
      } else {
        console.error('Failed to submit request:', response.error);
        toasted(false, response.error || 'Failed to submit request');
      }
      showConfirmation.value = false;
    }
  );
}

function cancelSubmission() {
  showConfirmation.value = false;
}

function getRequestTypes() {
  switch(formData.requestType) {
    case 'patientSpecific':
      return 'Patient Specific';
    case 'academic':
      return 'Academic';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

function goBack() {
  emit('back');
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header with Back Button -->
    <div class="flex-shrink-0 p-4 bg-white border-b border-gray-200">
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
          <span class="text-sm font-medium">Back</span>
        </button>
        <!--<div class="h-4 w-px bg-gray-300"></div>
        <h1 class="text-lg font-semibold text-gray-900">Drug Information Request</h1>-->
      </div>
    </div>

    <!-- Scrollable Form Content -->
    <div class="flex-1 overflow-y-auto bg-white custom-scrollbar">
      <div class="p-4">
        <!-- Responsive Table Container -->
        <div class="min-w-full">
          <table class="w-full min-w-[800px] border-collapse border border-gray-400">
            <!-- Header Row -->
            <tr>
              <td colspan="2" class="border border-gray-400 p-4 text-center" style="background-color: #ADD8E6;">
                <h2 class="text-xl font-bold text-white">Background Information on Query:</h2>
              </td>
            </tr>

            <!-- Request Type Row -->
            <tr>
              <td class="border border-gray-400 p-4 w-[30%] align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm font-medium text-gray-700">The request is:</span>
              </td>
              <td class="border border-gray-400 p-4 w-[70%] min-w-[400px]">
                <div class="flex flex-wrap gap-4 sm:gap-6">
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.requestType"
                      value="patientSpecific"
                      class="mr-2"
                    />
                    <span class="text-sm">Patient specific</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.requestType"
                      value="academic"
                      class="mr-2"
                    />
                    <span class="text-sm">Academic</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.requestType"
                      value="other"
                      class="mr-2"
                    />
                    <span class="text-sm">Other</span>
                  </label>
                </div>
              </td>
            </tr>

            <!-- Patient Information Row -->
            <tr v-if="formData.requestType === 'patientSpecific'">
              <td class="border border-gray-400 p-4 align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm text-gray-700">
                  If Patient specific, Please record patient information that you feel may be helpful in 
                  answering your request (such as patient's age, sex, weight; disease states, laboratory 
                  values, medications, allergies etc...).
                </span>
              </td>
              <td class="border border-gray-400 p-4 min-w-[400px]">
                <div class="space-y-4">
                  <!-- Responsive Grid for Patient Info -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Age:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.age"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Sex:</label>
                      <select 
                        v-model="formData.patientInfo.sex"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Wt (kgs):</label>
                      <input 
                        type="number" 
                        v-model="formData.patientInfo.weight"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Weight in kg"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Diagnosis:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.diagnosis"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Primary diagnosis"
                      />
                    </div>
                  </div>

                  <!-- Full Width Fields -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Current Medication:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.currentMedication"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="List current medications"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Concurrent medication/s:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.concurrentMedications"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="List concurrent medications"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Allergies:</label>
                      <input 
                        type="text" 
                        v-model="formData.patientInfo.allergies"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="List known allergies"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Other information related to Patient:</label>
                      <textarea 
                        v-model="formData.patientInfo.otherInfo"
                        rows="3"
                        class="w-full border border-gray-300 rounded px-2 py-1 text-sm resize-none"
                        placeholder="Additional patient information"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Request/Question Row -->
            <tr>
              <td class="border border-gray-400 p-4 align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm font-medium text-gray-700">
                  Request/Question: <br>
                  <span class="text-xs text-gray-500">(use free text space)</span>
                </span>
              </td>
              <td class="border border-gray-400 p-4 min-w-[400px]">
                <textarea 
                  v-model="formData.requestQuestion"
                  rows="6"
                  placeholder="Please describe your drug information request or question in detail..."
                  class="w-full h-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  required
                ></textarea>
              </td>
            </tr>

            <!-- Response Time Row -->
            <tr>
              <td class="border border-gray-400 p-4 align-top min-w-[200px]" style="background-color: #c5e1eb;">
                <span class="text-sm font-medium text-gray-700">Response needed in:</span>
              </td>
              <td class="border border-gray-400 p-4 min-w-[400px]">
                <div class="flex flex-wrap gap-4 sm:gap-6">
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseNeeded" 
                      value="prompt"
                      class="mr-2"
                    />
                    <span class="text-sm">Prompt</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseNeeded" 
                      value="30-60-min"
                      class="mr-2"
                    />
                    <span class="text-sm">30-60 min</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseNeeded" 
                      value="end-of-day"
                      class="mr-2"
                    />
                    <span class="text-sm">End of day</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="formData.responseNeeded" 
                      value="when-time-permits"
                      class="mr-2"
                    />
                    <span class="text-sm">When time permits</span>
                  </label>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Fixed Submit Button - Make it responsive -->
    <div class="flex-shrink-0 p-4 bg-white border-t border-gray-200">
      <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button 
          @click="goBack"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium transition-colors order-2 sm:order-1"
        >
          Cancel
        </button>
        
        <button 
          @click="handleSubmit"
          class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 sm:py-2 rounded text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl order-1 sm:order-2 w-full sm:w-auto"
          type="button"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Submit Request
          </span>
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">Drug Information Request Summary</h2>
            <p class="text-blue-100 text-sm mt-1">Please review your information before sending</p>
          </div>
          <button @click="cancelSubmission" class="text-white hover:text-gray-200 p-1">
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
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Request Type</h3>
              <div class="bg-white p-3 rounded border">
                <span class="text-blue-600 font-medium">{{ getRequestTypes() }}</span>
              </div>
            </div>

            <!-- Patient Information Card -->
            <div v-if="formData.requestType.patientSpecific" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div class="bg-white p-4 rounded border space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span class="font-medium">Age:</span> {{ formData.patientInfo.age }}</div>
                  <div><span class="font-medium">Sex:</span> {{ formData.patientInfo.sex }}</div>
                  <div><span class="font-medium">Weight:</span> {{ formData.patientInfo.weight }} kg</div>
                  <div><span class="font-medium">Diagnosis:</span> {{ formData.patientInfo.diagnosis }}</div>
                </div>
                <div v-if="formData.patientInfo.currentMedication">
                  <span class="font-medium">Current Medication:</span> {{ formData.patientInfo.currentMedication }}
                </div>
                <div v-if="formData.patientInfo.concurrentMedications">
                  <span class="font-medium">Concurrent Medications:</span> {{ formData.patientInfo.concurrentMedications }}
                </div>
                <div v-if="formData.patientInfo.allergies">
                  <span class="font-medium">Allergies:</span> {{ formData.patientInfo.allergies }}
                </div>
                <div v-if="formData.patientInfo.otherInfo">
                  <span class="font-medium">Other Information:</span> {{ formData.patientInfo.otherInfo }}
                </div>
              </div>
            </div>

            <!-- Request/Question Card -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Request/Question</h3>
              <div class="bg-white p-4 rounded border">
                <p class="text-gray-900 whitespace-pre-wrap">{{ formData.requestQuestion }}</p>
              </div>
            </div>

            <!-- Response Time Card -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Response Time Needed</h3>
              <div class="bg-white p-3 rounded border">
                <span class="text-orange-600 font-medium">{{ formData.responseNeeded }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <button 
            @click="cancelSubmission"
            class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="confirmSubmission"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Send Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Force scrollbar to always show */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Force scrollbar visibility */
.custom-scrollbar::-webkit-scrollbar-corner {
  background: #f1f1f1;
}

/* Ensure inputs are properly sized */
input, select, textarea {
  max-width: 100%;
  box-sizing: border-box;
}

/* Responsive adjustments for small screens */
@media (max-width: 640px) {
  .min-w-[800px] {
    min-width: 600px;
  }
}
</style>





